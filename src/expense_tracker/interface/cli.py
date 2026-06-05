from __future__ import annotations

import argparse
import json
from datetime import date
from decimal import Decimal

from expense_tracker.application.services import ExpenseService
from expense_tracker.config.settings import load_settings
from expense_tracker.domain.exceptions import DomainValidationError, RepositoryError
from expense_tracker.infrastructure.repository import JsonExpenseRepository


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="expense-tracker", description="Track and summarize expenses"
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    add_cmd = subparsers.add_parser("add", help="Add a new expense")
    add_cmd.add_argument("--description", required=True)
    add_cmd.add_argument("--category", required=True)
    add_cmd.add_argument("--amount", required=True)
    add_cmd.add_argument("--date", required=True, help="Expense date (YYYY-MM-DD)")

    list_cmd = subparsers.add_parser("list", help="List expenses")
    list_cmd.add_argument("--year", type=int)
    list_cmd.add_argument("--month", type=int)

    summary_cmd = subparsers.add_parser("summary", help="Get monthly summary")
    summary_cmd.add_argument("--year", required=True, type=int)
    summary_cmd.add_argument("--month", required=True, type=int)

    budget_cmd = subparsers.add_parser("budget", help="Manage monthly budget")
    budget_subparsers = budget_cmd.add_subparsers(dest="budget_command", required=True)

    budget_set = budget_subparsers.add_parser("set", help="Set budget for a month")
    budget_set.add_argument("--year", required=True, type=int)
    budget_set.add_argument("--month", required=True, type=int)
    budget_set.add_argument("--amount", required=True)

    budget_status = budget_subparsers.add_parser("status", help="Get budget status")
    budget_status.add_argument("--year", required=True, type=int)
    budget_status.add_argument("--month", required=True, type=int)

    return parser


def build_service() -> tuple[ExpenseService, str]:
    settings = load_settings()
    repo = JsonExpenseRepository(settings.expenses_file, settings.budgets_file)
    return ExpenseService(repo), settings.currency


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()

    try:
        service, currency = build_service()

        if args.command == "add":
            expense = service.add_expense(
                description=args.description,
                category=args.category,
                amount=Decimal(args.amount),
                spent_on=date.fromisoformat(args.date),
            )
            print(f"Added expense {expense.expense_id} ({expense.amount} {currency})")
            return 0

        if args.command == "list":
            expenses = service.list_expenses(year=args.year, month=args.month)
            print(json.dumps([item.to_dict() for item in expenses], indent=2))
            return 0

        if args.command == "summary":
            summary = service.monthly_summary(year=args.year, month=args.month)
            print(_format_payload(summary))
            return 0

        if args.command == "budget" and args.budget_command == "set":
            budget = service.set_monthly_budget(args.year, args.month, Decimal(args.amount))
            print(
                f"Budget set for {budget.year}-{budget.month:02d}: {budget.amount} {currency}"
            )
            return 0

        if args.command == "budget" and args.budget_command == "status":
            status = service.budget_status(args.year, args.month)
            print(_format_payload(status))
            return 0

        parser.print_help()
        return 1

    except (DomainValidationError, RepositoryError, ValueError, FileNotFoundError) as exc:
        print(f"Error: {exc}")
        return 2


def _format_payload(payload: dict) -> str:
    def convert(value: object) -> object:
        if isinstance(value, Decimal):
            return str(value)
        if isinstance(value, dict):
            return {k: convert(v) for k, v in value.items()}
        return value

    return json.dumps(convert(payload), indent=2)
