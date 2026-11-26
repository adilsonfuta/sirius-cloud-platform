# Desenvolvimento local e configuração das integrações

## Requisitos

- Node.js 20.9 ou superior e npm.
- PostgreSQL 15 ou superior. Docker Compose é opcional para desenvolvimento local.

## Arranque local

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run db:generate
npm run db:deploy
npm run dev
```

A web Next.js fica em `http://localhost:3000` e a API NestJS independente em `http://localhost:3001`; a web encaminha `/api/*` para `API_INTERNAL_URL`. O monorepo usa npm workspaces e Turborepo: `npm run dev` inicia ambos, `npm run dev:web` ou `npm run dev:api` inicia cada aplicação, e `npm run build` gera os dois builds através do Turbo. O compose local publica PostgreSQL em `localhost:5432`; altera a palavra-passe antes de qualquer uso fora da máquina local. Em produção, publica `apps/web` e `apps/api` como serviços separados, executa `npm run build` e `npm run start:api` para a API NestJS, configura `API_INTERNAL_URL` na web para a URL privada da API, define `APP_URL` para o domínio público da web, e configura `DATABASE_URL` num gestor de segredos. Executa `npm run db:deploy` durante a publicação.

Criar conta em `/register`; entrar em `/login`. As sessões são aleatórias, guardadas como hash na base de dados e enviadas em cookie `HttpOnly`, `SameSite=Lax`, com `Secure` em produção. O registo cria uma organização com o utilizador como owner.

## GitHub App

1. Cria uma GitHub App e define o URL de configuração (Setup URL) como `https://<domínio>/api/integrations/github/callback`.
2. Activa instalação por organização e concede `Metadata: Read-only`, `Contents: Read-only` e `Pull requests: Read-only` para previews. Instala a App apenas nas organizações/repositórios que pretendes autorizar.
3. Define `GITHUB_APP_ID`, `GITHUB_APP_SLUG`, `GITHUB_APP_PRIVATE_KEY` e `AUTH_SECRET` (segredo aleatório com pelo menos 32 caracteres) no servidor.
4. Inicia sessão no portal e usa **Ligar GitHub** na página Aplicações. A Sirius confirma a instalação, guarda apenas o ID da instalação e emite tokens de instalação de curta duração no servidor para consultar repositórios autorizados. Os tokens não são enviados ao browser nem guardados.

## Coolify

Activa a API pública do Coolify e cria um token com o menor âmbito disponível. Define `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_PROJECT_UUID` e `COOLIFY_SERVER_UUID`. Para repositórios privados, configura também no Coolify a GitHub App que ele próprio usará e define `COOLIFY_GITHUB_APP_UUID`.

O portal cria o recurso remoto apenas quando um utilizador carrega em iniciar deploy. Previews são solicitados explicitamente por número de pull request; a aplicação Coolify é criada com previews habilitados. Ainda não há recepção de webhooks GitHub nem deploy automático após cada push, nem sincronização do estado/logs de volta do Coolify. Não concedas ao token mais permissões do que as necessárias.

Rotas documentadas pela Coolify: [visão geral da API](https://coolify.io/docs/api/overview), [criar aplicação ligada a GitHub privado](https://coolify.io/docs/api/endpoints/applications/create-private-github-app-application), [criar aplicação pública](https://coolify.io/docs/api/endpoints/applications/create-public-application), [iniciar aplicação](https://coolify.io/docs/api/endpoints/applications/start-application-by-uuid) e [deploy por UUID/PR](https://coolify.io/docs/api/endpoints/deployments/deploy-by-tag-or-uuid). A instalação actual usa API v1 e Bearer token. Confirma os campos contra a versão do teu servidor Coolify antes de ligar produção.

## Facturação e pagamentos

Facturas podem ser criadas por `POST /api/invoices` com `description`, `amountKz` e `dueAt` opcional. Montantes são inteiros em Kz/AOA e pertencem à organização autenticada. O checkout devolve `503 payment_provider_not_configured`; não há PSP seleccionado, contrato de comerciante, credenciais ou webhook implementado. Não marca facturas como pagas até existir confirmação assinada e validada de um fornecedor. Não foram definidos preços de planos nesta implementação.

## Estado e limites

- PostgreSQL, autenticação, sessões, isolamento básico por organização, projectos, aplicações, facturas e auditoria estão implementados na API.
- A autorização actual cria um owner por organização; convites, troca de organização e RBAC completo ainda não existem.
- A instalação GitHub e consultas de repositórios são reais quando a GitHub App está configurada. Tokens são efémeros e mantidos no servidor.
- Coolify não foi ligado a uma instância real nesta workspace. Sem variáveis válidas, as chamadas falham antes de contactar o provider.
- Bases de dados, DNS, storage, Marketplace, métricas, status e suporte continuam demonstrações locais. O banner do portal identifica conteúdo ilustrativo.
- O limite de consultas da GitHub API e a protecção contra brute force devem ser aplicados na infraestrutura/edge em implantação multi-instância; não existe rate limiter distribuído nesta fatia.
- Backups, retenção, recuperação de conta, MFA, verificação de email, webhooks de pagamento, emissão fiscal, reconciliação e políticas comerciais dependem de decisões e serviços ainda não fornecidos.
