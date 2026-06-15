from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class KYCCreate(BaseModel):
    customer_name: str
    pan_number: str
    aadhaar_number: str

class KYCResponse(BaseModel):
    id: int
    customer_name: str
    pan_number: str
    aadhaar_number: str
    status: str
    risk_score: str
    pan_image: Optional[str] = None      
    aadhaar_image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewRequest(BaseModel):
    reviewed_by: str

class AuditLogResponse(BaseModel):
    id: int
    application_id: int
    action_performed: str
    reviewed_by: str
    timestamp: datetime

    class Config:
        from_attributes = True