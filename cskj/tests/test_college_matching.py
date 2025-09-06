"""
Unit tests for College Matching Service
"""

import pytest
from unittest.mock import AsyncMock

from college_matching.models.college import CollegeMatchRequest
from college_matching.services.matching_service import CollegeMatchingService


class TestCollegeMatchingService:
    """Test cases for College Matching Service"""
    
    @pytest.mark.asyncio
    async def test_match_colleges_placeholder(self, test_db_session):
        """Test college matching placeholder implementation"""
        match_request = CollegeMatchRequest(
            student_id=1,
            preferences={"state": "CA", "major": "Computer Science"}
        )
        
        # Call the placeholder method
        matches = await CollegeMatchingService.match_colleges(test_db_session, match_request)
        
        # Should return empty list for now (placeholder)
        assert isinstance(matches, list)
        assert len(matches) == 0
    
    @pytest.mark.asyncio
    async def test_get_college_recommendations_placeholder(self, test_db_session):
        """Test college recommendations placeholder implementation"""
        recommendations = await CollegeMatchingService.get_college_recommendations(
            test_db_session, student_id=1, limit=10
        )
        
        # Should return empty list for now (placeholder)
        assert isinstance(recommendations, list)
        assert len(recommendations) == 0
    
    @pytest.mark.asyncio
    async def test_calculate_admission_probability_placeholder(self, test_db_session):
        """Test admission probability calculation placeholder"""
        probability = await CollegeMatchingService.calculate_admission_probability(
            test_db_session, student_id=1, college_id=1
        )
        
        # Should return 0.5 for now (placeholder)
        assert isinstance(probability, float)
        assert probability == 0.5


class TestCollegeMatchingAPI:
    """Test cases for College Matching API endpoints"""
    
    def test_match_colleges_endpoint(self, client):
        """Test POST /api/v1/matching/match endpoint"""
        match_request = {
            "student_id": 1,
            "preferences": {"state": "CA", "major": "Computer Science"}
        }
        
        response = client.post("/api/v1/matching/match", json=match_request)
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_recommendations_endpoint(self, client):
        """Test GET /api/v1/matching/recommendations/{student_id} endpoint"""
        response = client.get("/api/v1/matching/recommendations/1")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
    
    def test_get_admission_probability_endpoint(self, client):
        """Test GET /api/v1/matching/probability/{student_id}/{college_id} endpoint"""
        response = client.get("/api/v1/matching/probability/1/1")
        
        assert response.status_code == 200
        data = response.json()
        assert "student_id" in data
        assert "college_id" in data
        assert "probability" in data
        assert data["student_id"] == 1
        assert data["college_id"] == 1
