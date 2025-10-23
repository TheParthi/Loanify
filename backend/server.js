const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});