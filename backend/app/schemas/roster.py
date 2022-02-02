from typing import Optional

from pydantic import BaseModel


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
    user_id: int = None
    subject_id: int = None

    class Config:
        orm_mode = True


class Roster(RosterInDBBase):
    pass


class RosterInDB(RosterInDBBase):
    pass
