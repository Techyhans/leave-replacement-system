from app.crud.base import CRUDBase
from app.models.replacement import Replacement
from app.schemas.replacement import ReplacementCreate, ReplacementUpdate


class CRUDReplacement(CRUDBase[Replacement, ReplacementCreate, ReplacementUpdate]):
    pass


replacement = CRUDReplacement(Replacement)
