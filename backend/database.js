const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

class Database {
  constructor() {
    this.db = new sqlite3.Database(':memory:');
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Customers table
      this.db.run(`
        CREATE TABLE customers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE,
          phone TEXT,
          city TEXT,
          salary INTEGER,
          credit_score INTEGER DEFAULT 650,
          preapproved_limit INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Loan requests table
      this.db.run(`
        CREATE TABLE loan_requests (
          id TEXT PRIMARY KEY,
          customer_id TEXT,
          loan_type TEXT,
          requested_amount INTEGER,
          status TEXT DEFAULT 'pending',
          eligibility_score INTEGER,
          agent_decision TEXT,
          sanction_letter_url TEXT,
          rejection_reason TEXT,
          salary_slip_url TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers (id)
        )
      `);

      // Agent logs table
      this.db.run(`
        CREATE TABLE agent_logs (
          id TEXT PRIMARY KEY,
          loan_id TEXT,
          agent_name TEXT,
          action TEXT,
          result TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (loan_id) REFERENCES loan_requests (id)
        )
      `);

      // Insert sample data
      this.seedData();
    });
  }

  seedData() {
    const customers = [
      { id: uuidv4(), name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '9876543210', city: 'Mumbai', salary: 75000, credit_score: 750, preapproved_limit: 500000 },
      { id: uuidv4(), name: 'Priya Sharma', email: 'priya@email.com', phone: '9876543211', city: 'Delhi', salary: 45000, credit_score: 680, preapproved_limit: 300000 },
      { id: uuidv4(), name: 'Amit Patel', email: 'amit@email.com', phone: '9876543212', city: 'Bangalore', salary: 55000, credit_score: 620, preapproved_limit: 250000 }
    ];

    customers.forEach(customer => {
      this.db.run(`
        INSERT INTO customers (id, name, email, phone, city, salary, credit_score, preapproved_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [customer.id, customer.name, customer.email, customer.phone, customer.city, customer.salary, customer.credit_score, customer.preapproved_limit]);
    });
  }

  createCustomer(data) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      const preapprovedLimit = Math.floor(data.salary * 10); // 10x salary as preapproved limit
      const creditScore = Math.floor(Math.random() * 400) + 500; // Random score 500-900

      this.db.run(`
        INSERT INTO customers (id, name, email, phone, city, salary, credit_score, preapproved_limit)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, data.name, data.email, data.phone, data.city, data.salary, creditScore, preapprovedLimit], function(err) {
        if (err) reject(err);
        else resolve(id);
      });
    });
  }

  getCustomer(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  createLoanRequest(customerId, loanAmount, loanType) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this.db.run(`
        INSERT INTO loan_requests (id, customer_id, loan_type, requested_amount)
        VALUES (?, ?, ?, ?)
      `, [id, customerId, loanType, loanAmount], function(err) {
        if (err) reject(err);
        else resolve(id);
      });
    });
  }

  updateLoanRequest(id, updates) {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);

      this.db.run(`UPDATE loan_requests SET ${fields} WHERE id = ?`, values, function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  getLoanRequest(id) {
    return new Promise((resolve, reject) => {
      this.db.get(`
        SELECT lr.*, c.name, c.email, c.phone, c.salary, c.credit_score, c.preapproved_limit
        FROM loan_requests lr
        JOIN customers c ON lr.customer_id = c.id
        WHERE lr.id = ?
      `, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  getAllApplications() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT lr.*, c.name, c.email, c.phone, c.salary, c.credit_score, c.preapproved_limit
        FROM loan_requests lr
        JOIN customers c ON lr.customer_id = c.id
        ORDER BY lr.created_at DESC
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  logAgentAction(loanId, agentName, action, result) {
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      this.db.run(`
        INSERT INTO agent_logs (id, loan_id, agent_name, action, result)
        VALUES (?, ?, ?, ?, ?)
      `, [id, loanId, agentName, action, JSON.stringify(result)], function(err) {
        if (err) reject(err);
        else resolve(id);
      });
    });
  }

  updateLoanStatus(id, status, notes) {
    return new Promise((resolve, reject) => {
      this.db.run(`
        UPDATE loan_requests 
        SET status = ?, agent_decision = ?
        WHERE id = ?
      `, [status, notes, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }
}

module.exports = Database;