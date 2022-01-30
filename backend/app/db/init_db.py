from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.db import base
from app.db.base_class import Base
from app.db.session import engine


# make sure all SQL Alchemy models are imported (app.db.base) before initializing DB
# otherwise, SQL Alchemy might fail to initialize relationships properly
# for more details: https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/28


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(bind=engine)

    user = crud.user.get_by_email(db, email=settings.FIRST_SUPERUSER)
    if not user:
        user_in = schemas.UserCreate(
            full_name="admin",
            gender="male",
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.user.create(db, obj_in=user_in)

    subjects = crud.subject.get_multi(db)
    if len(subjects) == 0:
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1103", name="Malay Language"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1119", name="English Language"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1223", name="Islamic Studies"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1225", name="Moral Education"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1249", name="History"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="1449", name="Mathematics"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="3472", name="Additional Mathematics"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="4531", name="Physics"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="4541", name="Chemistry"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="4551", name="Biology"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="2205", name="Literature in English"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="2215", name="Malay Literature"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="3766", name="Business"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="3767", name="Economics"))

    teacher1 = schemas.UserCreate(full_name="Amar", gender="male", email="amar@example.com",
                                  password="amar", is_superuser=False, subjects=[3, 4])
    crud.user.create(db, obj_in=teacher1)
