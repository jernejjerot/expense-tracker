from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from decimal import ROUND_HALF_UP, Decimal

TWOPLACES = Decimal("0.01")


@dataclass(slots=True)
class Expense:
    expense_id: str
    description: str
    category: str
    amount: Decimal
    spent_on: date

    def to_dict(self) -> dict[str, str]:
        return {
            "expense_id": self.expense_id,
            "description": self.description,
            "category": self.category,
            "amount": str(self.amount.quantize(TWOPLACES, rounding=ROUND_HALF_UP)),
            "spent_on": self.spent_on.isoformat(),
        }

    @classmethod
    def from_dict(cls, payload: dict[str, str]) -> Expense:
        return cls(
            expense_id=payload["expense_id"],
            description=payload["description"],
            category=payload["category"],
            amount=Decimal(payload["amount"]).quantize(TWOPLACES, rounding=ROUND_HALF_UP),
            spent_on=date.fromisoformat(payload["spent_on"]),
        )


@dataclass(slots=True)
class MonthlyBudget:
    year: int
    month: int
    amount: Decimal

    def to_dict(self) -> dict[str, str | int]:
        return {
            "year": self.year,
            "month": self.month,
            "amount": str(self.amount.quantize(TWOPLACES, rounding=ROUND_HALF_UP)),
        }

    @classmethod
    def from_dict(cls, payload: dict[str, str | int]) -> MonthlyBudget:
        return cls(
            year=int(payload["year"]),
            month=int(payload["month"]),
            amount=Decimal(str(payload["amount"])).quantize(TWOPLACES, rounding=ROUND_HALF_UP),
        )
