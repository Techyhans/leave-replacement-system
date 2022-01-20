from typing import Optional

from pydantic import BaseModel
from app.schemas.user import User
from app.schemas.subject import Subject

class RosterBase(BaseModel):
    day: Optional[str] = None
    start_hour: Optional[int] = None
    end_hour: Optional[int] = None


class RosterCreate(RosterBase):
    day: str
    start_hour: int
    end_hour: int
    user_id: int
    subject_id: int


class RosterUpdate(RosterBase):
    day: str
    start_hour: int
    end_hour: int
    user_id: int
    subject_id: int


class RosterInDBBase(RosterBase):
    id: Optional[int] = None
    user: User = None
    subject: Subject = None

    class Config:
        orm_mode = True


class Roster(RosterInDBBase):
    pass


class RosterInDB(RosterInDBBase):
    pass
