from sqlalchemy.orm import Session
from models import KYCApplication, AuditLog
from schemas import KYCCreate, ReviewRequest
from validators import validate_pan, validate_aadhaar, calculate_risk

def create_application(db: Session, data: KYCCreate):
    # Check for duplicate PAN
    existing = db.query(KYCApplication).filter(
        KYCApplication.pan_number == data.pan_number
    ).first()
    if existing:
        return None, "An application with this PAN number already exists"

    app = KYCApplication(
        customer_name=data.customer_name,
        pan_number=data.pan_number,
        aadhaar_number=data.aadhaar_number,
        status="PENDING"
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app, None

def get_all_applications(db: Session, status: str = None, search: str = None):
    query = db.query(KYCApplication)
    if status:
        query = query.filter(KYCApplication.status == status.upper())
    if search:
        query = query.filter(KYCApplication.customer_name.ilike(f"%{search}%"))
    return query.order_by(KYCApplication.created_at.desc()).all()

def review_application(db: Session, app_id: int, data: ReviewRequest):
    app = db.query(KYCApplication).filter(KYCApplication.id == app_id).first()
    if not app:
        return None, "Application not found"

    pan_valid = validate_pan(app.pan_number)
    aadhaar_valid = validate_aadhaar(app.aadhaar_number)
    risk = calculate_risk(pan_valid, aadhaar_valid)

    app.risk_score = risk

    if pan_valid and aadhaar_valid:
        app.status = "APPROVED"
        action = f"Application APPROVED — PAN valid, Aadhaar valid | Risk: {risk}"
    else:
        app.status = "REJECTED"
        reasons = []
        if not pan_valid:
            reasons.append("invalid PAN")
        if not aadhaar_valid:
            reasons.append("invalid Aadhaar")
        action = f"Application REJECTED — {', '.join(reasons)} | Risk: {risk}"

    log = AuditLog(
        application_id=app.id,
        action_performed=action,
        reviewed_by=data.reviewed_by
    )
    db.add(log)
    db.commit()
    db.refresh(app)
    return app, None

def get_audit_logs(db: Session):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()

def get_statistics(db: Session):
    total = db.query(KYCApplication).count()
    pending = db.query(KYCApplication).filter(KYCApplication.status == "PENDING").count()
    approved = db.query(KYCApplication).filter(KYCApplication.status == "APPROVED").count()
    rejected = db.query(KYCApplication).filter(KYCApplication.status == "REJECTED").count()
    return {
        "total": total,
        "pending": pending,
        "approved": approved,
        "rejected": rejected
    }