from __future__ import annotations

from collections import defaultdict
from datetime import date
from decimal import Decimal
from uuid import uuid4

from expense_tracker.domain.constants import ALLOWED_CATEGORIES
from expense_tracker.domain.exceptions import DomainValidationError
from expense_tracker.domain.models import Expense, MonthlyBudget
from expense_tracker.infrastructure.repository import ExpenseRepository


class ExpenseService:
    def __init__(self, repository: ExpenseRepository) -> None:
        self.repository = repository

    def add_expense(
        self,
        description: str,
        category: str,
        amount: Decimal,
        spent_on: date,
    ) -> Expense:
        self._validate_description(description)
        self._validate_category(category)
        self._validate_amount(amount)
        self._validate_date(spent_on)

        expense = Expense(
            expense_id=str(uuid4()),
            description=description.strip(),
            category=category,
            amount=amount,
            spent_on=spent_on,
        )

        expenses = self.repository.list_expenses()
        expenses.append(expense)
        self.repository.save_expenses(expenses)
        return expense

    def list_expenses(self, year: int | None = None, month: int | None = None) -> list[Expense]:
        expenses = self.repository.list_expenses()
        if year is not None:
            expenses = [item for item in expenses if item.spent_on.year == year]
        if month is not None:
            expenses = [item for item in expenses if item.spent_on.month == month]
        return sorted(expenses, key=lambda x: x.spent_on)

    def monthly_summary(self, year: int, month: int) -> dict[str, Decimal | dict[str, Decimal]]:
        expenses = self.list_expenses(year=year, month=month)
        by_category: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))
        total = Decimal("0")

        for expense in expenses:
            by_category[expense.category] += expense.amount
            total += expense.amount

        budget = self.repository.get_budget(year=year, month=month)
        remaining = (budget.amount - total) if budget else None

        return {
            "total": total,
            "count": Decimal(str(len(expenses))),
            "by_category": dict(sorted(by_category.items())),
            "budget": budget.amount if budget else None,
            "remaining": remaining,
        }

    def set_monthly_budget(self, year: int, month: int, amount: Decimal) -> MonthlyBudget:
        if month < 1 or month > 12:
            raise DomainValidationError("Month must be between 1 and 12")
        self._validate_amount(amount)

        budget = MonthlyBudget(year=year, month=month, amount=amount)
        self.repository.upsert_budget(budget)
        return budget

    def budget_status(self, year: int, month: int) -> dict[str, Decimal | bool | None]:
        budget = self.repository.get_budget(year=year, month=month)
        summary = self.monthly_summary(year=year, month=month)
        total = summary["total"]
        if not isinstance(total, Decimal):
            raise RuntimeError("Summary total must be Decimal")

        if not budget:
            return {
                "has_budget": False,
                "budget": None,
                "spent": total,
                "remaining": None,
                "is_over_budget": False,
            }

        remaining = budget.amount - total
        return {
            "has_budget": True,
            "budget": budget.amount,
            "spent": total,
            "remaining": remaining,
            "is_over_budget": remaining < 0,
        }

    @staticmethod
    def _validate_description(description: str) -> None:
        if not description or not description.strip():
            raise DomainValidationError("Description cannot be empty")
        if len(description.strip()) > 120:
            raise DomainValidationError("Description cannot exceed 120 characters")

    @staticmethod
    def _validate_category(category: str) -> None:
        if category not in ALLOWED_CATEGORIES:
            supported = ", ".join(sorted(ALLOWED_CATEGORIES))
            raise DomainValidationError(
                f"Unsupported category '{category}'. Use one of: {supported}"
            )

    @staticmethod
    def _validate_amount(amount: Decimal) -> None:
        if amount <= 0:
            raise DomainValidationError("Amount must be greater than zero")

    @staticmethod
    def _validate_date(spent_on: date) -> None:
        if spent_on > date.today():
            raise DomainValidationError("Expense date cannot be in the future")
