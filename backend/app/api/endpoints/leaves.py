from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Leave])
def read_leaves(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve leaves.
    """
    leaves = crud.leave.get_multi(db, skip=skip, limit=limit)

    return leaves

@router.get("/me", response_model=List[schemas.Leave])
def read_leaves_me(
        db: Session = Depends(deps.get_db),
        skip: int = 0,
        limit: int = 100,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve leaves by user.
    """
    leaves = crud.leave.get_multi_by_user(db, user_id=current_user.id, skip=skip, limit=limit)

    return leaves

@router.post("/", response_model=schemas.Leave)
def create_leave(
        *,
        db: Session = Depends(deps.get_db),
        leave_in: schemas.LeaveCreate,
        current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new leave.
    """
    leave = crud.leave.create_with_user(db=db, obj_in=leave_in, user=current_user)
    return leave


@router.put("/{id}", response_model=schemas.Leave)
def update_leave(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        leave_in: schemas.LeaveUpdate,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update an leave.
    """
    leave = crud.leave.get(db=db, id=id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave = crud.leave.update(db=db, db_obj=leave, obj_in=leave_in)
    return leave


@router.get("/{id}", response_model=schemas.Leave)
def read_leave(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Get leave by ID.
    """
    leave = crud.leave.get(db=db, id=id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    return leave


@router.delete("/{id}", response_model=schemas.Leave)
def delete_leave(
        *,
        db: Session = Depends(deps.get_db),
        id: int,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete an leave.
    """
    leave = crud.leave.get(db=db, id=id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave not found")
    leave = crud.leave.remove(db=db, id=id)
    return leave
