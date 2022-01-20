from sqlalchemy import Column, Integer, ForeignKey

from app.db.base_class import Base


class UserSubject(Base):
    id = Column('id', Integer, primary_key=True)
    user = Column('user_id', Integer, ForeignKey('user.id'))
    subject = Column('subject_id', Integer, ForeignKey('subject.id'))
