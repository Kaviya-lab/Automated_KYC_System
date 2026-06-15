from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from schemas import KYCCreate, KYCResponse, ReviewRequest
from crud import create_application, get_all_applications, review_application
from typing import List, Optional
import crud, io, csv
from fastapi.staticfiles import StaticFiles
import shutil, os
from auth import require_officer

router = APIRouter(prefix="/api/kyc", tags=["KYC"])

@router.post("/submit", response_model=KYCResponse)
def submit_kyc(data: KYCCreate, db: Session = Depends(get_db)):
    result, error = create_application(db, data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return result

@router.get("/applications", response_model=List[KYCResponse])
def get_applications(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_all_applications(db, status=status, search=search)

@router.put("/review/{app_id}", response_model=KYCResponse)
def review(
    app_id: int,
    data: ReviewRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(require_officer)   # ← add this
):
    result, error = review_application(db, app_id, data)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return result

@router.get("/statistics")
def statistics(db: Session = Depends(get_db)):
    from crud import get_statistics
    return get_statistics(db)

UPLOAD_DIR = "uploads"

@router.post("/upload/{app_id}")
async def upload_documents(
    app_id: int,
    pan_image: UploadFile = File(...),
    aadhaar_image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    app = db.query(__import__('models').KYCApplication).filter(
        __import__('models').KYCApplication.id == app_id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    pan_path = f"{UPLOAD_DIR}/pan_{app_id}_{pan_image.filename}"
    aadhaar_path = f"{UPLOAD_DIR}/aadhaar_{app_id}_{aadhaar_image.filename}"

    with open(pan_path, "wb") as f:
        shutil.copyfileobj(pan_image.file, f)
    with open(aadhaar_path, "wb") as f:
        shutil.copyfileobj(aadhaar_image.file, f)

    app.pan_image = pan_path
    app.aadhaar_image = aadhaar_path
    db.commit()
    db.refresh(app)

    return {"message": "Documents uploaded successfully", "pan_image": pan_path, "aadhaar_image": aadhaar_path}