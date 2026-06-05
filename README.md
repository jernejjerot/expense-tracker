# Expense Tracker Analyzer Demo

A structured Python CLI expense tracker designed for repository analysis platform testing.

It now also includes a lightweight web dashboard UI built with FastAPI + Jinja2.

The project is intentionally simple to understand, while still reflecting realistic engineering practices:

- layered architecture,
- domain validation rules,
- service layer with business logic,
- test coverage,
- CI pipeline,
- configuration and documentation folders.

## Core Features

- Add expenses with validation (category, amount, date, description).
- List expenses with month/year filters.
- Get monthly summary with totals by category.
- Set monthly budget.
- Check budget status (remaining amount and over-budget detection).
- Use a browser dashboard to add expenses and view monthly analytics.

## Project Structure

```text
.
├── .github/workflows/ci.yml
├── config/
│   ├── settings.example.json
│   └── settings.local.json
├── data/
│   └── sample_expenses.json
├── docs/
│   ├── architecture.md
│   └── testing.md
├── src/expense_tracker/
│   ├── application/services.py
│   ├── config/settings.py
│   ├── domain/
│   │   ├── constants.py
│   │   ├── exceptions.py
│   │   └── models.py
│   ├── infrastructure/repository.py
│   └── interface/
│       ├── cli.py
│       ├── web.py
│       ├── static/styles.css
│       └── templates/index.html
├── tests/
│   ├── conftest.py
│   ├── test_budget_logic.py
│   ├── test_expense_service.py
│   └── test_web_ui.py
├── .editorconfig
├── .gitignore
├── LICENSE
└── pyproject.toml
```

## Local Setup

### 1. Create environment and install dependencies

```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -e .[dev]
```

### 2. Prepare local config

`config/settings.local.json` is already included for local development.

Optional: override config path with environment variable:

```bash
set EXPENSE_TRACKER_CONFIG=config/settings.local.json
```

### 3. Run commands

Add expense:

```bash
expense-tracker add --description "Groceries" --category food --amount 42.90 --date 2026-06-05
```

List expenses:

```bash
expense-tracker list --year 2026 --month 6
```

Set budget:

```bash
expense-tracker budget set --year 2026 --month 6 --amount 1200
```

Budget status:

```bash
expense-tracker budget status --year 2026 --month 6
```

Monthly summary:

```bash
expense-tracker summary --year 2026 --month 6
```

Run web dashboard:

```bash
expense-tracker-web
```

Then open:

```text
http://127.0.0.1:8000
```

## Tests and Lint

```bash
ruff check .
pytest
```

## CI

GitHub Actions workflow in `.github/workflows/ci.yml` runs:

1. dependency installation,
2. lint (`ruff`),
3. tests (`pytest`).

## Notes for Analysis Platforms

This repository contains enough structural signals for deep analysis:

- clear separation of concerns,
- configuration and docs as first-class folders,
- deterministic tests for business behavior,
- CI and repository hygiene files.
