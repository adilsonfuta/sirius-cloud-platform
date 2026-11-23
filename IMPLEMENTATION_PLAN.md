# Plano de implementação Sirius Cloud

## Estado actual

O repositório iniciou sem código. A homepage oficial e o portal do cliente são a primeira fatia visual do produto. A homepage foi ajustada à composição da referência e recebeu um recorte optimizado da ilustração de servidores. Os dados e acções do dashboard são locais e demonstrativos.

## Fases

| Fase | Estado | Entrega seguinte |
|---|---|---|
| 0. Base do repositório e identidade | IN_PROGRESS | Converter para pnpm/Turborepo, consolidar tokens e documentação inicial |
| 1. Website comercial | IMPLEMENTED (visual) | Validar preços e substituir links de aquisição por fluxos reais |
| 2. Console do cliente | IN_PROGRESS (visual) | Ligar a API, adicionar autenticação e estados de carregamento/erro |
| 3. API e dados | NOT_STARTED | NestJS modular, PostgreSQL/Prisma, contratos OpenAPI |
| 4. Autenticação e multi-tenancy | NOT_STARTED | Sessões seguras, organizações, RBAC e isolamento testado |
| 5. Billing de demonstração | NOT_STARTED | Planos, subscrições, facturas e pagamento simulado |
| 6. Provisionamento e worker | NOT_STARTED | BullMQ, provider mock e operações idempotentes |
| 7. Integração Coolify | NOT_STARTED | Verificar capacidades da API pública e criar adaptador seguro |
| 8. Backoffice | NOT_STARTED | Gestão operacional com RBAC e auditoria |
| 9. Segurança e observabilidade | NOT_STARTED | Threat model, logs, métricas, hardening e pipeline CI |
| 10. Beta | NOT_STARTED | Testes de aceitação, backups/restauro e checklist operacional |

## Próxima tarefa prioritária

Criar a base do monorepo e uma API modular mínima com contratos tipados para organizações e recursos. A UI deve consumir um provider mock explícito antes de qualquer integração externa.

## Verificação actual

- `npm run build`: concluído com sucesso (Next.js 15.5.29).
- `git diff --check`: concluído sem erros.
- Sem autenticação, API, persistência, pagamentos ou provisionamento real.
