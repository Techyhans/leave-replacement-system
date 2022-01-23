from typing import List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.leave import Leave
from app.models.user import User
from app.schemas.leave import LeaveCreate, LeaveUpdate


class CRUDLeave(CRUDBase[Leave, LeaveCreate, LeaveUpdate]):

    def create_with_user(self, db: Session, *, obj_in: LeaveCreate, user: User) -> Leave:
        db_obj = Leave(
            date=obj_in.date,
            description=obj_in.description,
            approved=False,
            user=user
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return

    def get_multi_by_user(
            self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Leave]:
        return (
            db.query(self.model)
                .filter(Leave.user_id == user_id)
                .offset(skip)
                .limit(limit)
                .all()
        )


leave = CRUDLeave(Leave)
