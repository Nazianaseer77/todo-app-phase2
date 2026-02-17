from sqlmodel import SQLModel, Field
from sqlalchemy import Column, String, Boolean, Text, DateTime
from datetime import datetime
from typing import Optional
import uuid


class TaskBase(SQLModel):
    """
    Base class containing common fields for Task model.
    """
    title: str = Field(max_length=255)
    description: Optional[str] = Field(sa_column=Column(Text))
    completed: bool = Field(default=False)
    user_id: str = Field(max_length=255, index=True)


class Task(TaskBase, table=True):
    """
    Task model representing a user's todo item.
    """
    __tablename__ = "tasks"

    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    created_at: datetime = Field(sa_column=Column(DateTime, default=datetime.utcnow))
    updated_at: datetime = Field(sa_column=Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow))


class TaskCreate(TaskBase):
    """
    Schema for creating a new task.
    """
    title: str
    user_id: str


class TaskUpdate(SQLModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    """
    Schema for responding with task data.
    """
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime