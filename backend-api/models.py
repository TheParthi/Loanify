from sqlalchemy import Column, String, Integer, Float, DateTime, Text, Enum, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum
import uuid

Base = declarative_base()

class StatusEnum(PyEnum):
    EVALUATING = "evaluating"
    APPROVED = "approved" 
    REJECTED = "rejected"
    PENDING_DOCUMENTS = "pending_documents"

class RoleEnum(PyEnum):
    ADMIN = "admin"
    OFFICER = "officer"
    UNDERWRITER = "underwriter"

class DocumentTypeEnum(PyEnum):
    PAN = "pan"
    AADHAR = "aadhar"
    SALARY_SLIP = "salary_slip"
    BANK_STATEMENT = "bank_statement"
    ITR = "itr"

class Applicant(Base):
    __tablename__ = "applicants"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String)
    phone = Column(String)
    income = Column(Float, nullable=False)
    requested_amount = Column(Float, nullable=False)
    credit_score = Column(Integer, default=650)
    eligibility_score = Column(Float, default=0.0)
    status = Column(Enum(StatusEnum), default=StatusEnum.EVALUATING)
    reason_summary = Column(Text)
    pre_approved_limit = Column(Float, default=0.0)
    employment_type = Column(String, default="salaried")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    documents = relationship("Document", back_populates="applicant", cascade="all, delete-orphan")
    agent_logs = relationship("AgentLog", back_populates="applicant", cascade="all, delete-orphan")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"), nullable=False)
    type = Column(Enum(DocumentTypeEnum), nullable=False)
    storage_url = Column(String)
    ocr_data = Column(Text)
    confidence = Column(Float, default=0.0)
    verified = Column(Boolean, default=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    applicant = relationship("Applicant", back_populates="documents")

class User(Base):
    __tablename__ = "users"
    
    email = Column(String, primary_key=True)
    password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.OFFICER)
    name = Column(String)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

class AgentLog(Base):
    __tablename__ = "agent_logs"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    applicant_id = Column(String, ForeignKey("applicants.id"), nullable=False)
    agent_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    result = Column(Text)
    execution_time = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    applicant = relationship("Applicant", back_populates="agent_logs")

class LoanProduct(Base):
    __tablename__ = "loan_products"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    min_amount = Column(Float, nullable=False)
    max_amount = Column(Float, nullable=False)
    min_tenure = Column(Integer, nullable=False)  # months
    max_tenure = Column(Integer, nullable=False)  # months
    interest_rate = Column(Float, nullable=False)
    processing_fee = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)