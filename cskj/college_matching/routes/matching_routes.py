"""
College Matching API Routes
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.postgresql import get_postgres_session
from college_matching.models.college import CollegeMatchRequest, CollegeMatchResponse
from college_matching.services.matching_service import CollegeMatchingService

router = APIRouter()


@router.post("/match", response_model=List[CollegeMatchResponse])
async def match_colleges(
    match_request: CollegeMatchRequest,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Match colleges for a student based on their profile and preferences
    """
    matches = await CollegeMatchingService.match_colleges(db, match_request)
    return matches


@router.get("/recommendations/{student_id}", response_model=List[CollegeMatchResponse])
async def get_college_recommendations(
    student_id: int,
    limit: int = Query(10, ge=1, le=50, description="Maximum number of recommendations"),
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get top college recommendations for a student
    """
    recommendations = await CollegeMatchingService.get_college_recommendations(
        db, student_id, limit
    )
    return recommendations


@router.get("/probability/{student_id}/{college_id}")
async def get_admission_probability(
    student_id: int,
    college_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Calculate admission probability for a student to a specific college
    """
    probability = await CollegeMatchingService.calculate_admission_probability(
        db, student_id, college_id
    )
    return {"student_id": student_id, "college_id": college_id, "probability": probability}
