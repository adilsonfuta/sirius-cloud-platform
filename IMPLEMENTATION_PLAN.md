# Plano de implementação Sirius Cloud

## Estado actual (2026-11-26)

O site oficial e o console mantêm as referências visuais. A web Next.js (`apps/web`) e a API NestJS (`apps/api`) são workspaces npm orquestrados pelo Turborepo; a web encaminha `/api/*` para o serviço API. A fundação funcional inclui PostgreSQL/Prisma, registo/login com sessão persistente, organização owner, API tenant-scoped para projectos/aplicações/facturas, autorização de repositórios via GitHub App e adapter manual de deploy/preview para Coolify. O console assinala dados ilustrativos nos módulos ainda não ligados. Os serviços externos não têm credenciais nesta workspace.

## Fases

| Fase | Estado | Entrega seguinte |
|---|---|---|
| 0. Base do repositório e identidade | IMPLEMENTED (base) | npm workspaces/Turborepo e tokens visuais; consolidar CI |
| 1. Website comercial | IMPLEMENTED (visual) | Validar preços e substituir links de aquisição por fluxos reais |
| 2. Console do cliente | IN_PROGRESS | Projectos, apps e facturas consomem API; áreas restantes ainda demonstrativas |
| 3. API e dados | IN_PROGRESS | NestJS em `apps/api`, PostgreSQL/Prisma e validação Zod; OpenAPI e rate limiting distribuído pendentes |
| 4. Autenticação e multi-tenancy | IN_PROGRESS | Sessões seguras e isolamento básico; RBAC, MFA e recuperação pendentes |
| 5. Facturação | SCAFFOLDED | Facturas persistentes em Kz; planos/preços e gateway ainda por definir |
| 6. Provisionamento e worker | IN_PROGRESS (síncrono) | Deploy manual por API Coolify; filas, worker e reconciliação pendentes |
| 7. Integração Coolify | IN_PROGRESS (condicionada) | Endpoints públicos verificados e adaptador implementado; sem instância configurada |
| 8. Backoffice | NOT_STARTED | Gestão operacional com RBAC e auditoria |
| 9. Segurança e observabilidade | NOT_STARTED | Threat model, logs, métricas, hardening e pipeline CI |
| 10. Beta | NOT_STARTED | Testes de aceitação, backups/restauro e checklist operacional |

## Próxima tarefa prioritária

Configurar PostgreSQL e GitHub App num ambiente controlado; validar a integração de deploy com uma aplicação de teste no Coolify. Escolher PSP/contrato de comerciante antes de activar checkout. Depois, implementar polling/webhooks de deploy, RBAC e recuperação/MFA.

## Verificação actual

- `npx prisma generate`: concluído.
- `npx tsc --noEmit -p apps/web/tsconfig.json`: concluído.
- `npm run build`: concluído (Prisma generate, NestJS/TypeScript e Next.js 15.5.29 pelo Turborepo).
- PostgreSQL local não foi iniciado nesta workspace porque o daemon Docker não estava disponível; migração aplicada apenas após configuração do serviço pelo operador.
- Pagamentos reais, deployment remoto e webhooks não foram executados.
