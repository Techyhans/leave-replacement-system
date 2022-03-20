from enum import Enum
from typing import Optional

from pydantic import BaseModel

from app.schemas.subject import Subject


class DayName(str, Enum):
    monday = "monday"
    tuesday = "tuesday"
    wednesday = "wednesday"
    thursday = "thursday"
    friday = "friday"


class RosterBase(BaseModel):
    day: Optional[str] = None
    cls: Optional[str] = None
    start_hour: Optional[int] = None
    end_hour: Optional[int] = None


class RosterCreate(RosterBase):
    day: DayName
    start_hour: int
    end_hour: int
    cls: str
    user_id: int
    subject_id: int


class RosterUpdate(RosterBase):
    day: DayName
    start_hour: int
    end_hour: int
    cls: str
    user_id: int
    subject_id: int


class RosterInDBBase(RosterBase):
    id: Optional[int] = None
    user_id: int = None
    subject: Subject = None

    class Config:
        orm_mode = True


class Roster(RosterInDBBase):
    pass


class RosterInDB(RosterInDBBase):
    pass
