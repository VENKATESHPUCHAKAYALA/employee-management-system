from pydantic import BaseModel


class EmployeeCreate(BaseModel):
    name: str
    role: str


class EmployeeUpdate(BaseModel):
    name: str
    role: str


class EmployeeResponse(BaseModel):
    id: int
    name: str
    role: str

    class Config:
        from_attributes = True
