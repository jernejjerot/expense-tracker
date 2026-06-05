# Testing Strategy

The test suite validates key business behavior rather than only trivial cases.

## Scope

- Input validation (amount and category checks).
- Expense persistence via JSON repository.
- Monthly summary aggregation by category.
- Budget status (within and over budget).

## Tooling

- `pytest` for unit tests.
- Temporary filesystem fixtures for isolated repository tests.
