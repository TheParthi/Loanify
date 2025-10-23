# Backend & Database Testing Guide

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
# Frontend dependencies (already installed)
npm install

# Backend dependencies
cd loanify-backend
npm install
cd ..

# Install axios for testing scripts
npm install axios
```

### 2. Configure Firebase
Edit `loanify-backend/.env` with your Firebase credentials:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
```

### 3. Start Services
```bash
# Terminal 1: Start Backend
cd loanify-backend
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

## 🧪 Testing Commands

### Test Backend Health & Database
```bash
node test-backend.js
```

### Inspect Database Data
```bash
# View existing data
node inspect-database.js

# Add sample data and view
node inspect-database.js --add-sample
```

### Test API Endpoints
```bash
node test-api.js
```

## 🔍 Manual Database Verification

### Option 1: Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database
4. Check collections:
   - `loan_applications` - Loan application data
   - `users` - User authentication data

### Option 2: Admin Panel
1. Start both frontend and backend
2. Go to `http://localhost:3000/admin`
3. Login with admin credentials
4. View dashboard statistics

### Option 3: API Testing
```bash
# Test with curl
curl http://localhost:3001/health

# Test admin dashboard (requires auth)
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:3001/api/loans/admin/dashboard
```

## 📊 Database Schema

### loan_applications Collection
```javascript
{
  applicationId: "LA1234567890",
  applicantName: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  panNumber: "encrypted_pan",
  aadhaarNumber: "encrypted_aadhaar",
  monthlyIncome: 50000,
  employmentType: "salaried",
  loanAmount: 500000,
  loanPurpose: "home",
  status: "pending",
  createdAt: "2024-01-01T00:00:00.000Z",
  evaluation: {
    loan_eligibility_score: 85,
    approval_status: "Approved",
    rbi_compliance: true
  }
}
```

## 🔧 Troubleshooting

### Backend Not Starting
- Check if port 3001 is available
- Verify Firebase credentials in `.env`
- Check logs: `cd loanify-backend && npm run dev`

### Database Connection Issues
- Verify Firebase project ID
- Check private key format (must include newlines)
- Ensure service account has Firestore permissions

### Frontend API Calls Failing
- Verify backend is running on port 3001
- Check CORS configuration in backend
- Verify API endpoints in `src/lib/api.ts`

## 📝 API Endpoints

### Public Endpoints
- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Protected Endpoints (Require JWT)
- `POST /api/loans/apply` - Submit loan application
- `GET /api/loans/status/:id` - Get application status
- `GET /api/loans/my-applications` - User's applications

### Admin Endpoints (Require Admin Role)
- `GET /api/loans/admin/dashboard` - Admin dashboard data

## 🎯 Testing Checklist

- [ ] Backend starts without errors
- [ ] Frontend connects to backend
- [ ] Firebase configuration is correct
- [ ] Database collections are accessible
- [ ] API endpoints respond correctly
- [ ] Authentication works
- [ ] Data is stored and retrieved properly
- [ ] Admin dashboard shows statistics

## 📞 Support

If you encounter issues:
1. Check the console logs for errors
2. Verify all environment variables are set
3. Ensure Firebase project permissions are correct
4. Test with the provided scripts first