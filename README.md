# Sirius Cloud

Site institucional e console da Sirius Cloud. O repositório é um workspace npm orquestrado pelo Turborepo: web Next.js (`apps/web`) e API NestJS (`apps/api`) são aplicações independentes, e partilham o esquema Prisma/PostgreSQL.

## Desenvolvimento local

```bash
npm install
cp .env.example .env
docker compose up -d postgres
npm run db:generate
npm run db:deploy
npm run dev
```

`npm run dev` usa o Turbo para iniciar a web em `localhost:3000` e a API em `localhost:3001`; a web encaminha `/api/*` à API. Também podes executar `npm run dev:web` ou `npm run dev:api`. Cria uma conta em `/register`. O compose usa credenciais apenas locais; não reutilizes esses valores em produção. Requisitos e configuração de GitHub App, Coolify e pagamentos estão em [docs/deployment/DEPLOYMENT.md](docs/deployment/DEPLOYMENT.md).

## Estado do produto

Projectos, aplicações e facturas são persistidos por organização. Deploy e preview só ficam disponíveis após configurar GitHub App e Coolify. O checkout permanece desactivado até existir um fornecedor de pagamentos com webhook verificável. Bases de dados, DNS, armazenamento, Marketplace, status e suporte ainda são demonstrações; consulta [a matriz de funcionalidades](docs/product/FEATURE_MATRIX.md).

```bash
npm run build
```
