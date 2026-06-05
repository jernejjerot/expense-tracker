# Architecture

## Module Diagram

```mermaid
flowchart LR
	UI[apps/web React + Vite] -->|HTTP JSON| API[apps/api Express API]
	API -->|Validation| ZOD[Zod Schemas]
	API -->|Domain logic| SERVICE[ExpenseService]
	SERVICE -->|ORM| PRISMA[Prisma Client]
	PRISMA --> DB[(SQLite)]
	UI --> SHARED[packages/shared]
	API --> SHARED
```

## Data Flow

```mermaid
sequenceDiagram
	participant U as User
	participant W as Web UI
	participant A as API
	participant S as ExpenseService
	participant D as SQLite

	U->>W: Submit expense form
	W->>A: POST /api/v1/expenses
	A->>A: Zod validation
	A->>S: create(input)
	S->>D: insert row via Prisma
	D-->>S: persisted expense
	S-->>A: normalized expense DTO
	A-->>W: 201 Created
	W->>A: GET /api/v1/expenses + summary
	A-->>W: filtered list + monthly trend
```

## Notes

- Shared schemas in `packages/shared` avoid contract drift.
- API errors use explicit `code/message/details` payload.
- Summary trend compares selected month total to previous month.
