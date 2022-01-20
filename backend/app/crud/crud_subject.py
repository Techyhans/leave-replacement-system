from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.subject import Subject
from app.schemas.subject import SubjectCreate, SubjectUpdate


class CRUDSubject(CRUDBase[Subject, SubjectCreate, SubjectUpdate]):
    pass


subject = CRUDSubject(Subject)
