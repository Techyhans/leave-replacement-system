from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Replacement])
def read_replacement(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve replacements.
    """
    replacements = crud.replacement.get_multi(db, skip=skip, limit=limit)

    return replacements


@router.post("/", response_model=schemas.Replacement)
def create_replacement(
        *,
        db: Session = Depends(deps.get_db),
        replacement_in: schemas.ReplacementCreate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new replacement.
    """
    replacement = crud.replacement.create(db=db, obj_in=replacement_in)
    return replacement


@router.get("/{id}", response_model=schemas.Replacement)
def read_replacement(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get replacement by ID.
    """
    replacement = crud.replacement.get(db=db, id=id)
    if not replacement:
        raise HTTPException(status_code=404, detail="Replacement not found")
    return replacement


@router.delete("/{id}", response_model=schemas.Replacement)
def delete_replacement(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an replacement.
    """
    replacement = crud.replacement.get(db=db, id=id)
    if not replacement:
        raise HTTPException(status_code=404, detail="Replacement not found")
    replacement = crud.replacement.remove(db=db, id=id)
    return replacement
