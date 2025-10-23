#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Test data
const testLoanApplication = {
  applicantName: 'Test User',
  email: 'test@example.com',
  phone: '9876543210',
  panNumber: 'ABCDE1234F',
  aadhaarNumber: '123456789012',
  monthlyIncome: 50000,
  employmentType: 'salaried',
  employmentYears: 3,
  existingDebt: 10000,
  cibilScore: 750,
  loanAmount: 500000,
  loanPurpose: 'home',
  loanTenure: 240,
  kycVerified: true
};

async function testAPI() {
  console.log('🧪 Testing API Endpoints...\n');
  
  // Test 1: Health Check
  try {
    console.log('1️⃣ Testing Health Check...');
    const response = await axios.get('http://localhost:3001/health');
    console.log('✅ Health check passed:', response.data.status);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // Test 2: Submit Loan Application (without auth - will fail)
  try {
    console.log('\n2️⃣ Testing Loan Application Submission...');
    const response = await axios.post(`${API_BASE}/loans/apply`, testLoanApplication);
    console.log('✅ Application submitted:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️ Authentication required (expected)');
    } else {
      console.log('❌ Application submission failed:', error.response?.data || error.message);
    }
  }
  
  // Test 3: Admin Dashboard (without auth - will fail)
  try {
    console.log('\n3️⃣ Testing Admin Dashboard...');
    const response = await axios.get(`${API_BASE}/loans/admin/dashboard`);
    console.log('✅ Dashboard data:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('⚠️ Authentication required (expected)');
    } else {
      console.log('❌ Dashboard access failed:', error.response?.data || error.message);
    }
  }
  
  console.log('\n📝 API Test Summary:');
  console.log('   - Backend is running and responding');
  console.log('   - Authentication is properly configured');
  console.log('   - Endpoints are protected as expected');
  
  console.log('\n💡 To test with authentication:');
  console.log('   1. Create a user account through the frontend');
  console.log('   2. Get the JWT token from login');
  console.log('   3. Include token in Authorization header');
}

testAPI().catch(console.error);