from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from ..schemas.error import ErrorResponse
from datetime import datetime
import traceback


async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Global handler for HTTP exceptions.
    """
    error_response = ErrorResponse(
        detail=exc.detail,
        error_code=getattr(exc, 'error_code', f"HTTP_{exc.status_code}"),
        timestamp=datetime.utcnow()
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response.model_dump()
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Global handler for general exceptions.
    """
    error_detail = str(exc) if str(exc) else "An unexpected error occurred"
    error_response = ErrorResponse(
        detail=error_detail,
        error_code="INTERNAL_SERVER_ERROR",
        timestamp=datetime.utcnow()
    )

    # Log the full traceback for debugging
    print(f"Exception occurred: {exc}")
    print(traceback.format_exc())

    return JSONResponse(
        status_code=500,
        content=error_response.model_dump()
    )


def add_exception_handlers(app):
    """
    Add exception handlers to the FastAPI application.
    """
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)