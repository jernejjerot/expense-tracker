# Mini Expense Tracker Monorepo

GitHub-ready TypeScript full-stack project optimized for CI/CD quality analysis.

## Stack

- Frontend: React + Vite (`apps/web`)
- Backend: Node.js + Express + Zod (`apps/api`)
- Persistence: SQLite + Prisma
- Shared contracts: `packages/shared`

## Architecture

- `apps/api`: REST API, domain service, validation, error middleware, Prisma persistence
- `apps/web`: UI for CRUD, filtering and summary trend visualization
- `packages/shared`: shared schemas/types used by both apps

Detailed architecture and flow diagrams are in [docs/architecture.md](docs/architecture.md).

## Repository Structure

```text
.
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── db/
│   │   │   ├── errors/
│   │   │   ├── middleware/
│   │   │   └── modules/expenses/
│   │   └── tests/
│   └── web/
│       ├── src/
│       │   ├── api/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── styles/
│       │   └── utils/
│       └── tests/
├── packages/
│   └── shared/
├── docs/
├── scripts/
└── .github/workflows/
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Database migrate + seed

```bash
npm run migrate
npm run seed
```

### Run (web + api)

```bash
npm run dev
```

- API: `http://localhost:4000`
- Web: `http://localhost:5173`

### Test

```bash
npm run test
npm run test:coverage
```

### Build

```bash
npm run build
```

## API Endpoints

- `GET /api/v1/expenses`
- `POST /api/v1/expenses`
- `PATCH /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`
- `GET /api/v1/expenses/summary/monthly?year=YYYY&month=MM`
- `GET /health`

## Build / Deploy / Release Process

### CI (`ci.yml`)

- Lint, typecheck, test (with coverage), build
- Dependency cache via `setup-node`
- Coverage artifact upload

### Security (`security.yml`)

- `npm audit` (fails on high/critical)
- `gitleaks` secret scan
- Dependency review for pull requests

### Release (`release.yml`)

- Triggered only by tag push `v*`
- Rebuilds project and creates GitHub Release with attached artifacts

### Deploy (`deploy.yml`)

- Triggered on `main`
- Runs staging deployment flow using guarded scripts
- Includes health-check gate and rollback command path

## Quality Standards

- Strict TypeScript settings
- Zod runtime validation
- Standardized API error model
- Coverage thresholds >=80% on key modules
- Concurrency and minimal permissions in workflows

## Contributing and Security

- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- License: [LICENSE](LICENSE)
