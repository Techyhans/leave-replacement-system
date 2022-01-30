from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.api.services import Fuzzy

router = APIRouter()

weekday_mapping = {
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5
}

@router.post("/predict", response_model=List[schemas.ModelOutput])
def predict(
        *,
        db: Session = Depends(deps.get_db),
        model_in: schemas.ModelBase,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    subject = crud.subject.get(db, model_in.subject_id)

    teachers = crud.user.get_teachers(db)

    model_output_list = []
    for teacher in teachers:
        teacher_skills = teacher.subjects
        teacher_scores = []
        for skill in teacher_skills:
            print(skill.name)
            fuzzy = Fuzzy()
            score = fuzzy.predict(subject.id, skill.id)
            teacher_scores.append(score)
            print(score)
        max_score = max(teacher_scores)
        max_score_index = teacher_scores.index(max_score)
        model_output = schemas.ModelOutput
        model_output.user = teacher_skills[max_score_index]
        model_output.score = max_score
        model_output_list.append(model_output)

    return model_output_list