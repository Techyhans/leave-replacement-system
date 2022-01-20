from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Roster(Base):
    id = Column(Integer, primary_key=True, index=True)
    day = Column(String(50), unique=False, nullable=False)
    start_hour = Column(Integer, unique=False, nullable=False)
    end_hour = Column(Integer, unique=False, nullable=False)
    subject_id = Column(Integer, ForeignKey('subject.id'))
    subject = relationship("Subject", back_populates="rosters")
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='rosters')
