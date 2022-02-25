from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.replacement import Replacement
from app.schemas.replacement import ReplacementCreate, ReplacementUpdate


class CRUDReplacement(CRUDBase[Replacement, ReplacementCreate, ReplacementUpdate]):
    def get_multi_by_owner(
            self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Replacement]:
        return (
            db.query(self.model)
                .filter(Replacement.user_id == owner_id)
                .offset(skip)
                .limit(limit)
                .all()
        )


replacement = CRUDReplacement(Replacement)
