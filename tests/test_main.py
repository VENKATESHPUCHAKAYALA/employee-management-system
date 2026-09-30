from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_home():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Employee Management API is running"
    }


def test_get_employees():
    response = client.get("/employees")
    assert response.status_code == 200
    employees = response.json()
    assert len(employees) >= 2
    assert any(employee["name"] == "Venky" for employee in employees)
