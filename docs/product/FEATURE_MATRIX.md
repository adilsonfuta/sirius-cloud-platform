# Matriz de funcionalidades

| Área | Funcionalidade | Estado | Limites actuais |
|---|---|---|---|
| Website | Homepage alinhada à referência e responsiva | IMPLEMENTED | Preços e ofertas são referências visuais, não catálogo comercial activo |
| Console | Layout responsivo e aviso de conteúdo ilustrativo | IMPLEMENTED | Módulos ainda sem ligação a providers continuam demonstrações |
| Arquitectura | Web Next.js e API NestJS em workspaces independentes dentro de `apps/` no Turborepo | IMPLEMENTED | Web faz proxy de `/api/*`; serviços podem ser publicados separadamente |
| Auth | Registo, login, logout e consulta da sessão | IMPLEMENTED | Sem verificação de email, MFA, recuperação de palavra-passe ou rate limit distribuído |
| Auth | Palavra-passe scrypt, sessão opaca, cookie HttpOnly/SameSite e revogação | IMPLEMENTED | Requer TLS em produção; gestão de sessões activas ainda não existe |
| API | Validação de entrada, autenticação e isolamento por organização | IMPLEMENTED (base) | NestJS em `apps/api`; sem OpenAPI, versionamento de API ou limites distribuídos |
| Organizações | Criação da organização owner no registo | IMPLEMENTED (base) | Convites, multi-organização, troca de organização e RBAC completo pendentes |
| Projectos | Listar, criar, editar, arquivar/restaurar e eliminar sem aplicações | IMPLEMENTED | PostgreSQL; contagens de bases de dados/ambientes ainda não integradas |
| Aplicações | Registar/listar projectos GitHub autorizados por organização | IMPLEMENTED | Requer GitHub App e PostgreSQL configurados |
| GitHub | Instalação com state assinado, JWT da App, tokens curtos e consulta de repositórios | IMPLEMENTED (integração condicionada) | Precisa de GitHub App própria; token nunca é devolvido à UI |
| Coolify | Criar recurso e iniciar deploy manual; preview por PR | IMPLEMENTED (integração condicionada) | Requer token/API/UUIDs; sem sincronização de logs/estado ou deploy automático por push |
| Billing | Criar/listar facturas persistentes em Kz/AOA por organização | IMPLEMENTED (base) | Sem emissão fiscal, impostos, catálogo comercial ou subscrições activas |
| Pagamentos | Contrato adapter e recusa segura de checkout não configurado | SCAFFOLDED | PSP, credenciais, assinatura de webhook e reconciliação ainda não escolhidos |
| Dados | PostgreSQL + Prisma schema e migration inicial | IMPLEMENTED | Serviço PostgreSQL deve ser iniciado/configurado pelo ambiente |
| Bases de dados | Gestão de instâncias e backups | DEMO | Sem provider persistente ligado |
| DNS/domínios | Pesquisa, zonas DNS e SSL | DEMO | Nenhuma alteração externa é feita |
| Storage | Buckets, ficheiros e políticas | DEMO | Sem provider S3 ligado |
| Marketplace | Catálogo e instalação | DEMO | Instalações não provisionam recursos |
| Status, métricas e suporte | Painéis e acções | DEMO | Sem telemetria, tickets ou status page de produção |

## Ambiente local e build

Ver `docs/deployment/DEPLOYMENT.md`. A compilação de produção é verificada com `npm run build`; o banco local requer Docker/PostgreSQL.
