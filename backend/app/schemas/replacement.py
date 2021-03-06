from datetime import date
from typing import Optional

from pydantic import BaseModel

from app.schemas.roster import Roster
from app.schemas.user import User


class ReplacementBase(BaseModel):
    roster_id: Optional[int] = None
    user_id: Optional[int] = None
    date: Optional[date] = None


class ReplacementCreate(ReplacementBase):
    roster_id: int
    user_id: int
    date: date


class ReplacementUpdate(ReplacementBase):
    roster_id: int
    user_id: int
    date: date


class ReplacementInDBBase(ReplacementBase):
    id: Optional[int] = None
    roster_id: int = None
    user_id: int = None
    date: Optional[date]
    roster: Roster = None
    user: User = None

    class Config:
        orm_mode = True


class Replacement(ReplacementInDBBase):
    pass


class ReplacementInDB(ReplacementInDBBase):
    pass
