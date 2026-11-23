# Threat model inicial

## Activos

Credenciais de utilizador, dados de organizações, segredos de providers, metadados de workloads, facturação e registos de auditoria.

## Ameaças prioritárias

- Acesso cruzado entre organizações por falha de autorização (IDOR).
- Exposição de tokens do Coolify/provider no browser ou logs.
- Provisionamento abusivo, duplicado ou não autorizado.
- Injecção em formulários, API e variáveis de ambiente.
- Perda ou adulteração de facturas e eventos de auditoria.

## Controlos ainda necessários

Autorização por organização em cada operação, gestão de sessão segura, rate limiting, validação de input, armazenamento de segredos fora do código, logs sem dados sensíveis, operações idempotentes e testes de isolamento. Nenhum destes controlos está implementado nesta fase visual.
