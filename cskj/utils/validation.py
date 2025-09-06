"""
Shared validation utilities
"""

from typing import Any, Dict, List
from pydantic import BaseModel, ValidationError
import re


class ValidationUtils:
    """
    Common validation utilities
    """
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """
        Validate email format
        """
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """
        Validate phone number format (basic US format)
        """
        pattern = r'^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$'
        return re.match(pattern, phone) is not None
    
    @staticmethod
    def validate_gpa(gpa: float) -> bool:
        """
        Validate GPA range (0.0 - 4.0)
        """
        return 0.0 <= gpa <= 4.0
    
    @staticmethod
    def validate_sat_score(score: int) -> bool:
        """
        Validate SAT score range (400 - 1600)
        """
        return 400 <= score <= 1600
    
    @staticmethod
    def validate_act_score(score: int) -> bool:
        """
        Validate ACT score range (1 - 36)
        """
        return 1 <= score <= 36


def validate_pydantic_model(model_class: BaseModel, data: Dict[str, Any]) -> tuple[bool, List[str]]:
    """
    Validate data against a Pydantic model
    Returns (is_valid, error_messages)
    """
    try:
        model_class(**data)
        return True, []
    except ValidationError as e:
        error_messages = [f"{error['loc'][0]}: {error['msg']}" for error in e.errors()]
        return False, error_messages
