from sqlalchemy import Boolean, Column, Integer, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(50), index=True)
    address = Column(String(255))
    gender = Column(String(50))
    email = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    subjects = relationship('Subject', secondary="usersubject", back_populates='users')
    rosters = relationship('Roster', back_populates='user')
