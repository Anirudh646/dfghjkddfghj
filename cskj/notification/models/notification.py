"""
Notification models
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum

from db.postgresql import Base


class NotificationType(str, Enum):
    """Notification type enumeration"""
    REMINDER = "reminder"
    DEADLINE = "deadline"
    UPDATE = "update"
    WELCOME = "welcome"
    ESSAY_REVIEW = "essay_review"
    COLLEGE_MATCH = "college_match"


class NotificationStatus(str, Enum):
    """Notification status enumeration"""
    PENDING = "pending"
    SENT = "sent"
    FAILED = "failed"
    READ = "read"


class NotificationChannel(str, Enum):
    """Notification channel enumeration"""
    EMAIL = "email"
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"


class Notification(Base):
    """
    SQLAlchemy model for notifications
    """
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, nullable=False, index=True)
    
    # Notification content
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False)
    channel = Column(String(50), nullable=False)
    
    # Status and scheduling
    status = Column(String(50), default=NotificationStatus.PENDING.value)
    scheduled_at = Column(DateTime(timezone=True), nullable=True)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    metadata = Column(Text, nullable=True)  # JSON string for additional data
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class NotificationCreate(BaseModel):
    """Request model for creating a notification"""
    student_id: int
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    notification_type: NotificationType
    channel: NotificationChannel
    scheduled_at: Optional[datetime] = Field(None, description="When to send the notification")
    metadata: Optional[Dict[str, Any]] = Field(None, description="Additional metadata")


class NotificationUpdate(BaseModel):
    """Request model for updating a notification"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    message: Optional[str] = Field(None, min_length=1)
    scheduled_at: Optional[datetime] = None
    status: Optional[NotificationStatus] = None


class NotificationResponse(BaseModel):
    """Response model for notification data"""
    id: int
    student_id: int
    title: str
    message: str
    notification_type: NotificationType
    channel: NotificationChannel
    status: NotificationStatus
    scheduled_at: Optional[datetime]
    sent_at: Optional[datetime]
    read_at: Optional[datetime]
    retry_count: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class ReminderCreate(BaseModel):
    """Request model for creating reminders"""
    student_id: int
    title: str
    message: str
    reminder_date: datetime
    channels: list[NotificationChannel] = Field(default=[NotificationChannel.EMAIL])


class BulkNotificationRequest(BaseModel):
    """Request model for sending bulk notifications"""
    student_ids: list[int]
    title: str
    message: str
    notification_type: NotificationType
    channel: NotificationChannel
    scheduled_at: Optional[datetime] = None
