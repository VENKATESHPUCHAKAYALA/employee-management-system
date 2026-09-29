from fastapi import FastAPI

app = FastAPI(title="Employee Management API")


@app.get("/")
def home():
    return {"message": "Employee Management API is running"}


@app.get("/employees")
def get_employees():
    return [
        {"id": 1, "name": "Venky", "role": "Python Developer"},
        {"id": 2, "name": "Ravi", "role": "Software Engineer"},
    ]