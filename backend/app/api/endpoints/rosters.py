from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Roster])
def read_rosters(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve rosters.
    """
    rosters = crud.roster.get_multi(db, skip=skip, limit=limit)

    return rosters


@router.post("/", response_model=schemas.Roster)
def create_roster(
        *,
        db: Session = Depends(deps.get_db),
        roster_in: schemas.RosterCreate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new roster.
    """
    roster = crud.roster.create(db=db, obj_in=roster_in)
    return roster


@router.put("/{id}", response_model=schemas.Roster)
def update_roster(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        roster_in: schemas.RosterUpdate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update an roster.
    """
    roster = crud.roster.get(db=db, id=id)
    if not roster:
        raise HTTPException(status_code=404, detail="Roster not found")
    roster = crud.roster.update(db=db, db_obj=roster, obj_in=roster_in)
    return roster


@router.get("/{id}", response_model=schemas.Roster)
def read_roster(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get roster by ID.
    """
    roster = crud.roster.get(db=db, id=id)
    if not roster:
        raise HTTPException(status_code=404, detail="Roster not found")
    return roster


@router.delete("/{id}", response_model=schemas.Roster)
def delete_roster(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an roster.
    """
    roster = crud.roster.get(db=db, id=id)
    if not roster:
        raise HTTPException(status_code=404, detail="Roster not found")
    roster = crud.roster.remove(db=db, id=id)
    return roster
