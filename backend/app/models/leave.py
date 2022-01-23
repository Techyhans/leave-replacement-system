from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Leave(Base):
    id = Column(Integer, primary_key=True)
    date = Column(Date)
    description = Column(String(255))
    approved = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='leaves')
