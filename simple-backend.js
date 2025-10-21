const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
let applicants = [
  {
    id: 'APL-001',
    name: 'John Doe',
    avatar: '1',
    email: 'john.doe@example.com',
    loanType: 'Home',
    loanAmount: 250000,
    loanTenure: 240,
    creditScore: 780,
    incomeToEmiRatio: 0.35,
    branch: 'New York',
    status: 'Approved',
    applicationDate: '2023-10-15',
    eligibilityScore: 88
  },
  {
    id: 'APL-002',
    name: 'Jane Smith',
    avatar: '2',
    email: 'jane.smith@example.com',
    loanType: 'Personal',
    loanAmount: 20000,
    loanTenure: 36,
    creditScore: 650,
    incomeToEmiRatio: 0.5,
    branch: 'London',
    status: 'Rejected',
    applicationDate: '2023-10-12',
    eligibilityScore: 55
  },
  {
    id: 'APL-003',
    name: 'Samuel Green',
    avatar: '3',
    email: 'samuel.green@example.com',
    loanType: 'Auto',
    loanAmount: 35000,
    loanTenure: 60,
    creditScore: 710,
    incomeToEmiRatio: 0.4,
    branch: 'Tokyo',
    status: 'Pending',
    applicationDate: '2023-10-20',
    eligibilityScore: 72
  }
];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/applicants', (req, res) => {
  res.json(applicants);
});

app.get('/api/applicants/:id', (req, res) => {
  const applicant = applicants.find(a => a.id === req.params.id);
  if (!applicant) {
    return res.status(404).json({ error: 'Applicant not found' });
  }
  res.json(applicant);
});

app.post('/api/applicants', (req, res) => {
  const newApplicant = {
    id: `APL-${String(applicants.length + 1).padStart(3, '0')}`,
    ...req.body,
    applicationDate: new Date().toISOString().split('T')[0]
  };
  applicants.push(newApplicant);
  res.status(201).json(newApplicant);
});

app.put('/api/applicants/:id', (req, res) => {
  const index = applicants.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Applicant not found' });
  }
  applicants[index] = { ...applicants[index], ...req.body };
  res.json(applicants[index]);
});

app.delete('/api/applicants/:id', (req, res) => {
  const index = applicants.findIndex(a => a.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Applicant not found' });
  }
  applicants.splice(index, 1);
  res.status(204).send();
});

app.post('/api/eligibility', (req, res) => {
  const { creditScore, annualIncome, monthlyEmi, loanAmount, loanTenure } = req.body;
  
  // Simple eligibility calculation
  const debtToIncomeRatio = (monthlyEmi * 12) / annualIncome;
  const loanToIncomeRatio = loanAmount / annualIncome;
  
  let eligible = true;
  let score = 100;
  const issues = [];
  
  if (creditScore < 650) {
    eligible = false;
    score -= 30;
    issues.push('Credit score below minimum requirement (650)');
  }
  
  if (debtToIncomeRatio > 0.4) {
    eligible = false;
    score -= 25;
    issues.push('Debt-to-income ratio too high (>40%)');
  }
  
  if (loanToIncomeRatio > 5) {
    eligible = false;
    score -= 20;
    issues.push('Loan amount too high relative to income');
  }
  
  res.json({
    eligible,
    score: Math.max(0, score),
    creditScore,
    debtToIncomeRatio: Math.round(debtToIncomeRatio * 100),
    loanToIncomeRatio: Math.round(loanToIncomeRatio * 100) / 100,
    issues,
    recommendation: eligible ? 'Loan approved' : 'Loan requires review'
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoints: http://localhost:${PORT}/api/applicants`);
});