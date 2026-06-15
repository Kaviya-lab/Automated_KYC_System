from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class KYCApplication(Base):
    __tablename__ = "kyc_applications"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    pan_number = Column(String(20), nullable=False)
    aadhaar_number = Column(String(20), nullable=False)
    status = Column(String(20), default="PENDING")
    risk_score = Column(String(10), default="UNKNOWN")
    pan_image = Column(String(255), nullable=True)    
    aadhaar_image = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, nullable=False)
    action_performed = Column(String(200), nullable=False)
    reviewed_by = Column(String(100), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())