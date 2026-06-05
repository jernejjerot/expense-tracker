from fastapi.testclient import TestClient

from expense_tracker.interface.web import app


def test_dashboard_loads() -> None:
    client = TestClient(app)

    response = client.get("/")

    assert response.status_code == 200
    assert "Monthly Finance Pulse" in response.text


def test_add_expense_flow() -> None:
    client = TestClient(app)

    response = client.post(
        "/expenses",
        data={
            "description": "Coffee",
            "category": "food",
            "amount": "3.50",
            "spent_on": "2026-06-05",
            "year": "2026",
            "month": "6",
        },
        follow_redirects=False,
    )

    assert response.status_code == 303
    assert "message=Expense+saved" in response.headers["location"]
