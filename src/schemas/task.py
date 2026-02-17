from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid


class TaskCreate(BaseModel):
    """
    Schema for creating a new task.
    """
    title: str
    description: Optional[str] = None
    user_id: str  # Included for validation purposes


class TaskResponse(BaseModel):
    """
    Schema for responding with task data.
    """
    id: str
    user_id: str
    title: str
    description: Optional[str] = None
    completed: bool
    created_at: datetime
    updated_at: datetime


class TaskUpdate(BaseModel):
    """
    Schema for updating an existing task.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TaskComplete(BaseModel):
    """
    Schema for updating task completion status.
    """
    completed: bool