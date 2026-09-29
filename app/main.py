
from pathlib import Path

from fastapi import Depends, FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import Base, SessionLocal, engine
from app.models import Employee
from app.schemas import EmployeeCreate, EmployeeResponse, EmployeeUpdate

Base.metadata.create_all(bind=engine)
# Add fields to an existing SQLite database created by an older version.
with engine.begin() as connection:
    columns = connection.exec_driver_sql("PRAGMA table_info(employees)").fetchall()
    existing_columns = {column[1] for column in columns}
    if columns and "location" not in existing_columns:
        connection.exec_driver_sql(
            "ALTER TABLE employees ADD COLUMN location VARCHAR NOT NULL DEFAULT ''"
        )
    if columns and "domain" not in existing_columns:
        connection.exec_driver_sql("ALTER TABLE employees ADD COLUMN domain VARCHAR NOT NULL DEFAULT ''")
    if columns and "working" not in existing_columns:
        connection.exec_driver_sql("ALTER TABLE employees ADD COLUMN working VARCHAR NOT NULL DEFAULT 'Working'")

app = FastAPI(title="Employee Management API")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend" / "dist"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Root API
@app.get("/api/health")
def home():
    return {"message": "Employee Management API is running"}


# Get employees
@app.get("/api/employees", response_model=list[EmployeeResponse])
@app.get("/employees", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()


# Add employee
@app.post("/api/employees", response_model=EmployeeResponse)
def add_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
):
    new_employee = Employee(
        name=employee.name,
        role=employee.role,
        location=employee.location,
        domain=employee.domain,
        working=employee.working,
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return new_employee


# Delete employee
@app.delete("/api/employees/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}


# Update employee
@app.put("/api/employees/{employee_id}", response_model=EmployeeResponse)
def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
):
    employee = (
        db.query(Employee)
        .filter(Employee.id == employee_id)
        .first()
    )

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found",
        )

    employee.name = employee_data.name
    employee.role = employee_data.role
    employee.location = employee_data.location
    employee.domain = employee_data.domain
    employee.working = employee_data.working
    db.commit()
    db.refresh(employee)

    return employee


# Frontend - keep this at the bottom
app.mount(
    "/",
    StaticFiles(directory=FRONTEND_DIR, html=True),
    name="frontend",
)
