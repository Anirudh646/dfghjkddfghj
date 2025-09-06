"""
Student Profile models - both SQLAlchemy (PostgreSQL) and Pydantic models
"""

from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.sql import func
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

from db.postgresql import Base


# SQLAlchemy model for PostgreSQL
class StudentProfile(Base):
    """
    SQLAlchemy model for student profiles stored in PostgreSQL
    """
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    
    # Academic information
    gpa = Column(Float, nullable=True)
    sat_score = Column(Integer, nullable=True)
    act_score = Column(Integer, nullable=True)
    high_school = Column(String(255), nullable=True)
    graduation_year = Column(Integer, nullable=True)
    
    # Personal information
    date_of_birth = Column(DateTime, nullable=True)
    state = Column(String(50), nullable=True)
    country = Column(String(100), nullable=True)
    
    # Additional fields
    intended_major = Column(String(255), nullable=True)
    extracurriculars = Column(Text, nullable=True)  # JSON string
    achievements = Column(Text, nullable=True)  # JSON string
    
    # Profile status
    is_active = Column(Boolean, default=True)
    profile_completed = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# Pydantic models for API requests/responses

class GradeLevel(str, Enum):
    """
    Grade level enumeration
    """
    FRESHMAN = "freshman"
    SOPHOMORE = "sophomore"
    JUNIOR = "junior"
    SENIOR = "senior"


class StudentProfileCreate(BaseModel):
    """
    Pydantic model for creating a new student profile
    """
    email: str = Field(..., description="Student's email address")
    first_name: str = Field(..., min_length=1, max_length=100, description="First name")
    last_name: str = Field(..., min_length=1, max_length=100, description="Last name")
    phone: Optional[str] = Field(None, description="Phone number")
    
    # Academic information
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0, description="GPA (0.0-4.0)")
    sat_score: Optional[int] = Field(None, ge=400, le=1600, description="SAT score (400-1600)")
    act_score: Optional[int] = Field(None, ge=1, le=36, description="ACT score (1-36)")
    high_school: Optional[str] = Field(None, max_length=255, description="High school name")
    graduation_year: Optional[int] = Field(None, ge=2020, le=2030, description="Graduation year")
    
    # Personal information
    date_of_birth: Optional[datetime] = Field(None, description="Date of birth")
    state: Optional[str] = Field(None, max_length=50, description="State/Province")
    country: Optional[str] = Field(None, max_length=100, description="Country")
    
    # Additional fields
    intended_major: Optional[str] = Field(None, max_length=255, description="Intended major")
    extracurriculars: Optional[List[str]] = Field(None, description="List of extracurricular activities")
    achievements: Optional[List[str]] = Field(None, description="List of achievements")
    
    @validator('email')
    def validate_email(cls, v):
        """Validate email format"""
        from utils.validation import ValidationUtils
        if not ValidationUtils.validate_email(v):
            raise ValueError('Invalid email format')
        return v.lower()


class StudentProfileUpdate(BaseModel):
    """
    Pydantic model for updating a student profile
    """
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None)
    
    # Academic information
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    sat_score: Optional[int] = Field(None, ge=400, le=1600)
    act_score: Optional[int] = Field(None, ge=1, le=36)
    high_school: Optional[str] = Field(None, max_length=255)
    graduation_year: Optional[int] = Field(None, ge=2020, le=2030)
    
    # Personal information
    date_of_birth: Optional[datetime] = Field(None)
    state: Optional[str] = Field(None, max_length=50)
    country: Optional[str] = Field(None, max_length=100)
    
    # Additional fields
    intended_major: Optional[str] = Field(None, max_length=255)
    extracurriculars: Optional[List[str]] = Field(None)
    achievements: Optional[List[str]] = Field(None)


class StudentProfileResponse(BaseModel):
    """
    Pydantic model for student profile API responses
    """
    id: int
    email: str
    first_name: str
    last_name: str
    phone: Optional[str]
    
    # Academic information
    gpa: Optional[float]
    sat_score: Optional[int]
    act_score: Optional[int]
    high_school: Optional[str]
    graduation_year: Optional[int]
    
    # Personal information
    date_of_birth: Optional[datetime]
    state: Optional[str]
    country: Optional[str]
    
    # Additional fields
    intended_major: Optional[str]
    extracurriculars: Optional[List[str]]
    achievements: Optional[List[str]]
    
    # Status fields
    is_active: bool
    profile_completed: bool
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True
