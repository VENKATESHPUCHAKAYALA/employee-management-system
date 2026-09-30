# Staidlogic Employee Management System

Full-stack employee management application with a Staidlogic login page, employee dashboard, CRUD operations, filters, and SQLite persistence.

## Features

- Login screen with username, password, and forgot-password action.
- Add, view, edit, update, and delete employees.
- Employee ID, name, role, location, domain, and working status.
- Search and filter by domain and working status.
- FastAPI backend with SQLite database.
- React/Vite production build served by FastAPI.

## Technology

- Backend: Python 3.11+, FastAPI, SQLAlchemy, SQLite, Uvicorn
- Frontend: React, Vite, JavaScript
- CI: GitHub Actions, pytest, Ruff, npm build

## Local setup

From the project root:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Build the frontend:

```powershell
cd frontend
npm.cmd install
npm.cmd run build
cd ..
```

Start the application:

```powershell
python -m uvicorn app.main:app --reload
```

Open the UI at http://127.0.0.1:8000.

Useful endpoints:

- UI: `http://127.0.0.1:8000`
- API health: `http://127.0.0.1:8000/api/health`
- Swagger API docs: `http://127.0.0.1:8000/docs`
- Employees API: `http://127.0.0.1:8000/api/employees`

## Testing and validation

```powershell
pytest -v
ruff check app tests
cd frontend
npm.cmd run build
```

## CI/CD

Every push or pull request targeting `main` runs `.github/workflows/ci.yml`. The workflow installs Python 3.11, runs pytest, runs Ruff, installs Node.js 20 dependencies with `npm ci`, and builds the frontend.

Push changes to GitHub with:

```powershell
git add .
git commit -m "Update application"
git push
```

After pushing, open the repository’s **Actions** tab to confirm the workflow is green.
