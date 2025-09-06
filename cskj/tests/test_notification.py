"""
Unit tests for Notification Service
"""

import pytest
from datetime import datetime, timedelta

from notification.models.notification import (
    NotificationCreate, NotificationType, NotificationChannel, NotificationStatus
)
from notification.services.notification_service import NotificationService


class TestNotificationService:
    """Test cases for Notification Service"""
    
    @pytest.mark.asyncio
    async def test_create_notification(self, test_db_session):
        """Test creating a notification"""
        notification_data = NotificationCreate(
            student_id=1,
            title="Test Notification",
            message="This is a test notification",
            notification_type=NotificationType.REMINDER,
            channel=NotificationChannel.EMAIL,
            scheduled_at=datetime.utcnow() + timedelta(hours=1)
        )
        
        notification = await NotificationService.create_notification(test_db_session, notification_data)
        
        assert notification.id is not None
        assert notification.student_id == 1
        assert notification.title == "Test Notification"
        assert notification.message == "This is a test notification"
        assert notification.notification_type == NotificationType.REMINDER.value
        assert notification.channel == NotificationChannel.EMAIL.value
        assert notification.status == NotificationStatus.PENDING.value
    
    @pytest.mark.asyncio
    async def test_get_notification(self, test_db_session):
        """Test retrieving a notification"""
        # Create notification first
        notification_data = NotificationCreate(
            student_id=1,
            title="Test Notification",
            message="This is a test notification",
            notification_type=NotificationType.REMINDER,
            channel=NotificationChannel.EMAIL
        )
        
        created_notification = await NotificationService.create_notification(test_db_session, notification_data)
        
        # Retrieve notification
        retrieved_notification = await NotificationService.get_notification(
            test_db_session, created_notification.id
        )
        
        assert retrieved_notification is not None
        assert retrieved_notification.id == created_notification.id
        assert retrieved_notification.title == created_notification.title
    
    @pytest.mark.asyncio
    async def test_get_student_notifications(self, test_db_session):
        """Test retrieving notifications for a student"""
        student_id = 1
        
        # Create multiple notifications for the student
        for i in range(3):
            notification_data = NotificationCreate(
                student_id=student_id,
                title=f"Test Notification {i+1}",
                message=f"This is test notification {i+1}",
                notification_type=NotificationType.REMINDER,
                channel=NotificationChannel.EMAIL
            )
            await NotificationService.create_notification(test_db_session, notification_data)
        
        # Retrieve all notifications for the student
        notifications = await NotificationService.get_student_notifications(test_db_session, student_id)
        
        assert len(notifications) == 3
        assert all(n.student_id == student_id for n in notifications)
    
    @pytest.mark.asyncio
    async def test_mark_notification_as_read(self, test_db_session):
        """Test marking a notification as read"""
        # Create notification
        notification_data = NotificationCreate(
            student_id=1,
            title="Test Notification",
            message="This is a test notification",
            notification_type=NotificationType.REMINDER,
            channel=NotificationChannel.EMAIL
        )
        
        notification = await NotificationService.create_notification(test_db_session, notification_data)
        assert notification.status == NotificationStatus.PENDING.value
        assert notification.read_at is None
        
        # Mark as read
        updated_notification = await NotificationService.mark_notification_as_read(
            test_db_session, notification.id
        )
        
        assert updated_notification.status == NotificationStatus.READ.value
        assert updated_notification.read_at is not None
    
    @pytest.mark.asyncio
    async def test_send_notification_placeholder(self, test_db_session):
        """Test sending a notification (placeholder implementation)"""
        # Create notification
        notification_data = NotificationCreate(
            student_id=1,
            title="Test Notification",
            message="This is a test notification",
            notification_type=NotificationType.REMINDER,
            channel=NotificationChannel.EMAIL
        )
        
        notification = await NotificationService.create_notification(test_db_session, notification_data)
        
        # Send notification
        success = await NotificationService.send_notification(test_db_session, notification.id)
        
        assert success is True
        
        # Check that status was updated
        updated_notification = await NotificationService.get_notification(test_db_session, notification.id)
        assert updated_notification.status == NotificationStatus.SENT.value
        assert updated_notification.sent_at is not None


class TestNotificationAPI:
    """Test cases for Notification API endpoints"""
    
    def test_create_notification_endpoint(self, client):
        """Test POST /api/v1/notifications/ endpoint"""
        notification_data = {
            "student_id": 1,
            "title": "Test Notification",
            "message": "This is a test notification",
            "notification_type": "reminder",
            "channel": "email"
        }
        
        response = client.post("/api/v1/notifications/", json=notification_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["student_id"] == 1
        assert data["title"] == "Test Notification"
        assert data["status"] == "pending"
        assert "id" in data
    
    def test_get_notification_endpoint(self, client):
        """Test GET /api/v1/notifications/{id} endpoint"""
        # Create notification first
        notification_data = {
            "student_id": 1,
            "title": "Test Notification",
            "message": "This is a test notification",
            "notification_type": "reminder",
            "channel": "email"
        }
        
        create_response = client.post("/api/v1/notifications/", json=notification_data)
        notification_id = create_response.json()["id"]
        
        # Get notification
        response = client.get(f"/api/v1/notifications/{notification_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == notification_id
        assert data["title"] == "Test Notification"
    
    def test_get_student_notifications_endpoint(self, client):
        """Test GET /api/v1/notifications/student/{student_id} endpoint"""
        student_id = 1
        
        # Create notification first
        notification_data = {
            "student_id": student_id,
            "title": "Test Notification",
            "message": "This is a test notification",
            "notification_type": "reminder",
            "channel": "email"
        }
        
        client.post("/api/v1/notifications/", json=notification_data)
        
        # Get student notifications
        response = client.get(f"/api/v1/notifications/student/{student_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert all(notification["student_id"] == student_id for notification in data)
    
    def test_mark_notification_as_read_endpoint(self, client):
        """Test POST /api/v1/notifications/{id}/read endpoint"""
        # Create notification first
        notification_data = {
            "student_id": 1,
            "title": "Test Notification",
            "message": "This is a test notification",
            "notification_type": "reminder",
            "channel": "email"
        }
        
        create_response = client.post("/api/v1/notifications/", json=notification_data)
        notification_id = create_response.json()["id"]
        
        # Mark as read
        response = client.post(f"/api/v1/notifications/{notification_id}/read")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "read"
        assert data["read_at"] is not None
