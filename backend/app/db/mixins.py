from sqlalchemy import Column, DateTime
import datetime

class TimestampMixin:
    """
    Mixin adds created_at and updated_at columns to table.
    """
    created_at = Column(
        DateTime, 
        default=datetime.datetime.utcnow, 
        nullable=False
    )

    updated_at = Column(
        DateTime, 
        default=datetime.datetime.utcnow, 
        onupdate=datetime.datetime.utcnow, 
        nullable=False
    )
