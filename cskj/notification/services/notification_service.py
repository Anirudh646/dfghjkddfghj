"""
Notification Service - Business logic for notifications and reminders
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List, Optional
import json
import logging
from datetime import datetime

from notification.models.notification import (
    Notification, NotificationCreate, NotificationUpdate,
    NotificationStatus, ReminderCreate, BulkNotificationRequest
)
from utils.exceptions import StudentNotFoundException

logger = logging.getLogger(__name__)


class NotificationService:
    """
    Service class for notification operations
    """
    
    @staticmethod
    async def create_notification(
        db: AsyncSession,
        notification_data: NotificationCreate
    ) -> Notification:
        """
        Create a new notification
        """
        try:
            # Convert metadata to JSON string if provided
            metadata_json = json.dumps(notification_data.metadata) if notification_data.metadata else None
            
            db_notification = Notification(
                student_id=notification_data.student_id,
                title=notification_data.title,
                message=notification_data.message,
                notification_type=notification_data.notification_type.value,
                channel=notification_data.channel.value,
                scheduled_at=notification_data.scheduled_at,
                metadata=metadata_json
            )
            
            db.add(db_notification)
            await db.commit()
            await db.refresh(db_notification)
            
            logger.info(f"Created notification for student {notification_data.student_id}")
            return db_notification
            
        except Exception as e:
            await db.rollback()
            logger.error(f"Error creating notification: {e}")
            raise
    
    @staticmethod
    async def get_notification(db: AsyncSession, notification_id: int) -> Optional[Notification]:
        """
        Get notification by ID
        """
        result = await db.execute(
            select(Notification).where(Notification.id == notification_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_student_notifications(
        db: AsyncSession,
        student_id: int,
        status: Optional[NotificationStatus] = None,
        limit: int = 50
    ) -> List[Notification]:
        """
        Get notifications for a specific student
        """
        query = select(Notification).where(Notification.student_id == student_id)
        
        if status:
            query = query.where(Notification.status == status.value)
        
        query = query.order_by(Notification.created_at.desc()).limit(limit)
        
        result = await db.execute(query)
        return result.scalars().all()
    
    @staticmethod
    async def update_notification(
        db: AsyncSession,
        notification_id: int,
        update_data: NotificationUpdate
    ) -> Optional[Notification]:
        """
        Update an existing notification
        """
        notification = await NotificationService.get_notification(db, notification_id)
        if not notification:
            return None
        
        update_values = {}
        for field, value in update_data.dict(exclude_unset=True).items():
            if value is not None:
                if hasattr(value, 'value'):  # Handle enums
                    update_values[field] = value.value
                else:
                    update_values[field] = value
        
        if update_values:
            await db.execute(
                update(Notification)
                .where(Notification.id == notification_id)
                .values(**update_values)
            )
            await db.commit()
            await db.refresh(notification)
        
        return notification
    
    @staticmethod
    async def mark_notification_as_read(
        db: AsyncSession,
        notification_id: int
    ) -> Optional[Notification]:
        """
        Mark a notification as read
        """
        await db.execute(
            update(Notification)
            .where(Notification.id == notification_id)
            .values(
                status=NotificationStatus.READ.value,
                read_at=datetime.utcnow()
            )
        )
        await db.commit()
        
        return await NotificationService.get_notification(db, notification_id)
    
    @staticmethod
    async def send_notification(db: AsyncSession, notification_id: int) -> bool:
        """
        Send a notification (placeholder implementation)
        """
        # TODO: Implement actual notification sending
        # This will include:
        # - Email sending via SMTP
        # - SMS sending via Twilio/similar
        # - Push notifications
        # - In-app notifications
        
        notification = await NotificationService.get_notification(db, notification_id)
        if not notification:
            return False
        
        try:
            # Placeholder: Mark as sent
            await db.execute(
                update(Notification)
                .where(Notification.id == notification_id)
                .values(
                    status=NotificationStatus.SENT.value,
                    sent_at=datetime.utcnow()
                )
            )
            await db.commit()
            
            logger.info(f"Sent notification {notification_id}")
            return True
            
        except Exception as e:
            # Mark as failed and increment retry count
            await db.execute(
                update(Notification)
                .where(Notification.id == notification_id)
                .values(
                    status=NotificationStatus.FAILED.value,
                    retry_count=Notification.retry_count + 1
                )
            )
            await db.commit()
            
            logger.error(f"Failed to send notification {notification_id}: {e}")
            return False
    
    @staticmethod
    async def create_reminder(
        db: AsyncSession,
        reminder_data: ReminderCreate
    ) -> List[Notification]:
        """
        Create reminder notifications for multiple channels
        """
        notifications = []
        
        for channel in reminder_data.channels:
            notification_data = NotificationCreate(
                student_id=reminder_data.student_id,
                title=reminder_data.title,
                message=reminder_data.message,
                notification_type="reminder",
                channel=channel,
                scheduled_at=reminder_data.reminder_date
            )
            
            notification = await NotificationService.create_notification(db, notification_data)
            notifications.append(notification)
        
        return notifications
    
    @staticmethod
    async def send_bulk_notification(
        db: AsyncSession,
        bulk_request: BulkNotificationRequest
    ) -> List[Notification]:
        """
        Send notifications to multiple students
        """
        notifications = []
        
        for student_id in bulk_request.student_ids:
            notification_data = NotificationCreate(
                student_id=student_id,
                title=bulk_request.title,
                message=bulk_request.message,
                notification_type=bulk_request.notification_type,
                channel=bulk_request.channel,
                scheduled_at=bulk_request.scheduled_at
            )
            
            notification = await NotificationService.create_notification(db, notification_data)
            notifications.append(notification)
        
        return notifications
    
    @staticmethod
    async def get_pending_notifications(db: AsyncSession) -> List[Notification]:
        """
        Get all pending notifications that are ready to be sent
        """
        now = datetime.utcnow()
        
        result = await db.execute(
            select(Notification).where(
                Notification.status == NotificationStatus.PENDING.value,
                Notification.scheduled_at <= now
            ).order_by(Notification.scheduled_at)
        )
        
        return result.scalars().all()
