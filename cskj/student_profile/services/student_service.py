"""
Student Profile Service - Business logic for student operations
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
import json
import logging

from student_profile.models.student import StudentProfile, StudentProfileCreate, StudentProfileUpdate
from utils.exceptions import StudentNotFoundException, ValidationException

logger = logging.getLogger(__name__)


class StudentService:
    """
    Service class for student profile business logic
    """
    
    @staticmethod
    async def create_student_profile(
        db: AsyncSession, 
        student_data: StudentProfileCreate
    ) -> StudentProfile:
        """
        Create a new student profile
        """
        try:
            # Convert lists to JSON strings for storage
            extracurriculars_json = json.dumps(student_data.extracurriculars) if student_data.extracurriculars else None
            achievements_json = json.dumps(student_data.achievements) if student_data.achievements else None
            
            # Create SQLAlchemy model instance
            db_student = StudentProfile(
                email=student_data.email,
                first_name=student_data.first_name,
                last_name=student_data.last_name,
                phone=student_data.phone,
                gpa=student_data.gpa,
                sat_score=student_data.sat_score,
                act_score=student_data.act_score,
                high_school=student_data.high_school,
                graduation_year=student_data.graduation_year,
                date_of_birth=student_data.date_of_birth,
                state=student_data.state,
                country=student_data.country,
                intended_major=student_data.intended_major,
                extracurriculars=extracurriculars_json,
                achievements=achievements_json,
                profile_completed=StudentService._is_profile_complete(student_data)
            )
            
            db.add(db_student)
            await db.commit()
            await db.refresh(db_student)
            
            logger.info(f"Created student profile for email: {student_data.email}")
            return db_student
            
        except IntegrityError:
            await db.rollback()
            raise ValidationException(
                message="Student with this email already exists",
                field_errors={"email": "Email already registered"}
            )
        except Exception as e:
            await db.rollback()
            logger.error(f"Error creating student profile: {e}")
            raise
    
    @staticmethod
    async def get_student_profile(db: AsyncSession, student_id: int) -> StudentProfile:
        """
        Get student profile by ID
        """
        result = await db.execute(
            select(StudentProfile).where(
                StudentProfile.id == student_id,
                StudentProfile.is_active == True
            )
        )
        student = result.scalar_one_or_none()
        
        if not student:
            raise StudentNotFoundException(str(student_id))
        
        return student
    
    @staticmethod
    async def get_student_by_email(db: AsyncSession, email: str) -> Optional[StudentProfile]:
        """
        Get student profile by email
        """
        result = await db.execute(
            select(StudentProfile).where(
                StudentProfile.email == email.lower(),
                StudentProfile.is_active == True
            )
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all_students(
        db: AsyncSession, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[StudentProfile]:
        """
        Get all student profiles with pagination
        """
        result = await db.execute(
            select(StudentProfile)
            .where(StudentProfile.is_active == True)
            .offset(skip)
            .limit(limit)
            .order_by(StudentProfile.created_at.desc())
        )
        return result.scalars().all()
    
    @staticmethod
    async def update_student_profile(
        db: AsyncSession,
        student_id: int,
        update_data: StudentProfileUpdate
    ) -> StudentProfile:
        """
        Update an existing student profile
        """
        # First check if student exists
        student = await StudentService.get_student_profile(db, student_id)
        
        # Prepare update data
        update_values = {}
        for field, value in update_data.dict(exclude_unset=True).items():
            if field in ['extracurriculars', 'achievements'] and value is not None:
                update_values[field] = json.dumps(value)
            else:
                update_values[field] = value
        
        if update_values:
            # Check if profile is now complete
            if 'gpa' in update_values or 'sat_score' in update_values or 'act_score' in update_values:
                # Re-evaluate profile completion status
                updated_student_data = StudentProfileCreate(
                    email=student.email,
                    first_name=update_values.get('first_name', student.first_name),
                    last_name=update_values.get('last_name', student.last_name),
                    gpa=update_values.get('gpa', student.gpa),
                    sat_score=update_values.get('sat_score', student.sat_score),
                    act_score=update_values.get('act_score', student.act_score),
                    high_school=update_values.get('high_school', student.high_school)
                )
                update_values['profile_completed'] = StudentService._is_profile_complete(updated_student_data)
            
            await db.execute(
                update(StudentProfile)
                .where(StudentProfile.id == student_id)
                .values(**update_values)
            )
            await db.commit()
            
            # Refresh and return updated student
            await db.refresh(student)
        
        logger.info(f"Updated student profile: {student_id}")
        return student
    
    @staticmethod
    async def delete_student_profile(db: AsyncSession, student_id: int) -> bool:
        """
        Soft delete a student profile (mark as inactive)
        """
        # Check if student exists
        await StudentService.get_student_profile(db, student_id)
        
        await db.execute(
            update(StudentProfile)
            .where(StudentProfile.id == student_id)
            .values(is_active=False)
        )
        await db.commit()
        
        logger.info(f"Deleted student profile: {student_id}")
        return True
    
    @staticmethod
    def _is_profile_complete(student_data: StudentProfileCreate) -> bool:
        """
        Determine if a student profile is complete based on key fields
        """
        required_fields = [
            student_data.first_name,
            student_data.last_name,
            student_data.email,
            student_data.high_school
        ]
        
        # At least one test score should be provided
        has_test_score = student_data.sat_score is not None or student_data.act_score is not None
        has_gpa = student_data.gpa is not None
        
        return all(field is not None for field in required_fields) and has_test_score and has_gpa
    
    @staticmethod
    async def search_students(
        db: AsyncSession,
        query: str,
        skip: int = 0,
        limit: int = 50
    ) -> List[StudentProfile]:
        """
        Search students by name, email, or school
        Placeholder for more advanced search functionality
        """
        # Basic search implementation
        search_pattern = f"%{query.lower()}%"
        
        result = await db.execute(
            select(StudentProfile)
            .where(
                StudentProfile.is_active == True,
                (
                    StudentProfile.first_name.ilike(search_pattern) |
                    StudentProfile.last_name.ilike(search_pattern) |
                    StudentProfile.email.ilike(search_pattern) |
                    StudentProfile.high_school.ilike(search_pattern)
                )
            )
            .offset(skip)
            .limit(limit)
            .order_by(StudentProfile.created_at.desc())
        )
        
        return result.scalars().all()
