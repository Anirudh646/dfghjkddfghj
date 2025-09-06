"""
Notification API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from db.postgresql import get_postgres_session
from notification.models.notification import (
    NotificationCreate, NotificationUpdate, NotificationResponse,
    NotificationStatus, ReminderCreate, BulkNotificationRequest
)
from notification.services.notification_service import NotificationService

router = APIRouter()


@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(
    notification_data: NotificationCreate,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Create a new notification
    """
    notification = await NotificationService.create_notification(db, notification_data)
    return NotificationResponse.from_orm(notification)


@router.get("/{notification_id}", response_model=NotificationResponse)
async def get_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get a notification by ID
    """
    notification = await NotificationService.get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationResponse.from_orm(notification)


@router.get("/student/{student_id}", response_model=List[NotificationResponse])
async def get_student_notifications(
    student_id: int,
    status: Optional[NotificationStatus] = Query(None, description="Filter by status"),
    limit: int = Query(50, ge=1, le=200, description="Maximum number of notifications"),
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get notifications for a specific student
    """
    notifications = await NotificationService.get_student_notifications(
        db, student_id, status, limit
    )
    return [NotificationResponse.from_orm(notification) for notification in notifications]


@router.put("/{notification_id}", response_model=NotificationResponse)
async def update_notification(
    notification_id: int,
    update_data: NotificationUpdate,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Update an existing notification
    """
    notification = await NotificationService.update_notification(db, notification_id, update_data)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationResponse.from_orm(notification)


@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Mark a notification as read
    """
    notification = await NotificationService.mark_notification_as_read(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    return NotificationResponse.from_orm(notification)


@router.post("/{notification_id}/send")
async def send_notification(
    notification_id: int,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Send a notification immediately
    """
    success = await NotificationService.send_notification(db, notification_id)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to send notification")
    return {"message": "Notification sent successfully"}


@router.post("/reminders", response_model=List[NotificationResponse])
async def create_reminder(
    reminder_data: ReminderCreate,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Create reminder notifications
    """
    notifications = await NotificationService.create_reminder(db, reminder_data)
    return [NotificationResponse.from_orm(notification) for notification in notifications]


@router.post("/bulk", response_model=List[NotificationResponse])
async def send_bulk_notification(
    bulk_request: BulkNotificationRequest,
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Send notifications to multiple students
    """
    notifications = await NotificationService.send_bulk_notification(db, bulk_request)
    return [NotificationResponse.from_orm(notification) for notification in notifications]


@router.get("/pending/", response_model=List[NotificationResponse])
async def get_pending_notifications(
    db: AsyncSession = Depends(get_postgres_session)
):
    """
    Get all pending notifications ready to be sent
    """
    notifications = await NotificationService.get_pending_notifications(db)
    return [NotificationResponse.from_orm(notification) for notification in notifications]
