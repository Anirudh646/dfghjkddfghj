"""
Student Profile API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from db.postgresql import get_postgres_session
from student_profile.models.student import (
    StudentProfileCreate, 
    StudentProfileUpdate, 
    StudentProfileResponse
)
from student_profile.services.student_service import StudentService
from utils.exceptions import StudentNotFoundException, ValidationException

router = APIRouter()


@router.post("/", response_model=StudentProfileResponse, status_code=201)
async def create_student_profile(
    student_data: StudentProfileCreate,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Create a new student profile
    """
    try:
        student = await StudentService.create_student_profile(db, student_data)
        return StudentProfileResponse.from_orm(student)
    except ValidationException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{student_id}", response_model=StudentProfileResponse)
async def get_student_profile(
    student_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get a student profile by ID
    """
    try:
        student = await StudentService.get_student_profile(db, student_id)
        return StudentProfileResponse.from_orm(student)
    except StudentNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/", response_model=List[StudentProfileResponse])
async def get_all_students(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get all student profiles with pagination
    """
    students = await StudentService.get_all_students(db, skip=skip, limit=limit)
    return [StudentProfileResponse.from_orm(student) for student in students]


@router.put("/{student_id}", response_model=StudentProfileResponse)
async def update_student_profile(
    student_id: int,
    update_data: StudentProfileUpdate,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Update an existing student profile
    """
    try:
        student = await StudentService.update_student_profile(db, student_id, update_data)
        return StudentProfileResponse.from_orm(student)
    except StudentNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{student_id}", status_code=204)
async def delete_student_profile(
    student_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Delete a student profile (soft delete)
    """
    try:
        await StudentService.delete_student_profile(db, student_id)
    except StudentNotFoundException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/email/{email}", response_model=StudentProfileResponse)
async def get_student_by_email(
    email: str,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get a student profile by email address
    """
    student = await StudentService.get_student_by_email(db, email)
    if not student:
        raise HTTPException(
            status_code=404, 
            detail=f"Student with email {email} not found"
        )
    return StudentProfileResponse.from_orm(student)


@router.get("/search/", response_model=List[StudentProfileResponse])
async def search_students(
    q: str = Query(..., min_length=2, description="Search query"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=500, description="Maximum number of records to return"),
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Search student profiles by name, email, or school
    """
    students = await StudentService.search_students(db, q, skip=skip, limit=limit)
    return [StudentProfileResponse.from_orm(student) for student in students]
