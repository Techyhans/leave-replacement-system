from typing import Optional, List

from pydantic import BaseModel, EmailStr
from app.schemas.subject import Subject


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    address: Optional[str] = None
    gender: Optional[str] = None


# Properties to receive via API on creation
class UserCreate(UserBase):
    subjects: List[int] = None
    email: EmailStr
    password: str


# Properties to receive via API on update
class UserUpdate(UserBase):
    subjects: List[Subject] = []
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[int] = None
    subjects: List[Subject] = []

    class Config:
        orm_mode = True


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
