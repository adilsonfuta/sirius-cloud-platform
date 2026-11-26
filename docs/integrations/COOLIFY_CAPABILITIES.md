# Capacidades Coolify

Estado: endpoints verificados na documentação pública; instância real ainda não configurada.

A aplicação usa `COOLIFY_BASE_URL` e `COOLIFY_API_TOKEN` no servidor. A API pública usa Bearer token e base `/api/v1`. Implementámos criação de aplicações públicas ou ligadas a GitHub App privado, pedido de start e deploy de preview com número de PR. Chamadas externas só acontecem depois de um utilizador iniciar a acção no portal e de os parâmetros obrigatórios estarem configurados.

- [Visão geral/autenticação](https://coolify.io/docs/api/overview)
- [Criar aplicação pública](https://coolify.io/docs/api/endpoints/applications/create-public-application)
- [Criar aplicação com GitHub App privado](https://coolify.io/docs/api/endpoints/applications/create-private-github-app-application)
- [Iniciar aplicação](https://coolify.io/docs/api/endpoints/applications/start-application-by-uuid)
- [Deploy por UUID ou pull request](https://coolify.io/docs/api/endpoints/deployments/deploy-by-tag-or-uuid)

Configuração necessária: `COOLIFY_BASE_URL`, `COOLIFY_API_TOKEN`, `COOLIFY_PROJECT_UUID` e `COOLIFY_SERVER_UUID`; para repositórios privados, `COOLIFY_GITHUB_APP_UUID`. O provider privado usado pelo Coolify deve ter os repositórios apropriados. A instalação GitHub da organização na Sirius valida quais repositórios o utilizador autorizou, enquanto a GitHub App configurada no Coolify dá ao Coolify acesso de build.

Limites: não existe webhook GitHub recebido pela Sirius, deploy automático após push, criação/gestão de domínio, configuração de DNS, importação de logs, sincronização de estados, limpeza remota ou reconciliação de recursos órfãos. Antes de produção, comparar o payload com a versão instalada do Coolify e validar com um projecto de teste e permissões mínimas. Não usar acesso directo à base de dados interna do Coolify.
