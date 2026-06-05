from __future__ import annotations

from datetime import date
from decimal import Decimal
from pathlib import Path

import uvicorn
from fastapi import FastAPI, Form, Query, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from expense_tracker.application.services import ExpenseService
from expense_tracker.config.settings import load_settings
from expense_tracker.domain.constants import ALLOWED_CATEGORIES
from expense_tracker.domain.exceptions import DomainValidationError, RepositoryError
from expense_tracker.infrastructure.repository import JsonExpenseRepository

app = FastAPI(title="Expense Tracker UI", version="0.1.0")

BASE_DIR = Path(__file__).parent
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))
app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")


def build_service() -> tuple[ExpenseService, str]:
    settings = load_settings()
    repo = JsonExpenseRepository(settings.expenses_file, settings.budgets_file)
    return ExpenseService(repo), settings.currency


@app.get("/", response_class=HTMLResponse)
def dashboard(
    request: Request,
    year: int | None = Query(default=None, ge=2000, le=2100),
    month: int | None = Query(default=None, ge=1, le=12),
    message: str = "",
) -> HTMLResponse:
    current = date.today()
    selected_year = year or current.year
    selected_month = month or current.month

    service, currency = build_service()
    return _render_dashboard(
        request=request,
        service=service,
        currency=currency,
        year=selected_year,
        month=selected_month,
        message=message,
    )


@app.post("/expenses", response_class=HTMLResponse)
def add_expense(
    request: Request,
    description: str = Form(...),
    category: str = Form(...),
    amount: str = Form(...),
    spent_on: str = Form(...),
    year: int = Form(...),
    month: int = Form(...),
) -> HTMLResponse:
    service, currency = build_service()

    try:
        service.add_expense(
            description=description,
            category=category,
            amount=Decimal(amount),
            spent_on=date.fromisoformat(spent_on),
        )
    except (DomainValidationError, RepositoryError, ValueError) as exc:
        return _render_dashboard(
            request=request,
            service=service,
            currency=currency,
            year=year,
            month=month,
            error=f"Cannot add expense: {exc}",
        )

    target = f"/?year={year}&month={month}&message=Expense+saved"
    return RedirectResponse(url=target, status_code=303)


@app.post("/budgets", response_class=HTMLResponse)
def set_budget(
    request: Request,
    amount: str = Form(...),
    year: int = Form(...),
    month: int = Form(...),
) -> HTMLResponse:
    service, currency = build_service()

    try:
        service.set_monthly_budget(year=year, month=month, amount=Decimal(amount))
    except (DomainValidationError, RepositoryError, ValueError) as exc:
        return _render_dashboard(
            request=request,
            service=service,
            currency=currency,
            year=year,
            month=month,
            error=f"Cannot set budget: {exc}",
        )

    target = f"/?year={year}&month={month}&message=Budget+saved"
    return RedirectResponse(url=target, status_code=303)


def _render_dashboard(
    request: Request,
    service: ExpenseService,
    currency: str,
    year: int,
    month: int,
    message: str = "",
    error: str = "",
) -> HTMLResponse:
    expenses = service.list_expenses(year=year, month=month)
    summary = service.monthly_summary(year=year, month=month)
    status = service.budget_status(year=year, month=month)

    summary_total = summary["total"]
    summary_count = summary["count"]
    summary_by_category = summary["by_category"]

    return templates.TemplateResponse(
        request,
        "index.html",
        {
            "year": year,
            "month": month,
            "currency": currency,
            "categories": sorted(ALLOWED_CATEGORIES),
            "expenses": expenses,
            "summary_total": str(summary_total),
            "summary_count": int(summary_count),
            "summary_by_category": summary_by_category,
            "budget_status": status,
            "message": message,
            "error": error,
            "today": date.today().isoformat(),
        },
    )


def run() -> None:
    uvicorn.run("expense_tracker.interface.web:app", host="127.0.0.1", port=8000, reload=True)
