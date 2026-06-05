from pathlib import Path

import pytest

from expense_tracker.application.services import ExpenseService
from expense_tracker.infrastructure.repository import JsonExpenseRepository


@pytest.fixture
def service(tmp_path: Path) -> ExpenseService:
    repo = JsonExpenseRepository(
        expenses_file=tmp_path / "expenses.json",
        budgets_file=tmp_path / "budgets.json",
    )
    return ExpenseService(repo)
