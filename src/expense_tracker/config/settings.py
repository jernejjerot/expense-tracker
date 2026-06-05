from __future__ import annotations

import json
import os
from dataclasses import dataclass
from pathlib import Path

DEFAULT_CONFIG_PATH = Path("config/settings.local.json")


@dataclass(slots=True)
class AppSettings:
    expenses_file: Path
    budgets_file: Path
    currency: str
    default_monthly_budget: str


def load_settings() -> AppSettings:
    config_path = Path(os.getenv("EXPENSE_TRACKER_CONFIG", DEFAULT_CONFIG_PATH))
    if not config_path.exists():
        raise FileNotFoundError(
            f"Config file not found: {config_path}. Copy config/settings.example.json first."
        )

    payload = json.loads(config_path.read_text(encoding="utf-8"))
    return AppSettings(
        expenses_file=Path(payload["expenses_file"]),
        budgets_file=Path(payload["budgets_file"]),
        currency=payload.get("currency", "EUR"),
        default_monthly_budget=str(payload.get("default_monthly_budget", "0")),
    )
