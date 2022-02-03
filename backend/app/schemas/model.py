from pydantic import BaseModel

from schemas.user import User


class ModelBase(BaseModel):
    roster_id: int


class ModelOutput(BaseModel):
    user: User
    score: float

    class Config:
        orm_mode = True