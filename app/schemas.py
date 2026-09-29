from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    name: str
    role: str
    location: str
    domain: str
    working: str


class EmployeeUpdate(BaseModel):
    name: str
    role: str
    location: str
    domain: str
    working: str


class EmployeeResponse(BaseModel):
    id: int
    name: str
    role: str
    location: str
    domain: str
    working: str

    class Config:
        from_attributes = True
