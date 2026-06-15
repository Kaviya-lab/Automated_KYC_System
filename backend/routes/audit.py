from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database import get_db
from schemas import AuditLogResponse
from crud import get_audit_logs
from typing import List
import io, csv

router = APIRouter(prefix="/api/audit", tags=["Audit"])

@router.get("/logs", response_model=List[AuditLogResponse])
def logs(db: Session = Depends(get_db)):
    return get_audit_logs(db)

@router.get("/export-csv")
def export_csv(db: Session = Depends(get_db)):
    logs = get_audit_logs(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Application ID", "Action", "Reviewed By", "Timestamp"])
    for log in logs:
        writer.writerow([log.id, log.application_id, log.action_performed, log.reviewed_by, log.timestamp])
    output.seek(0)
    return StreamingResponse(output, media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=audit_logs.csv"})