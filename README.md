# KYC Audit System

A full-stack banking/customer onboarding simulation with automated validation, risk scoring, document uploads, JWT authentication, and an immutable audit trail.

---

## Features

- **KYC Submission** — Customers submit Name, PAN, Aadhaar + document images
- **Duplicate Prevention** — Rejects applications with an already existing PAN
- **Auto Validation** — PAN and Aadhaar validated using regex on review
- **Risk Scoring** — LOW / MEDIUM / HIGH risk assigned automatically
- **Officer Dashboard** — Search, filter, and review applications
- **Dashboard Statistics** — Live count of Total / Pending / Approved / Rejected
- **Immutable Audit Logs** — Every action recorded with officer name and timestamp
- **Export to CSV** — Download full audit history
- **JWT Authentication** — Login with roles (Admin / Officer)
- **Protected Routes** — Only logged-in officers can review applications
- **Document Upload** — PAN card and Aadhaar image upload per application

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + Axios |
| Backend | FastAPI + SQLAlchemy |
| Database | MySQL |
| Auth | JWT (python-jose) |
| Language | Python 3.13 + JavaScript |

---

## Project Structure

```
kyc-audit-system/
│
├── backend/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── kyc.py
│   │   └── audit.py
│   ├── uploads/          
│   ├── auth.py
│   ├── crud.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── validators.py
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Home.jsx
        │   ├── Dashboard.jsx
        │   └── AuditLogs.jsx
        ├── services/
        │   └── api.js
        ├── App.jsx
        └── main.jsx
```

---

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server + MySQL Workbench

---

### 1. Database Setup

Open MySQL Workbench and run:

```sql
CREATE DATABASE kyc_db;
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Update `database.py` with your MySQL credentials:

```python
DATABASE_URL = "mysql+pymysql://root:YOUR_PASSWORD@localhost/kyc_db"
```

Run the backend:

```bash
uvicorn main:app --reload
```

Swagger UI available at: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:5173`

---

## Login Credentials

| Role | Username | Password |
|---|---|---|
| Admin | admin | secret |
| Officer | officer | secret |

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/login` | Officer login | No |
| POST | `/api/kyc/submit` | Submit KYC application | No |
| GET | `/api/kyc/applications` | Get all applications | Yes |
| PUT | `/api/kyc/review/{id}` | Review application | Yes (Officer+) |
| GET | `/api/kyc/statistics` | Dashboard stats | Yes |
| POST | `/api/kyc/upload/{id}` | Upload documents | Yes |
| GET | `/api/audit/logs` | Get audit logs | Yes |
| GET | `/api/audit/export-csv` | Download audit CSV | Yes |

---

## Validation Rules

| Field | Rule | Example |
|---|---|---|
| PAN | 5 letters + 4 digits + 1 letter | `ABCDE1234F` |
| Aadhaar | Exactly 12 digits | `123456789012` |

---

## Risk Scoring

| Condition | Risk Level |
|---|---|
| Valid PAN + Valid Aadhaar | 🟢 LOW |
| Only one valid | 🟡 MEDIUM |
| Both invalid | 🔴 HIGH |

---

## Application Workflow

```
Customer submits KYC
        ↓
Duplicate PAN check
        ↓
Stored as PENDING in MySQL
        ↓
Officer logs in → Reviews application
        ↓
Validation Engine (PAN + Aadhaar)
        ↓
Risk Score assigned (LOW / MEDIUM / HIGH)
        ↓
Status → APPROVED or REJECTED
        ↓
Audit Log created automatically
        ↓
Audit History page / Export CSV
```

---

## Screenshots


| Page | Description |
|---|---|
| `<img width="1362" height="649" alt="{39ACC159-48A5-40BB-9234-B27BA0AFA47C}" src="https://github.com/user-attachments/assets/c1c1ece8-3f09-4ae3-819c-fa769319b9f5" />
` | Login page |
| `<img width="1350" height="627" alt="image" src="https://github.com/user-attachments/assets/7d13f24c-c0e4-401d-aeea-5a79c0c005cf" />
` | KYC submission form |
| `<img width="848" height="507" alt="image" src="https://github.com/user-attachments/assets/ca3c4ff1-271d-42d3-9e09-643d37c3e35b" />
` | Officer dashboard with stats |
| `<img width="856" height="396" alt="image" src="https://github.com/user-attachments/assets/4d246c25-afff-4fd7-a636-d3fac5467e9f" />
` | Audit logs table |

---

## Requirements

Generated via `pip freeze > requirements.txt`. Key packages:

```
fastapi
uvicorn
sqlalchemy
pymysql
pydantic
python-jose[cryptography]
passlib
python-multipart
pandas
```

---

## 👩‍💻 Built By

Kaviya — Full Stack KYC Audit System Project
