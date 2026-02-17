from sqlmodel import SQLModel
from sqlalchemy import Column, DateTime
from datetime import datetime
import uuid


class BaseSQLModel(SQLModel):
    """
    Base class for all SQLModel models in the application.
    """
    pass


def generate_uuid():
    """
    Generate a UUID for primary keys.
    """
    return str(uuid.uuid4())


class TimestampMixin:
    """
    Mixin class to add created_at and updated_at timestamps to models.
    """
    created_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: datetime = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)