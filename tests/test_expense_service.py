from datetime import date, timedelta
from decimal import Decimal

import pytest

from expense_tracker.domain.exceptions import DomainValidationError


def test_add_expense_and_list(service) -> None:
    service.add_expense(
        description="Groceries",
        category="food",
        amount=Decimal("45.20"),
        spent_on=date(2026, 6, 1),
    )

    items = service.list_expenses(year=2026, month=6)
    assert len(items) == 1
    assert items[0].description == "Groceries"


def test_reject_future_date(service) -> None:
    with pytest.raises(DomainValidationError):
        service.add_expense(
            description="Future purchase",
            category="other",
            amount=Decimal("10"),
            spent_on=date.today() + timedelta(days=1),
        )


def test_reject_invalid_category(service) -> None:
    with pytest.raises(DomainValidationError):
        service.add_expense(
            description="Invalid",
            category="gaming",
            amount=Decimal("10"),
            spent_on=date(2026, 6, 1),
        )


def test_monthly_summary_groups_by_category(service) -> None:
    service.add_expense("Bus pass", "transport", Decimal("30"), date(2026, 6, 1))
    service.add_expense("Dinner", "food", Decimal("25"), date(2026, 6, 1))
    service.add_expense("Lunch", "food", Decimal("15"), date(2026, 6, 2))

    summary = service.monthly_summary(2026, 6)

    assert summary["total"] == Decimal("70")
    assert summary["by_category"]["food"] == Decimal("40")
    assert summary["by_category"]["transport"] == Decimal("30")
