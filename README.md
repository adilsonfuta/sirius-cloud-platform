# Sirius Cloud

Primeira implementação da experiência comercial e do portal de cliente Sirius Cloud, com identidade visual dark em azul e violeta e foco no mercado angolano.

## Aplicações incluídas

- `/`: homepage comercial responsiva.
- `/dashboard`: portal de cliente demonstrativo, com navegação, métricas, gráfico filtrável, pesquisa de recursos e criação simulada.

## Desenvolvimento local

```bash
npm install
npm run dev
```

O dashboard usa dados locais de demonstração. A acção “Criar recurso” não provisiona infraestrutura real. A plataforma ainda não tem backend, autenticação, facturação ou integrações cloud. Os preços apresentados na homepage são demonstrativos e carecem de validação comercial.

A arte panorâmica de servidores usada no hero está em `apps/web/public/images/sirius-cloud-servers-hero.png`. Os restantes elementos da interface são componentes HTML/CSS, não uma captura da referência.
