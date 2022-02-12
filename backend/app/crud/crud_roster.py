from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.roster import Roster
from app.schemas.roster import RosterCreate, RosterUpdate


class CRUDRoster(CRUDBase[Roster, RosterCreate, RosterUpdate]):
    def get_multi_by_owner(
            self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Roster]:
        return (
            db.query(self.model)
                .filter(Roster.user_id == owner_id)
                .offset(skip)
                .limit(limit)
                .all()
        )


roster = CRUDRoster(Roster)
