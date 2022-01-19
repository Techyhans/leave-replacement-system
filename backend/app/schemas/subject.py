from pydantic import BaseModel
from typing import Optional


class SubjectBase(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None


class SubjectCreate(SubjectBase):
    code: str
    name: str


class SubjectUpdate(SubjectBase):
    pass


class SubjectInDBBase(SubjectBase):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class Subject(SubjectInDBBase):
    pass


class SubjectInDB(SubjectInDBBase):
    pass
