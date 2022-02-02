from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Subject])
def read_subjects(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve items.
    """
    subjects = crud.subject.get_multi(db, skip=skip, limit=limit)

    return subjects


@router.get("/{id}", response_model=schemas.Subject)
def read_subject(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get subject by ID.
    """
    subject = crud.subject.get(db=db, id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject
