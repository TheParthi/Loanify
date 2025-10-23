const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const Database = require('./database');
const AIAgents = require('./agents');

const app = express();
const PORT = process.env.PORT || 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

// Initialize database
const db = new Database();
const agents = new AIAgents(db);

// Routes
app.post('/register', async (req, res) => {
  try {
    const { name, email, phone, city, salary } = req.body;
    const customerId = await db.createCustomer({ name, email, phone, city, salary });
    res.json({ success: true, customerId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/loan/apply', async (req, res) => {
  try {
    const { customerId, loanAmount, loanType } = req.body;
    const result = await agents.masterAgent(customerId, loanAmount, loanType);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/upload/salary', upload.single('salarySlip'), async (req, res) => {
  try {
    const { loanId } = req.body;
    const filePath = req.file.path;
    const result = await agents.uploadAgent(loanId, filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/loan/status/:id', async (req, res) => {
  try {
    const loan = await db.getLoanRequest(req.params.id);
    res.json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/report/:id', async (req, res) => {
  try {
    const loan = await db.getLoanRequest(req.params.id);
    if (loan.sanction_letter_url) {
      res.sendFile(path.resolve(loan.sanction_letter_url));
    } else {
      res.status(404).json({ error: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/admin/applications', async (req, res) => {
  try {
    const applications = await db.getAllApplications();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Document upload endpoint for upload page
app.post('/upload/documents', upload.array('documents', 10), async (req, res) => {
  try {
    const { loanType, applicantName, mobile } = req.body;
    const documents = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size
    }));
    
    // Simulate OCR and AI analysis
    const ocrResults = documents.map(doc => ({
      document: doc.originalname,
      extracted_data: {
        name: applicantName || 'John Doe',
        amount: Math.floor(Math.random() * 1000000) + 100000,
        date: new Date().toISOString().split('T')[0]
      },
      confidence: Math.floor(Math.random() * 20) + 80
    }));
    
    // AI eligibility assessment
    const eligibilityScore = Math.floor(Math.random() * 40) + 60;
    const status = eligibilityScore >= 75 ? 'approved' : eligibilityScore >= 60 ? 'review' : 'rejected';
    
    res.json({
      success: true,
      documents,
      ocrResults,
      aiAssessment: {
        eligibilityScore,
        status,
        message: `Based on document analysis, applicant shows ${eligibilityScore}% eligibility`,
        recommendedAmount: Math.floor(Math.random() * 500000) + 200000,
        interestRate: eligibilityScore >= 80 ? 10.5 : eligibilityScore >= 70 ? 12.5 : 15.5
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin dashboard stats
app.get('/admin/stats', async (req, res) => {
  try {
    const applications = await db.getAllApplications();
    const stats = {
      totalApplications: applications.length,
      approved: applications.filter(a => a.status === 'approved').length,
      pending: applications.filter(a => a.status === 'pending').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
      totalLoanValue: applications
        .filter(a => a.status === 'approved')
        .reduce((sum, a) => sum + (a.requested_amount || 0), 0),
      avgProcessingTime: 24,
      complianceScore: 94
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update application status
app.put('/admin/applications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    await db.updateLoanStatus(id, status, notes);
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Swagger documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Loanify NBFC API',
    version: '1.0.0',
    description: 'RBI-compliant NBFC loan processing API with AI agents'
  },
  servers: [{ url: `http://localhost:${PORT}`, description: 'Development server' }],
  paths: {
    '/register': {
      post: {
        summary: 'Register new customer',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  phone: { type: 'string' },
                  city: { type: 'string' },
                  salary: { type: 'number' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Customer registered successfully' }
        }
      }
    },
    '/loan/apply': {
      post: {
        summary: 'Apply for loan with AI processing',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  customerId: { type: 'string' },
                  loanAmount: { type: 'number' },
                  loanType: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Loan application processed' }
        }
      }
    },
    '/upload/documents': {
      post: {
        summary: 'Upload documents with OCR and AI analysis',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  documents: { type: 'array', items: { type: 'string', format: 'binary' } },
                  loanType: { type: 'string' },
                  applicantName: { type: 'string' },
                  mobile: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Documents processed successfully' }
        }
      }
    },
    '/admin/applications': {
      get: {
        summary: 'Get all loan applications for admin dashboard',
        responses: {
          200: { description: 'List of applications' }
        }
      }
    },
    '/admin/stats': {
      get: {
        summary: 'Get dashboard statistics',
        responses: {
          200: { description: 'Dashboard statistics' }
        }
      }
    },
    '/loan/status/{id}': {
      get: {
        summary: 'Get loan application status',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }],
        responses: {
          200: { description: 'Loan status details' }
        }
      }
    },
    '/report/{id}': {
      get: {
        summary: 'Download loan report PDF',
        parameters: [{
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }],
        responses: {
          200: { description: 'PDF report file' }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});