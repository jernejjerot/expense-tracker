from datetime import date
from decimal import Decimal


def test_budget_status_within_limit(service) -> None:
    service.set_monthly_budget(2026, 6, Decimal("200"))
    service.add_expense("Groceries", "food", Decimal("50"), date(2026, 6, 1))

    status = service.budget_status(2026, 6)

    assert status["has_budget"] is True
    assert status["is_over_budget"] is False
    assert status["remaining"] == Decimal("150")


def test_budget_status_over_limit(service) -> None:
    service.set_monthly_budget(2026, 6, Decimal("100"))
    service.add_expense("Groceries", "food", Decimal("70"), date(2026, 6, 1))
    service.add_expense("Taxi", "transport", Decimal("40"), date(2026, 6, 2))

    status = service.budget_status(2026, 6)

    assert status["has_budget"] is True
    assert status["is_over_budget"] is True
    assert status["remaining"] == Decimal("-10")
