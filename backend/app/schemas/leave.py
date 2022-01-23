from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.schemas.user import User


class LeaveBase(BaseModel):
    date: Optional[date]
    description: Optional[str] = None
    approved: Optional[bool] = None


class LeaveCreate(LeaveBase):
    date: date
    description: str


class LeaveUpdate(BaseModel):
    approved: bool


class LeaveInDBBase(LeaveBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class Leave(LeaveInDBBase):
    user: User = None
    pass


class LeaveInDB(LeaveInDBBase):
    pass
