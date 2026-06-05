# Testing Strategy

This repository uses layered tests to protect business logic and delivery quality.

## Scope

- Unit tests:
	- shared schema/format utilities
	- API monthly analytics calculation
- API integration tests:
	- CRUD endpoints
	- input validation errors
	- monthly summary response
- Frontend component/util tests:
	- summary cards rendering
	- formatting functions

## Tooling

- `vitest` for all workspaces
- `supertest` for API integration tests
- `@testing-library/react` for UI component behavior

## Coverage Gates

- Coverage threshold configured to at least 80% for key modules in:
	- `apps/api/vitest.config.ts`
	- `apps/web/vite.config.ts`
	- `packages/shared/vitest.config.ts`
