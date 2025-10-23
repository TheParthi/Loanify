from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, Text, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid
import json
from typing import Optional, List
from enum import Enum as PyEnum

# FastAPI app
app = FastAPI(
    title="NBFC Loan Automation Backend",
    description="AI-driven loan evaluation system with agent orchestration",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup (SQLite as H2 alternative)
DATABASE_URL = "sqlite:///./nbfc_loan.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Security
SECRET_KEY = "nbfc-secret-key-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Enums
class StatusEnum(PyEnum):
    EVALUATING = "evaluating"
    APPROVED = "approved"
    REJECTED = "rejected"

class RoleEnum(PyEnum):
    ADMIN = "admin"
    OFFICER = "officer"
    UNDERWRITER = "underwriter"

# Database Models
class Applicant(Base):
    __tablename__ = "applicants"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    income = Column(Float, nullable=False)
    requested_amount = Column(Float, nullable=False)
    credit_score = Column(Integer, default=650)
    eligibility_score = Column(Float, default=0.0)
    status = Column(Enum(StatusEnum), default=StatusEnum.EVALUATING)
    reason_summary = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    documents = relationship("Document", back_populates="applicant")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"))
    type = Column(String, nullable=False)
    storage_url = Column(String)
    ocr_data = Column(Text)
    confidence = Column(Float, default=0.0)
    
    applicant = relationship("Applicant", back_populates="documents")

class User(Base):
    __tablename__ = "users"
    
    email = Column(String, primary_key=True)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.OFFICER)
    last_login = Column(DateTime)

# Pydantic Models
class EligibilityRequest(BaseModel):
    name: str
    income: float
    requested_amount: float
    credit_score: Optional[int] = 650

class EligibilityResponse(BaseModel):
    eligibility_score: float
    status: str
    reason_summary: str
    applicant_id: str

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ApplicantResponse(BaseModel):
    id: str
    name: str
    income: float
    requested_amount: float
    credit_score: int
    eligibility_score: float
    status: str
    reason_summary: Optional[str]
    created_at: datetime

class ReportsResponse(BaseModel):
    total_applicants: int
    approved: int
    rejected: int
    evaluating: int
    avg_credit_score: float
    avg_eligibility_score: float

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auth functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# AI Agent Services
class MasterAgent:
    def __init__(self, db: Session):
        self.db = db
        self.verification_agent = VerificationAgent(db)
        self.underwriting_agent = UnderwritingAgent(db)
    
    def evaluate(self, applicant_id: str):
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        if not applicant:
            raise HTTPException(status_code=404, detail="Applicant not found")
        
        # Step 1: Verification
        verified = self.verification_agent.verify(applicant_id)
        if not verified:
            applicant.status = StatusEnum.REJECTED
            applicant.reason_summary = "KYC verification failed"
            self.db.commit()
            return applicant
        
        # Step 2: Underwriting
        result = self.underwriting_agent.evaluate(applicant_id)
        return result

class VerificationAgent:
    def __init__(self, db: Session):
        self.db = db
    
    def verify(self, applicant_id: str) -> bool:
        # Simple verification logic
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        return applicant and applicant.name and applicant.income > 0

class UnderwritingAgent:
    def __init__(self, db: Session):
        self.db = db
    
    def evaluate(self, applicant_id: str):
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        
        # AI Decision Logic
        credit_score = applicant.credit_score
        income = applicant.income
        requested_amount = applicant.requested_amount
        
        # Calculate eligibility score
        score = 0
        income_ratio = requested_amount / (income * 12)
        
        if income_ratio <= 3:
            score += 40
        elif income_ratio <= 5:
            score += 30
        else:
            score += 10
        
        if credit_score >= 750:
            score += 35
        elif credit_score >= 700:
            score += 25
        elif credit_score >= 650:
            score += 15
        else:
            score += 5
        
        score += min(20, income / 10000)  # Income factor
        
        applicant.eligibility_score = min(100, score)
        
        # Decision logic
        if credit_score < 700:
            applicant.status = StatusEnum.REJECTED
            applicant.reason_summary = f"Credit score {credit_score} below minimum threshold"
        elif income_ratio > 8:
            applicant.status = StatusEnum.REJECTED
            applicant.reason_summary = "Requested amount too high relative to income"
        elif applicant.eligibility_score >= 70:
            applicant.status = StatusEnum.APPROVED
            applicant.reason_summary = "Application approved based on strong financial profile"
        else:
            applicant.status = StatusEnum.REJECTED
            applicant.reason_summary = f"Eligibility score {applicant.eligibility_score:.1f}% below approval threshold"
        
        self.db.commit()
        return applicant

# Initialize sample data
def init_sample_data(db: Session):
    # Create admin user
    admin_exists = db.query(User).filter(User.email == "admin@nbfc.com").first()
    if not admin_exists:
        admin_user = User(
            email="admin@nbfc.com",
            password=get_password_hash("admin123"),
            role=RoleEnum.ADMIN
        )
        db.add(admin_user)
    
    # Create sample applicants
    sample_applicants = [
        {"name": "Rajesh Kumar", "income": 75000, "requested_amount": 500000, "credit_score": 750},
        {"name": "Priya Sharma", "income": 45000, "requested_amount": 300000, "credit_score": 680},
        {"name": "Amit Patel", "income": 55000, "requested_amount": 800000, "credit_score": 620},
        {"name": "Sneha Reddy", "income": 65000, "requested_amount": 400000, "credit_score": 720},
        {"name": "Vikram Singh", "income": 85000, "requested_amount": 600000, "credit_score": 780},
    ]
    
    for data in sample_applicants:
        exists = db.query(Applicant).filter(Applicant.name == data["name"]).first()
        if not exists:
            applicant = Applicant(**data)
            db.add(applicant)
    
    db.commit()

# API Endpoints
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    init_sample_data(db)
    db.close()

@app.post("/public/check-eligibility", response_model=EligibilityResponse)
def check_eligibility(request: EligibilityRequest, db: Session = Depends(get_db)):
    """Public endpoint for instant eligibility check"""
    
    # Create applicant record
    applicant = Applicant(
        name=request.name,
        income=request.income,
        requested_amount=request.requested_amount,
        credit_score=request.credit_score
    )
    db.add(applicant)
    db.commit()
    db.refresh(applicant)
    
    # Run AI evaluation
    master_agent = MasterAgent(db)
    result = master_agent.evaluate(applicant.id)
    
    return EligibilityResponse(
        eligibility_score=result.eligibility_score,
        status=result.status.value,
        reason_summary=result.reason_summary or "",
        applicant_id=result.id
    )

@app.post("/admin/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Admin login with JWT token"""
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role.value}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/admin/applicants", response_model=List[ApplicantResponse])
def get_applicants(db: Session = Depends(get_db), current_user: str = Depends(verify_token)):
    """Get all applicants"""
    applicants = db.query(Applicant).all()
    return applicants

@app.get("/admin/applicant/{applicant_id}", response_model=ApplicantResponse)
def get_applicant(applicant_id: str, db: Session = Depends(get_db), current_user: str = Depends(verify_token)):
    """Get specific applicant details"""
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return applicant

@app.post("/admin/applicant/{applicant_id}/upload")
def upload_document(
    applicant_id: str, 
    file: UploadFile = File(...),
    doc_type: str = "salary_slip",
    db: Session = Depends(get_db), 
    current_user: str = Depends(verify_token)
):
    """Upload document for applicant"""
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    # Save document record
    document = Document(
        applicant_id=applicant_id,
        type=doc_type,
        storage_url=f"/uploads/{file.filename}",
        ocr_data=json.dumps({"filename": file.filename, "size": file.size}),
        confidence=0.95
    )
    db.add(document)
    db.commit()
    
    return {"message": "Document uploaded successfully", "document_id": document.id}

@app.post("/master/evaluate")
def master_evaluate(applicant_id: str, db: Session = Depends(get_db)):
    """Master Agent evaluation endpoint"""
    master_agent = MasterAgent(db)
    result = master_agent.evaluate(applicant_id)
    return {
        "applicant_id": result.id,
        "status": result.status.value,
        "eligibility_score": result.eligibility_score,
        "reason": result.reason_summary
    }

@app.get("/master/status/{applicant_id}")
def get_status(applicant_id: str, db: Session = Depends(get_db)):
    """Get evaluation status"""
    applicant = db.query(Applicant).filter(Applicant.id == applicant_id).first()
    if not applicant:
        raise HTTPException(status_code=404, detail="Applicant not found")
    
    return {
        "applicant_id": applicant.id,
        "status": applicant.status.value,
        "eligibility_score": applicant.eligibility_score,
        "reason": applicant.reason_summary
    }

@app.get("/admin/reports", response_model=ReportsResponse)
def get_reports(db: Session = Depends(get_db), current_user: str = Depends(verify_token)):
    """Get analytics and reports"""
    total = db.query(Applicant).count()
    approved = db.query(Applicant).filter(Applicant.status == StatusEnum.APPROVED).count()
    rejected = db.query(Applicant).filter(Applicant.status == StatusEnum.REJECTED).count()
    evaluating = db.query(Applicant).filter(Applicant.status == StatusEnum.EVALUATING).count()
    
    avg_credit = db.query(Applicant).with_entities(
        db.func.avg(Applicant.credit_score)
    ).scalar() or 0
    
    avg_eligibility = db.query(Applicant).with_entities(
        db.func.avg(Applicant.eligibility_score)
    ).scalar() or 0
    
    return ReportsResponse(
        total_applicants=total,
        approved=approved,
        rejected=rejected,
        evaluating=evaluating,
        avg_credit_score=round(avg_credit, 2),
        avg_eligibility_score=round(avg_eligibility, 2)
    )

@app.post("/webhook/decision")
def webhook_decision(applicant_id: str, status: str):
    """Webhook for bank system notifications"""
    return {
        "message": f"Decision notification sent for applicant {applicant_id}",
        "status": status,
        "timestamp": datetime.utcnow()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)