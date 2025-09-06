"""
Essay Review models
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum


class EssayType(str, Enum):
    """Essay type enumeration"""
    PERSONAL_STATEMENT = "personal_statement"
    SUPPLEMENTAL = "supplemental"
    SCHOLARSHIP = "scholarship"
    COMMON_APP = "common_app"


class EssayStatus(str, Enum):
    """Essay review status enumeration"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    REVIEWED = "reviewed"
    REVISED = "revised"


class EssayCreate(BaseModel):
    """Request model for creating an essay"""
    student_id: int
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=10, description="Essay content")
    essay_type: EssayType
    college_id: Optional[int] = Field(None, description="Target college if applicable")
    prompt: Optional[str] = Field(None, description="Essay prompt or question")
    word_limit: Optional[int] = Field(None, ge=0, description="Word limit for the essay")


class EssayUpdate(BaseModel):
    """Request model for updating an essay"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=10)
    essay_type: Optional[EssayType] = None
    college_id: Optional[int] = None
    prompt: Optional[str] = None
    word_limit: Optional[int] = Field(None, ge=0)
    status: Optional[EssayStatus] = None


class EssayResponse(BaseModel):
    """Response model for essay data"""
    id: str = Field(..., description="MongoDB ObjectId as string")
    student_id: int
    title: str
    content: str
    essay_type: EssayType
    status: EssayStatus
    college_id: Optional[int]
    prompt: Optional[str]
    word_limit: Optional[int]
    word_count: int
    created_at: datetime
    updated_at: datetime


class ReviewRequest(BaseModel):
    """Request model for essay review"""
    essay_id: str
    review_type: str = Field(default="comprehensive", description="Type of review to perform")
    focus_areas: Optional[List[str]] = Field(None, description="Specific areas to focus on")


class ReviewResponse(BaseModel):
    """Response model for essay review"""
    essay_id: str
    overall_score: float = Field(..., ge=0.0, le=10.0, description="Overall score out of 10")
    feedback: Dict[str, str] = Field(..., description="Detailed feedback by category")
    suggestions: List[str] = Field(default=[], description="Improvement suggestions")
    strengths: List[str] = Field(default=[], description="Essay strengths")
    weaknesses: List[str] = Field(default=[], description="Areas for improvement")
    grammar_issues: List[Dict[str, str]] = Field(default=[], description="Grammar and style issues")
    reviewed_at: datetime
    reviewer: str = Field(default="AI", description="Who performed the review")
