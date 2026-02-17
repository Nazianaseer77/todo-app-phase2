from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ErrorResponse(BaseModel):
    """
    Standardized error response model.
    """
    detail: str
    error_code: Optional[str] = None
    timestamp: datetime = datetime.utcnow()


class ValidationErrorResponse(ErrorResponse):
    """
    Error response for validation errors.
    """
    error_code: str = "VALIDATION_ERROR"
    loc: Optional[list] = None  # Location of the validation error