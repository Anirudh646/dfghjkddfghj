"""
College Matching models
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, Text
from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

from db.postgresql import Base


class CollegeType(str, Enum):
    """College type enumeration"""
    PUBLIC = "public"
    PRIVATE = "private"
    COMMUNITY = "community"


class College(Base):
    """
    SQLAlchemy model for colleges
    """
    __tablename__ = "colleges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # public, private, community
    state = Column(String(50), nullable=False)
    city = Column(String(100), nullable=False)
    
    # Academic requirements
    avg_gpa = Column(Float, nullable=True)
    sat_25th_percentile = Column(Integer, nullable=True)
    sat_75th_percentile = Column(Integer, nullable=True)
    act_25th_percentile = Column(Integer, nullable=True)
    act_75th_percentile = Column(Integer, nullable=True)
    
    # College info
    acceptance_rate = Column(Float, nullable=True)
    tuition_in_state = Column(Integer, nullable=True)
    tuition_out_state = Column(Integer, nullable=True)
    enrollment = Column(Integer, nullable=True)
    
    # Additional info
    website = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    majors_offered = Column(Text, nullable=True)  # JSON string
    
    is_active = Column(Boolean, default=True)


class CollegeMatchRequest(BaseModel):
    """Request model for college matching"""
    student_id: int
    preferences: Optional[dict] = Field(None, description="Student preferences for matching")


class CollegeMatchResponse(BaseModel):
    """Response model for college matching"""
    college_id: int
    college_name: str
    match_score: float = Field(..., ge=0.0, le=1.0, description="Match score between 0 and 1")
    match_reasons: List[str] = Field(default=[], description="Reasons for the match")
    
    class Config:
        from_attributes = True
