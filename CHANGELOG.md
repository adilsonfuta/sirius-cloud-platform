# Changelog

## Unreleased

- Actualizada a homepage com posicionamento para programadores: deploy via Git, pré-visualizações por alteração, suporte em português e pagamentos em Kz, usando a arte de infraestrutura fornecida.
- Substituída a imagem estreita da hero pela nova arte panorâmica de servidores e nuvem, com enquadramento responsivo.
- Acrescentada uma demonstração visual do fluxo de preview e uma indicação de que é possível explorar a plataforma sem cartão internacional; estas mensagens não representam integrações activas de Git, previews ou pagamentos.

- Criada a página `/dashboard/status` conforme a referência, com uptime, estado por categoria, componentes, incidentes, manutenção, histórico e RSS demonstrativos.
- Ligada a entrada “Status” à nova rota.

- Criada a página `/dashboard/documentation` conforme a referência, com guias, tutoriais, categorias, API de exemplo, boas práticas e FAQ interactivos.
- Ligada a entrada “Documentação” à nova rota.

- Criada a página `/dashboard/support` conforme a referência, com tickets, conversa demonstrativa, base de conhecimento, tutoriais, contactos e estado dos serviços. A criação de tickets e respostas é local.
- Ligada a navegação “Suporte” à nova rota.

- Criada a página `/dashboard/billing` conforme a referência, com visão geral da subscrição, consumo, facturas, métodos de pagamento, definições e acções demonstrativas locais. Pagamentos não são processados.
- Ligada a navegação “Facturação” à nova rota.

- Criada a página `/dashboard/marketplace` conforme a referência, com catálogo de aplicações, categorias, pesquisa, ordenação, filtros, detalhes e instalação demonstrativa local.
- Ligada a navegação “Marketplace” à nova rota.

- Criada a página `/dashboard/storage` conforme a referência, com capacidade, utilização, distribuição, plano, buckets, backups, ficheiros, políticas e acessos IAM. Criação e acções são demonstrativas e locais.
- Ligada a navegação “Armazenamento” à nova rota.

- Criada a página `/dashboard/domains` conforme a referência, com filtros, tabela de DNS/SSL, verificação demonstrativa de disponibilidade e painel de resumo/acções rápidas. Não altera domínios ou DNS reais.
- Ligada a navegação “Domínios” à nova rota.

- Criada a página `/dashboard/databases` conforme a referência, com resumo, filtros por motor/estado, tabela seleccionável e painel lateral com visão geral, acesso, backups e métricas. As acções de instância e backup são locais e demonstrativas.
- Ligada a navegação “Bases de dados” à nova rota.

- Criada a página `/dashboard/apps` conforme a referência, com indicadores, filtros, estados de execução, tabela de deployments, paginação e acções demonstrativas.
- Ligada a navegação “Aplicações” às rotas próprias do console.

- Criada a página `/dashboard/projects` conforme a referência, com lista de projectos, métricas, tabs, pesquisa, filtro por cor, arquivar/restaurar e formulário local de criação/edição.
- Ligada a entrada “Projetos” do dashboard à nova rota.

- Actualizado `/dashboard` para seguir a nova referência: organização e navegação, pesquisa, indicadores, gráfico de recursos, deployments, estado da plataforma, cartões de projectos e consumo do plano.
- Tornado funcional o filtro de período, pesquisa local, criação demonstrativa de projecto e menu lateral mobile.

- Refeita a homepage para seguir a referência oficial Sirius Cloud; texto, navegação e cards implementados como HTML/CSS.
- Adicionada navegação mobile expansível e ligação da homepage ao console.

- Criada homepage comercial Sirius Cloud responsiva.
- Criado portal de cliente demonstrativo em `/dashboard`, com navegação, pesquisa, filtros do gráfico e criação local simulada.
- Adicionado setup Next.js e documentação inicial.
- Build de produção validado em 2026-11-23.
