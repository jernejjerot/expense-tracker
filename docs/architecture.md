# Architecture Overview

This project follows a layered architecture to keep business logic isolated from infrastructure and CLI concerns.

## Layers

- **domain**: core entities, constants, and domain exceptions.
- **application**: service layer with business rules (validation, summaries, budget checks).
- **infrastructure**: JSON-based repository implementation.
- **interface**: command-line interface and FastAPI web dashboard.
- **config**: settings loader for local and CI runs.

## Why this structure works for analysis

- Clear module boundaries and responsibilities.
- Business logic concentrated in one service class.
- Infrastructure dependency hidden behind repository protocol.
- Testable design via service/repository separation.
