"""
Essay Review API Routes
"""

from fastapi import APIRouter, HTTPException, Path
from typing import List

from essay_review.models.essay import (
    EssayCreate, EssayUpdate, EssayResponse,
    ReviewRequest, ReviewResponse
)
from essay_review.services.essay_service import EssayService

router = APIRouter()


@router.post("/", response_model=EssayResponse, status_code=201)
async def create_essay(essay_data: EssayCreate):
    """
    Create a new essay
    """
    essay = await EssayService.create_essay(essay_data)
    return essay


@router.get("/{essay_id}", response_model=EssayResponse)
async def get_essay(essay_id: str = Path(..., description="Essay ID")):
    """
    Get an essay by ID
    """
    essay = await EssayService.get_essay(essay_id)
    if not essay:
        raise HTTPException(status_code=404, detail="Essay not found")
    return essay


@router.get("/student/{student_id}", response_model=List[EssayResponse])
async def get_student_essays(student_id: int):
    """
    Get all essays for a specific student
    """
    essays = await EssayService.get_student_essays(student_id)
    return essays


@router.put("/{essay_id}", response_model=EssayResponse)
async def update_essay(
    essay_id: str,
    update_data: EssayUpdate
):
    """
    Update an existing essay
    """
    essay = await EssayService.update_essay(essay_id, update_data)
    if not essay:
        raise HTTPException(status_code=404, detail="Essay not found")
    return essay


@router.delete("/{essay_id}", status_code=204)
async def delete_essay(essay_id: str):
    """
    Delete an essay
    """
    success = await EssayService.delete_essay(essay_id)
    if not success:
        raise HTTPException(status_code=404, detail="Essay not found")


@router.post("/review", response_model=ReviewResponse)
async def review_essay(review_request: ReviewRequest):
    """
    Perform LLM-powered essay review
    """
    review = await EssayService.review_essay(review_request)
    return review


@router.get("/{essay_id}/analytics")
async def get_essay_analytics(essay_id: str):
    """
    Get analytics for an essay
    """
    analytics = await EssayService.get_essay_analytics(essay_id)
    return analytics
