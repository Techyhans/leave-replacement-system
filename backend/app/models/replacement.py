from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Replacement(Base):
    id = Column(Integer, primary_key=True, index=True)
    roster_id = Column(Integer, ForeignKey('roster.id'))
    roster = relationship('Roster', lazy='subquery')
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', lazy='subquery')
