from __future__ import annotations

import json
from pathlib import Path
from typing import Protocol

from expense_tracker.domain.exceptions import RepositoryError
from expense_tracker.domain.models import Expense, MonthlyBudget


class ExpenseRepository(Protocol):
    def list_expenses(self) -> list[Expense]: ...

    def save_expenses(self, expenses: list[Expense]) -> None: ...

    def get_budget(self, year: int, month: int) -> MonthlyBudget | None: ...

    def upsert_budget(self, budget: MonthlyBudget) -> None: ...


class JsonExpenseRepository:
    def __init__(self, expenses_file: Path, budgets_file: Path) -> None:
        self.expenses_file = expenses_file
        self.budgets_file = budgets_file
        self.expenses_file.parent.mkdir(parents=True, exist_ok=True)
        self.budgets_file.parent.mkdir(parents=True, exist_ok=True)

    def list_expenses(self) -> list[Expense]:
        payload = self._read_json_list(self.expenses_file)
        return [Expense.from_dict(item) for item in payload]

    def save_expenses(self, expenses: list[Expense]) -> None:
        payload = [item.to_dict() for item in expenses]
        self._write_json_list(self.expenses_file, payload)

    def get_budget(self, year: int, month: int) -> MonthlyBudget | None:
        payload = self._read_json_list(self.budgets_file)
        for item in payload:
            if int(item["year"]) == year and int(item["month"]) == month:
                return MonthlyBudget.from_dict(item)
        return None

    def upsert_budget(self, budget: MonthlyBudget) -> None:
        payload = self._read_json_list(self.budgets_file)
        replaced = False
        for index, item in enumerate(payload):
            if int(item["year"]) == budget.year and int(item["month"]) == budget.month:
                payload[index] = budget.to_dict()
                replaced = True
                break
        if not replaced:
            payload.append(budget.to_dict())
        self._write_json_list(self.budgets_file, payload)

    @staticmethod
    def _read_json_list(file_path: Path) -> list[dict]:
        if not file_path.exists():
            return []
        try:
            content = json.loads(file_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise RepositoryError(f"Invalid JSON in {file_path}: {exc}") from exc
        if not isinstance(content, list):
            raise RepositoryError(f"Expected list in {file_path}, got {type(content).__name__}")
        return content

    @staticmethod
    def _write_json_list(file_path: Path, payload: list[dict]) -> None:
        file_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
