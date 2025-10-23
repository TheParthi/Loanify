#!/bin/bash
echo "🚀 Starting NBFC Loan Automation Backend..."
echo "📊 Swagger UI will be available at: http://localhost:8000/docs"
echo "🗄️ Database: SQLite (H2-like in-memory)"
echo "🔐 JWT Authentication enabled"
echo "🤖 AI Agents: Master, Verification, Underwriting"
echo ""

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload