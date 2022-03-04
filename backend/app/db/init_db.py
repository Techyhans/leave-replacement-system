from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
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
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0001", name="Bahasa Arab"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0002", name="Bahasa Cina"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0003", name="Bahasa Tamil"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0004", name="Bahasa Melayu"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0005", name="Bahasa Inggeris"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0006", name="Pendidikan Islam"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0007", name="Pendidikan Moral"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0008", name="Sejarah"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0009", name="Matematik"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0010", name="Sains"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0011", name="Reka Bentuk Teknologi"))
        crud.subject.create(db,
                            obj_in=schemas.SubjectCreate(code="0012", name="Pendidikan Jasmani & Pendidikan Kesihatan"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0013", name="Pendidikan Muzik"))
        crud.subject.create(db, obj_in=schemas.SubjectCreate(code="0014", name="Pendidikan Seni Visual"))

    teacher1 = schemas.UserCreate(full_name="Amar", gender="male", email="amar@example.com",
                                  password="amar", is_superuser=False, subjects=[1, 2])
    teacher2 = schemas.UserCreate(full_name="Siti", gender="female", email="siti@example.com",
                                  password="sity", is_superuser=False, subjects=[6, 7])
    teacher3 = schemas.UserCreate(full_name="Hadi", gender="male", email="hadi@example.com",
                                  password="hadi", is_superuser=False, subjects=[3, 4])
    teacher4 = schemas.UserCreate(full_name="Abu", gender="male", email="abu@example.csom",
                                  password="abu", is_superuser=False, subjects=[9, 10, 11])
    teacher5 = schemas.UserCreate(full_name="Alice", gender="female", email="alice@example.com",
                                  password="alice", is_superuser=False, subjects=[13, 14])
    teacher6 = schemas.UserCreate(full_name="Hang Tuah", gender="male", email="hangtuah@example.com",
                                  password="hangtuah", is_superuser=False, subjects=[5])
    teacher7 = schemas.UserCreate(full_name="Abdul", gender="male", email="abdul@example.com",
                                  password="abdul", is_superuser=False, subjects=[12])

    teacher_list = [teacher1, teacher2, teacher3, teacher4, teacher5, teacher6, teacher7]
    for teacher in teacher_list:
        crud.user.create(db, obj_in=teacher)

    roster1 = schemas.RosterCreate(day='monday', start_hour='8', end_hour='9', user_id=2, subject_id=1)
    roster2 = schemas.RosterCreate(day='tuesday', start_hour='9', end_hour='10', user_id=3, subject_id=6)
    roster3 = schemas.RosterCreate(day='wednesday', start_hour='8', end_hour='9', user_id=4, subject_id=14)

    roster_list = [roster1, roster2, roster3]
    for roster in roster_list:
        crud.roster.create(db, obj_in=roster)
