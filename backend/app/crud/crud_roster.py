from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.roster import Roster
from app.schemas.roster import RosterCreate, RosterUpdate


class CRUDRoster(CRUDBase[Roster, RosterCreate, RosterUpdate]):
    pass


roster = CRUDRoster(Roster)
