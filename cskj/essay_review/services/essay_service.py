"""
Essay Review Service - Business logic for essay operations and LLM-powered reviews
"""

from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from datetime import datetime
from typing import List, Optional
import logging

from db.mongodb import get_mongodb, MongoCollections
from essay_review.models.essay import (
    EssayCreate, EssayUpdate, EssayResponse, 
    ReviewRequest, ReviewResponse, EssayStatus
)

logger = logging.getLogger(__name__)


class EssayService:
    """
    Service class for essay operations and reviews
    """
    
    @staticmethod
    async def create_essay(essay_data: EssayCreate) -> EssayResponse:
        """
        Create a new essay document in MongoDB
        """
        db = get_mongodb()
        collection = db[MongoCollections.ESSAYS]
        
        # Calculate word count
        word_count = len(essay_data.content.split())
        
        essay_doc = {
            "student_id": essay_data.student_id,
            "title": essay_data.title,
            "content": essay_data.content,
            "essay_type": essay_data.essay_type.value,
            "status": EssayStatus.DRAFT.value,
            "college_id": essay_data.college_id,
            "prompt": essay_data.prompt,
            "word_limit": essay_data.word_limit,
            "word_count": word_count,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await collection.insert_one(essay_doc)
        essay_doc["id"] = str(result.inserted_id)
        
        logger.info(f"Created essay for student {essay_data.student_id}")
        return EssayResponse(**essay_doc)
    
    @staticmethod
    async def get_essay(essay_id: str) -> Optional[EssayResponse]:
        """
        Get an essay by ID
        """
        db = get_mongodb()
        collection = db[MongoCollections.ESSAYS]
        
        essay_doc = await collection.find_one({"_id": ObjectId(essay_id)})
        if not essay_doc:
            return None
        
        essay_doc["id"] = str(essay_doc.pop("_id"))
        return EssayResponse(**essay_doc)
    
    @staticmethod
    async def get_student_essays(student_id: int) -> List[EssayResponse]:
        """
        Get all essays for a specific student
        """
        db = get_mongodb()
        collection = db[MongoCollections.ESSAYS]
        
        cursor = collection.find({"student_id": student_id}).sort("created_at", -1)
        essays = []
        
        async for essay_doc in cursor:
            essay_doc["id"] = str(essay_doc.pop("_id"))
            essays.append(EssayResponse(**essay_doc))
        
        return essays
    
    @staticmethod
    async def update_essay(essay_id: str, update_data: EssayUpdate) -> Optional[EssayResponse]:
        """
        Update an existing essay
        """
        db = get_mongodb()
        collection = db[MongoCollections.ESSAYS]
        
        update_fields = {}
        for field, value in update_data.dict(exclude_unset=True).items():
            if value is not None:
                if hasattr(value, 'value'):  # Handle enums
                    update_fields[field] = value.value
                else:
                    update_fields[field] = value
        
        # Recalculate word count if content changed
        if "content" in update_fields:
            update_fields["word_count"] = len(update_fields["content"].split())
        
        update_fields["updated_at"] = datetime.utcnow()
        
        result = await collection.update_one(
            {"_id": ObjectId(essay_id)},
            {"$set": update_fields}
        )
        
        if result.modified_count == 0:
            return None
        
        return await EssayService.get_essay(essay_id)
    
    @staticmethod
    async def delete_essay(essay_id: str) -> bool:
        """
        Delete an essay
        """
        db = get_mongodb()
        collection = db[MongoCollections.ESSAYS]
        
        result = await collection.delete_one({"_id": ObjectId(essay_id)})
        return result.deleted_count > 0
    
    @staticmethod
    async def review_essay(review_request: ReviewRequest) -> ReviewResponse:
        """
        Perform LLM-powered essay review
        Placeholder implementation - to be developed later
        """
        # TODO: Implement LLM-powered essay review
        # This will include:
        # - Integration with OpenAI/Anthropic APIs
        # - Grammar and style checking
        # - Content analysis
        # - Structure evaluation
        # - Personalized feedback generation
        
        logger.info(f"Starting essay review for essay {review_request.essay_id}")
        
        # Placeholder response
        return ReviewResponse(
            essay_id=review_request.essay_id,
            overall_score=7.5,
            feedback={
                "structure": "Good overall structure with clear introduction and conclusion.",
                "content": "Compelling personal narrative that demonstrates growth.",
                "grammar": "Minor grammatical errors that need attention.",
                "style": "Writing style is engaging and authentic."
            },
            suggestions=[
                "Consider strengthening the transition between paragraphs 2 and 3",
                "Add more specific examples to support your main points",
                "Review grammar in the second paragraph"
            ],
            strengths=[
                "Strong opening hook",
                "Clear thesis statement",
                "Personal voice comes through well"
            ],
            weaknesses=[
                "Some repetitive phrasing",
                "Could use more concrete details"
            ],
            grammar_issues=[
                {"issue": "Run-on sentence", "location": "Paragraph 2, line 3"},
                {"issue": "Missing comma", "location": "Paragraph 4, line 1"}
            ],
            reviewed_at=datetime.utcnow(),
            reviewer="AI"
        )
    
    @staticmethod
    async def get_essay_analytics(essay_id: str) -> dict:
        """
        Get analytics for an essay (readability, complexity, etc.)
        Placeholder implementation
        """
        # TODO: Implement essay analytics
        # This will include:
        # - Readability scores
        # - Complexity analysis
        # - Sentiment analysis
        # - Topic modeling
        
        logger.info(f"Generating analytics for essay {essay_id}")
        
        # Placeholder response
        return {
            "readability_score": 8.2,
            "complexity_level": "intermediate",
            "sentiment": "positive",
            "topics": ["personal_growth", "education", "career_goals"]
        }
