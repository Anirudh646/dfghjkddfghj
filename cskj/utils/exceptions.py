"""
Custom exception classes and error handlers
"""

from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Any, Dict


class BaseCustomException(Exception):
    """
    Base custom exception class
    """
    def __init__(self, message: str, status_code: int = 500, details: Dict[str, Any] = None):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class StudentNotFoundException(BaseCustomException):
    """
    Raised when a student profile is not found
    """
    def __init__(self, student_id: str):
        super().__init__(
            message=f"Student with ID {student_id} not found",
            status_code=404,
            details={"student_id": student_id}
        )


class CollegeNotFoundException(BaseCustomException):
    """
    Raised when a college is not found
    """
    def __init__(self, college_id: str):
        super().__init__(
            message=f"College with ID {college_id} not found",
            status_code=404,
            details={"college_id": college_id}
        )


class EssayNotFoundException(BaseCustomException):
    """
    Raised when an essay is not found
    """
    def __init__(self, essay_id: str):
        super().__init__(
            message=f"Essay with ID {essay_id} not found",
            status_code=404,
            details={"essay_id": essay_id}
        )


class ValidationException(BaseCustomException):
    """
    Raised when validation fails
    """
    def __init__(self, message: str, field_errors: Dict[str, str] = None):
        super().__init__(
            message=message,
            status_code=422,
            details={"field_errors": field_errors or {}}
        )


class ExternalServiceException(BaseCustomException):
    """
    Raised when external service calls fail
    """
    def __init__(self, service_name: str, message: str):
        super().__init__(
            message=f"External service '{service_name}' error: {message}",
            status_code=503,
            details={"service": service_name}
        )


# Global exception handlers
async def custom_exception_handler(request: Request, exc: BaseCustomException):
    """
    Handle custom exceptions and return appropriate JSON response
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": True,
            "message": exc.message,
            "details": exc.details,
            "path": str(request.url)
        }
    )


async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions
    """
    return JSONResponse(
        status_code=500,
        content={
            "error": True,
            "message": "Internal server error",
            "details": {},
            "path": str(request.url)
        }
    )
