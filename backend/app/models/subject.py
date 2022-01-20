from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Subject(Base):
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=False, nullable=False)
    name = Column(String(50), unique=False, nullable=False)
    users = relationship('User', secondary='usersubject', back_populates='subjects')
    rosters = relationship('Roster', back_populates='subject')
