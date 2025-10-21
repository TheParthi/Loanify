# Loanify Backend - AI-Powered Loan Approval System

A production-grade Node.js backend system for automated loan evaluation using Amazon Bedrock AI and Firebase integration.

## Features

- **AI-Powered Evaluation**: Amazon Bedrock (Claude) for intelligent loan assessment
- **RBI Compliance**: Built-in RBI loan approval criteria validation
- **Firebase Integration**: Authentication, Firestore database, and real-time updates
- **Security**: End-to-end encryption, audit logging, role-based access control
- **Scalable Architecture**: Ready for AWS Lambda or EC2 deployment

## Tech Stack

- **Backend**: Node.js + Express.js
- **AI**: Amazon Bedrock (Claude/Titan models)
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Security**: Helmet, CORS, data encryption
- **Logging**: Winston for audit trails

## API Endpoints

### Authentication
- `POST /api/auth/create-profile` - Create user profile
- `GET /api/auth/profile/:uid` - Get user profile
- `PUT /api/auth/update-role` - Update user role (admin only)

### Loan Management
- `POST /api/loans/apply` - Submit loan application
- `GET /api/loans/status/:applicationId` - Get application status
- `GET /api/loans/my-applications` - Get user's applications
- `GET /api/loans/admin/dashboard` - Admin dashboard data

## RBI Compliance Criteria

- Minimum CIBIL Score: 700
- Debt-to-Income Ratio: ≤ 40%
- Monthly Income ≥ ₹25,000
- KYC Documents Verified
- Employment stability ≥ 1 year
- Collateral valuation ≥ 75% (if applicable)

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`
4. Start development server: `npm run dev`
5. Start production server: `npm start`

## Environment Variables

```env
PORT=3001
NODE_ENV=development
FIREBASE_PROJECT_ID=your_project_id
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ENCRYPTION_KEY=your_32_character_key
```

## Deployment

### AWS Lambda
```bash
# Package for Lambda deployment
npm run build
zip -r loanify-backend.zip .
```

### AWS EC2
```bash
# Install PM2 for process management
npm install -g pm2
pm2 start src/server.js --name loanify-backend
pm2 startup
pm2 save
```

## Security Features

- JWT token validation with Firebase Auth
- AES-256-GCM encryption for sensitive data
- Role-based access control (Customer, Loan Officer, Admin)
- Request rate limiting and CORS protection
- Comprehensive audit logging
- HTTPS enforcement in production

## AI Evaluation Process

1. **Data Validation**: Validate application data against RBI criteria
2. **AI Analysis**: Send structured prompt to Amazon Bedrock
3. **Risk Assessment**: Calculate debt-to-income ratio and risk factors
4. **Decision Making**: Generate eligibility score (0-100) and approval status
5. **Audit Trail**: Log all decisions for compliance and review

## Monitoring & Logging

- Winston logger with structured JSON logging
- Error tracking and performance monitoring
- Audit trails for all AI decisions
- Health check endpoint for monitoring

## License

Private - Loanify Technologies Pvt Ltd