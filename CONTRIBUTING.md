# Contributing

## Development Workflow

1. Create branch from `main`.
2. Run local checks before opening PR:

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

3. Keep PRs small and focused.
4. Include tests for business behavior changes.

## Commit Convention

Use clear commits, for example:

- `feat(api): add monthly summary endpoint`
- `fix(web): handle API validation error`
- `ci: tighten security workflow permissions`

## Pull Request Checklist

- [ ] Lint, typecheck, tests and build pass locally.
- [ ] API contract changes updated in `packages/shared`.
- [ ] Docs updated for behavior changes.
- [ ] No secrets committed.
