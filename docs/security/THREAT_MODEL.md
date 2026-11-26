# Threat model inicial

## Activos

Credenciais de utilizador, organizações e recursos multi-tenant, chaves de GitHub/Coolify/PSP, metadados de workloads, facturas e auditoria.

## Controlos implementados nesta fatia

- Palavras-passe com scrypt e salt aleatório.
- Sessões aleatórias; só o SHA-256 do token é guardado na base de dados. Cookie `HttpOnly`, `SameSite=Lax`, `Secure` em produção e expiração/revogação.
- Endpoints de mutação verificam `Origin`; validação de payloads com Zod.
- Consultas a projectos, aplicações, facturas e sessões incluem o `organizationId` obtido da sessão verificada.
- Secrets de providers ficam apenas no servidor; chamadas externas usam APIs públicas, nunca a base de dados interna do Coolify.
- GitHub App state assinado e de curta duração; tokens de instalação de curta duração não são devolvidos ao browser nem persistidos.
- Deploy só por acção explícita; checkout não configurado falha fechado e a UI não pode liquidar facturas.
- Eventos básicos de criação e deploy registados em AuditLog.

## Riscos/limites ainda abertos

- Rate limiting distribuído, MFA, verificação de email, recuperação de conta, rotação/gestão de sessões e RBAC multi-membro ainda não estão implementados.
- A verificação da sessão no middleware é apenas presença de cookie para navegação. Cada API verifica a sessão na base de dados e é a fronteira de autorização.
- Tokens de Coolify têm de ser limitados pelo operador. O adapter ainda não foi executado contra uma instância real; falha parcial após criação remota pode deixar recursos órfãos.
- GitHub App deve ter só permissões read-only necessárias e instalação restrita aos repositórios do cliente.
- Integração de pagamento está desactivada. Para activá-la faltam fornecedor, credenciais, validação criptográfica do webhook, idempotência e reconciliação.
- Configurar backups, TLS, gestão de segredos, alertas, retenção e rate limiting no ambiente de produção antes de expor o serviço publicamente.

## Ameaças prioritárias

- Acesso cruzado entre organizações (IDOR): consultas e mutações devem continuar a filtrar por tenant; adicionar testes de isolamento antes do beta.
- Roubo de credenciais: adicionar MFA, recuperação segura, rate limits e alertas.
- Abuso de deploy e recursos órfãos: quotas, idempotência, aprovação de acções de custo e reconciliação remota.
- Adulteração de pagamentos: aceitar liquidação apenas após webhook assinado e idempotente do PSP seleccionado.
