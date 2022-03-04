from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps
from app.api.services import Fuzzy

router = APIRouter()

subject_skill_mapping = {
    'Bahasa Arab': 1,
    'Bahasa Cina': 2,
    'Bahasa Tamil': 3,
    'Bahasa Melayu': 4,
    'Bahasa Inggeris': 5,
    'Pendidikan Islam': 6,
    'Pendidikan Moral': 7,
    'Sejarah': 8,
    'Matematik': 9,
    'Sains': 10,
    'Reka Bentuk Teknologi': 11,
    'Pendidikan Jasmani & Pendidikan Kesihatan': 12,
    'Pendidikan Muzik': 13,
    'Pendidikan Seni Visual': 14
}


def filter_available_teacher(teachers, roster):
    available_teacher = []

    for teacher in teachers:
        teacher_rosters = teacher.rosters

        if len(teacher_rosters) == 0:
            available_teacher.append(teacher)
        else:
            for teacher_roster in teacher_rosters:
                if teacher_roster.day != roster.day or (teacher_roster.start_hour >= roster.end_hour) and (
                        teacher_roster.end_hour < roster.start_hour):
                    available_teacher.append(teacher)

    return available_teacher


@router.post("/predict", response_model=List[schemas.ModelOutput])
def predict(
        *,
        db: Session = Depends(deps.get_db),
        model_in: schemas.ModelBase,
        current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    roster = crud.roster.get(db, model_in.roster_id)
    subject = roster.subject

    teachers = crud.user.get_teachers(db)

    available_teachers = filter_available_teacher(teachers, roster)

    model_output_list = []
    for teacher in available_teachers:
        teacher_skills = teacher.subjects
        teacher_scores = []
        for skill in teacher_skills:
            fuzzy = Fuzzy()
            score = fuzzy.predict(subject_skill_mapping[subject.name], subject_skill_mapping[skill.name])
            teacher_scores.append(score)
        max_score = max(teacher_scores)
        # max_score_index = teacher_scores.index(max_score)
        model_output = schemas.ModelOutput(user=teacher, score=max_score)
        model_output_list.append(model_output)

    return model_output_list
