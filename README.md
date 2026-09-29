# Employee Management Application

## 1. Project Overview

The Employee Management Application is a simple full-stack CRUD system for maintaining employee records. It allows users to add, view, edit, update, and delete employees through a web interface.

## 2. Key Features

- Add a new employee with a name and role.
- View all employees in a table.
- Edit an existing employee.
- Update employee details.
- Delete an employee after confirmation.
- Cancel an active edit.
- REST API backed by SQLite database storage.

## 3. Technology Stack

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy
- SQLite
- Uvicorn

### Frontend

- React
- Vite
- JavaScript

## 4. Application Structure

```text
employee-management/
├── app/
│   ├── database.py       # Database engine and session configuration
│   ├── main.py           # FastAPI application and API routes
│   ├── models.py         # SQLAlchemy employee model
│   └── schemas.py        # Request and response validation schemas
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Employee UI and CRUD actions
│   │   ├── App.css       # Component styles
│   │   └── index.css     # Global styles
│   └── package.json
├── tests/                # Backend tests
├── employee.db           # SQLite database
└── requirements.txt      # Python dependencies
```

## 5. API Documentation

Base URL: `/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/employees` | Return all employees |
| POST | `/employees` | Create an employee |
| PUT | `/employees/{employee_id}` | Update an employee |
| DELETE | `/employees/{employee_id}` | Delete an employee |

### Employee request format

```json
{
  "name": "Asha Kumar",
  "role": "Software Developer"
}
```

### Employee response format

```json
{
  "id": 1,
  "name": "Asha Kumar",
  "role": "Software Developer"
}
```

The API returns `404 Employee not found` when an update or delete request references an invalid employee ID.

## 6. Local Setup

### Backend

From the project root:

```bash
python -m venv .venv

# Windows PowerShell
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend is available at `http://127.0.0.1:8000`.

### Frontend development

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend development URL is shown by Vite, normally `http://localhost:5173`.

### Production frontend build

```bash
cd frontend
npm run build
```

On Windows PowerShell, if `npm run build` is blocked by the execution policy, use:

```powershell
cd frontend
npm.cmd run build
```

The FastAPI application serves the generated frontend from `frontend/dist` when that directory exists.

## 7. Basic Usage

1. Open the application in a browser.
2. Enter an employee name and role, then select **Add Employee**.
3. Select **Edit** in the employee row to load its details into the form.
4. Select **Update Employee** to save changes, or **Cancel** to discard them.
5. Select **Delete** and confirm to remove an employee.

## 8. Validation

The production frontend build has been verified with:

```bash
cd frontend
npm run build
```

The Python source has also been syntax-checked with `py_compile`.

## 9. Future Improvements

- Add required-field and duplicate-employee validation.
- Add pagination and search for larger employee lists.
- Add authentication and role-based access control.
- Add database migrations for production deployments.
- Expand automated API and frontend tests.
