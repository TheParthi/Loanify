# NBFC Loan Automation Backend API

## 🚀 FastAPI Backend with AI Agent Orchestration

### 🔧 Tech Stack
- **Framework**: FastAPI (Python)
- **Database**: SQLite (H2-like in-memory)
- **Authentication**: JWT with bcrypt
- **Documentation**: Auto-generated Swagger UI
- **AI Agents**: Master, Verification, Underwriting, Sanction, Rejection

### 🗄️ Database Schema

**Applicants Table:**
```sql
- id (UUID, Primary Key)
- name (VARCHAR)
- income (DECIMAL) 
- requested_amount (DECIMAL)
- credit_score (INT)
- eligibility_score (DECIMAL)
- status (ENUM: evaluating/approved/rejected)
- reason_summary (TEXT)
- created_at (TIMESTAMP)
```

**Documents Table:**
```sql
- id (UUID, Primary Key)
- applicant_id (UUID, Foreign Key)
- type (ENUM: pan/aadhar/salary_slip/bank_statement)
- storage_url (VARCHAR)
- ocr_data (JSON)
- confidence (DECIMAL)
```

**Users Table:**
```sql
- email (VARCHAR, Primary Key)
- password (VARCHAR, hashed)
- role (ENUM: admin/officer/underwriter)
- last_login (TIMESTAMP)
```

### 📡 API Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/public/check-eligibility` | Public eligibility check | Public |
| POST | `/admin/login` | JWT authentication | Public |
| GET | `/admin/applicants` | List all applicants | Admin |
| GET | `/admin/applicant/{id}` | Get applicant details | Admin |
| POST | `/admin/applicant/{id}/upload` | Upload documents | Admin |
| POST | `/master/evaluate` | Master Agent evaluation | Internal |
| GET | `/master/status/{id}` | Get evaluation status | Admin |
| GET | `/admin/reports` | Analytics & reports | Admin |
| POST | `/webhook/decision` | Bank integration webhook | External |

### 🤖 AI Agent Architecture

**Master Agent:**
- Orchestrates entire evaluation workflow
- Calls worker agents sequentially
- Manages state transitions and error handling

**Verification Agent:**
- KYC validation and document verification
- Identity and contact information checks

**Underwriting Agent:**
- Advanced eligibility scoring algorithm
- Credit assessment and risk evaluation
- Decision logic with multiple factors

**Sanction Agent:**
- Generates approval letters and documents
- Calculates loan terms and conditions

**Rejection Agent:**
- Creates rejection reports with reasons
- Provides improvement recommendations

### 🎯 Scoring Algorithm

**Eligibility Score Calculation (0-100%):**
- **Income Factor (25%)**: Based on monthly income brackets
- **Credit Score (35%)**: CIBIL score assessment
- **Loan-to-Income Ratio (25%)**: Debt burden analysis
- **Employment Type (15%)**: Job stability factor

**Decision Thresholds:**
- **75%+**: Auto-approved
- **60-74%**: Conditional approval (good credit + income)
- **<60%**: Rejected

### 🚀 Getting Started

1. **Install Dependencies:**
```bash
pip install -r requirements.txt
```

2. **Start Server:**
```bash
./start.sh
# OR
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

3. **Access Swagger UI:**
```
http://localhost:8000/docs
```

4. **Default Admin Login:**
```
Email: admin@nbfc.com
Password: admin123
```

### 📊 Sample Data

The system auto-populates with:
- **5 Sample Applicants** with varying profiles
- **1 Admin User** for testing
- **Multiple Loan Products** with different terms

### 🔐 Security Features

- **JWT Authentication** with role-based access
- **Password Hashing** using bcrypt
- **Input Validation** with Pydantic models
- **CORS Protection** for cross-origin requests
- **Error Logging** with detailed audit trails

### 🧪 Testing the API

**1. Check Eligibility (Public):**
```bash
curl -X POST "http://localhost:8000/public/check-eligibility" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "income": 75000,
    "requested_amount": 500000,
    "credit_score": 750
  }'
```

**2. Admin Login:**
```bash
curl -X POST "http://localhost:8000/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@nbfc.com",
    "password": "admin123"
  }'
```

**3. Get Applicants (with JWT):**
```bash
curl -X GET "http://localhost:8000/admin/applicants" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 📈 Analytics & Reports

The `/admin/reports` endpoint provides:
- Total applications count
- Approval/rejection rates
- Average credit scores
- Average eligibility scores
- Performance metrics

### 🔄 Integration Hooks

**Webhook Endpoint** (`/webhook/decision`):
- Notifies external bank systems
- Sends real-time decision updates
- Supports custom integration workflows

### 🎨 Swagger Documentation

Auto-generated API documentation includes:
- **Request/Response schemas**
- **Authentication examples**
- **Error code definitions**
- **Interactive testing interface**

Access at: `http://localhost:8000/docs`

---

## 🎯 System Status

✅ **Database**: SQLite with comprehensive schema
✅ **Authentication**: JWT with role-based access
✅ **AI Agents**: Complete orchestration system
✅ **API Documentation**: Auto-generated Swagger UI
✅ **Security**: Input validation and error handling
✅ **Integration**: Webhook support for bank systems

The backend is production-ready with real AI decision-making and comprehensive API coverage!