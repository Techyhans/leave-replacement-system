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


@router.post("/", response_model=schemas.Subject)
def create_subject(
        *,
        db: Session = Depends(deps.get_db),
        subject_in: schemas.SubjectCreate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new subject.
    """
    item = crud.subject.create(db=db, obj_in=subject_in)
    return item


@router.put("/{id}", response_model=schemas.Subject)
def update_subject(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        subject_in: schemas.SubjectUpdate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update an subject.
    """
    subject = crud.subject.get(db=db, id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    subject = crud.subject.update(db=db, db_obj=subject, obj_in=subject_in)
    return subject


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


@router.delete("/{id}", response_model=schemas.Subject)
def delete_subject(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an subject.
    """
    subject = crud.subject.get(db=db, id=id)
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    subject = crud.subject.remove(db=db, id=id)
    return subject
