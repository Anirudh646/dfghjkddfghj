"""
Unit tests for Essay Review Service
"""

import pytest
from unittest.mock import AsyncMock, patch

from essay_review.models.essay import EssayCreate, ReviewRequest, EssayType
from essay_review.services.essay_service import EssayService


class TestEssayService:
    """Test cases for Essay Service"""
    
    @pytest.mark.asyncio
    @patch('essay_review.services.essay_service.get_mongodb')
    async def test_create_essay_placeholder(self, mock_get_mongodb):
        """Test essay creation placeholder implementation"""
        # Mock MongoDB collection
        mock_collection = AsyncMock()
        mock_collection.insert_one.return_value.inserted_id = "507f1f77bcf86cd799439011"
        mock_db = AsyncMock()
        mock_db.__getitem__.return_value = mock_collection
        mock_get_mongodb.return_value = mock_db
        
        essay_data = EssayCreate(
            student_id=1,
            title="My College Essay",
            content="This is a sample essay content with more than ten words to pass validation.",
            essay_type=EssayType.PERSONAL_STATEMENT,
            prompt="Tell us about yourself"
        )
        
        # Call the method
        essay = await EssayService.create_essay(essay_data)
        
        assert essay.student_id == 1
        assert essay.title == "My College Essay"
        assert essay.essay_type == EssayType.PERSONAL_STATEMENT
        assert essay.word_count > 0
    
    @pytest.mark.asyncio
    async def test_review_essay_placeholder(self):
        """Test essay review placeholder implementation"""
        review_request = ReviewRequest(
            essay_id="507f1f77bcf86cd799439011",
            review_type="comprehensive"
        )
        
        # Call the placeholder method
        review = await EssayService.review_essay(review_request)
        
        assert review.essay_id == "507f1f77bcf86cd799439011"
        assert isinstance(review.overall_score, float)
        assert 0.0 <= review.overall_score <= 10.0
        assert isinstance(review.feedback, dict)
        assert isinstance(review.suggestions, list)
        assert isinstance(review.strengths, list)
        assert isinstance(review.weaknesses, list)
        assert review.reviewer == "AI"
    
    @pytest.mark.asyncio
    async def test_get_essay_analytics_placeholder(self):
        """Test essay analytics placeholder implementation"""
        analytics = await EssayService.get_essay_analytics("507f1f77bcf86cd799439011")
        
        assert isinstance(analytics, dict)
        assert "readability_score" in analytics
        assert "complexity_level" in analytics
        assert "sentiment" in analytics
        assert "topics" in analytics


class TestEssayAPI:
    """Test cases for Essay Review API endpoints"""
    
    @patch('essay_review.services.essay_service.get_mongodb')
    def test_create_essay_endpoint(self, mock_get_mongodb, client):
        """Test POST /api/v1/essays/ endpoint"""
        # Mock MongoDB collection
        mock_collection = AsyncMock()
        mock_collection.insert_one.return_value.inserted_id = "507f1f77bcf86cd799439011"
        mock_db = AsyncMock()
        mock_db.__getitem__.return_value = mock_collection
        mock_get_mongodb.return_value = mock_db
        
        essay_data = {
            "student_id": 1,
            "title": "My College Essay",
            "content": "This is a sample essay content with more than ten words to pass validation.",
            "essay_type": "personal_statement",
            "prompt": "Tell us about yourself"
        }
        
        response = client.post("/api/v1/essays/", json=essay_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["student_id"] == 1
        assert data["title"] == "My College Essay"
    
    def test_review_essay_endpoint(self, client):
        """Test POST /api/v1/essays/review endpoint"""
        review_request = {
            "essay_id": "507f1f77bcf86cd799439011",
            "review_type": "comprehensive"
        }
        
        response = client.post("/api/v1/essays/review", json=review_request)
        
        assert response.status_code == 200
        data = response.json()
        assert data["essay_id"] == "507f1f77bcf86cd799439011"
        assert "overall_score" in data
        assert "feedback" in data
        assert "suggestions" in data
    
    def test_get_essay_analytics_endpoint(self, client):
        """Test GET /api/v1/essays/{essay_id}/analytics endpoint"""
        essay_id = "507f1f77bcf86cd799439011"
        
        response = client.get(f"/api/v1/essays/{essay_id}/analytics")
        
        assert response.status_code == 200
        data = response.json()
        assert "readability_score" in data
        assert "complexity_level" in data
