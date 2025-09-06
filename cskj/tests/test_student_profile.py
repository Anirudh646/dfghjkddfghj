"""
Unit tests for Student Profile Service
"""

import pytest
from fastapi.testclient import TestClient

from student_profile.models.student import StudentProfileCreate
from student_profile.services.student_service import StudentService


class TestStudentProfileService:
    """Test cases for Student Profile Service"""
    
    @pytest.mark.asyncio
    async def test_create_student_profile(self, test_db_session, sample_student_data):
        """Test creating a student profile"""
        student_data = StudentProfileCreate(**sample_student_data)
        
        # Create student
        student = await StudentService.create_student_profile(test_db_session, student_data)
        
        assert student.id is not None
        assert student.email == sample_student_data["email"].lower()
        assert student.first_name == sample_student_data["first_name"]
        assert student.last_name == sample_student_data["last_name"]
        assert student.gpa == sample_student_data["gpa"]
        assert student.sat_score == sample_student_data["sat_score"]
    
    @pytest.mark.asyncio
    async def test_get_student_profile(self, test_db_session, sample_student_data):
        """Test retrieving a student profile"""
        student_data = StudentProfileCreate(**sample_student_data)
        
        # Create student first
        created_student = await StudentService.create_student_profile(test_db_session, student_data)
        
        # Retrieve student
        retrieved_student = await StudentService.get_student_profile(test_db_session, created_student.id)
        
        assert retrieved_student.id == created_student.id
        assert retrieved_student.email == created_student.email
    
    @pytest.mark.asyncio
    async def test_get_student_by_email(self, test_db_session, sample_student_data):
        """Test retrieving a student by email"""
        student_data = StudentProfileCreate(**sample_student_data)
        
        # Create student first
        created_student = await StudentService.create_student_profile(test_db_session, student_data)
        
        # Retrieve by email
        retrieved_student = await StudentService.get_student_by_email(
            test_db_session, 
            sample_student_data["email"]
        )
        
        assert retrieved_student is not None
        assert retrieved_student.id == created_student.id
        assert retrieved_student.email == sample_student_data["email"].lower()
    
    @pytest.mark.asyncio
    async def test_duplicate_email_fails(self, test_db_session, sample_student_data):
        """Test that creating a student with duplicate email fails"""
        student_data = StudentProfileCreate(**sample_student_data)
        
        # Create first student
        await StudentService.create_student_profile(test_db_session, student_data)
        
        # Try to create another student with same email
        with pytest.raises(Exception):  # Should raise ValidationException
            await StudentService.create_student_profile(test_db_session, student_data)


class TestStudentProfileAPI:
    """Test cases for Student Profile API endpoints"""
    
    def test_create_student_endpoint(self, client, sample_student_data):
        """Test POST /api/v1/students/ endpoint"""
        response = client.post("/api/v1/students/", json=sample_student_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["email"] == sample_student_data["email"].lower()
        assert data["first_name"] == sample_student_data["first_name"]
        assert "id" in data
    
    def test_get_student_endpoint(self, client, sample_student_data):
        """Test GET /api/v1/students/{id} endpoint"""
        # Create student first
        create_response = client.post("/api/v1/students/", json=sample_student_data)
        student_id = create_response.json()["id"]
        
        # Get student
        response = client.get(f"/api/v1/students/{student_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == student_id
        assert data["email"] == sample_student_data["email"].lower()
    
    def test_get_nonexistent_student_returns_404(self, client):
        """Test that getting a non-existent student returns 404"""
        response = client.get("/api/v1/students/99999")
        assert response.status_code == 404
    
    def test_update_student_endpoint(self, client, sample_student_data):
        """Test PUT /api/v1/students/{id} endpoint"""
        # Create student first
        create_response = client.post("/api/v1/students/", json=sample_student_data)
        student_id = create_response.json()["id"]
        
        # Update student
        update_data = {"first_name": "Jane", "gpa": 3.9}
        response = client.put(f"/api/v1/students/{student_id}", json=update_data)
        
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "Jane"
        assert data["gpa"] == 3.9
        assert data["last_name"] == sample_student_data["last_name"]  # Unchanged
    
    def test_search_students_endpoint(self, client, sample_student_data):
        """Test GET /api/v1/students/search/ endpoint"""
        # Create student first
        client.post("/api/v1/students/", json=sample_student_data)
        
        # Search by first name
        response = client.get("/api/v1/students/search/", params={"q": "John"})
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert any(student["first_name"] == "John" for student in data)
