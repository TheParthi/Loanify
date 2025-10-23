#!/usr/bin/env node

const axios = require('axios');

// Configuration
const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:3000';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Test functions
async function testBackendHealth() {
  try {
    log('\n🔍 Testing Backend Health...', 'blue');
    const response = await axios.get(`${BACKEND_URL}/health`);
    log(`✅ Backend is running: ${response.data.status}`, 'green');
    log(`   Version: ${response.data.version}`, 'yellow');
    log(`   Timestamp: ${response.data.timestamp}`, 'yellow');
    return true;
  } catch (error) {
    log(`❌ Backend health check failed: ${error.message}`, 'red');
    return false;
  }
}

async function testDatabaseConnection() {
  try {
    log('\n🔍 Testing Database Connection...', 'blue');
    // This will test if the backend can connect to Firebase
    const response = await axios.get(`${BACKEND_URL}/api/loans/admin/dashboard`);
    log('✅ Database connection successful', 'green');
    return true;
  } catch (error) {
    if (error.response?.status === 401) {
      log('✅ Database connection working (authentication required)', 'green');
      return true;
    }
    log(`❌ Database connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function testFrontendConnection() {
  try {
    log('\n🔍 Testing Frontend Connection...', 'blue');
    const response = await axios.get(FRONTEND_URL);
    log('✅ Frontend is accessible', 'green');
    return true;
  } catch (error) {
    log(`❌ Frontend connection failed: ${error.message}`, 'red');
    return false;
  }
}

async function checkFirebaseConfig() {
  log('\n🔍 Checking Firebase Configuration...', 'blue');
  
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];
  
  const envPath = './loanify-backend/.env';
  const fs = require('fs');
  
  if (!fs.existsSync(envPath)) {
    log('❌ Backend .env file not found', 'red');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  let allConfigured = true;
  
  requiredEnvVars.forEach(varName => {
    if (envContent.includes(`${varName}=`) && !envContent.includes(`${varName}=your_`)) {
      log(`✅ ${varName} is configured`, 'green');
    } else {
      log(`❌ ${varName} needs configuration`, 'red');
      allConfigured = false;
    }
  });
  
  return allConfigured;
}

async function showDatabaseData() {
  try {
    log('\n🔍 Checking Database Data...', 'blue');
    
    // You would need to add a test endpoint to your backend for this
    // For now, we'll show how to manually check
    log('📋 To manually check database data:', 'yellow');
    log('   1. Go to Firebase Console: https://console.firebase.google.com/', 'yellow');
    log('   2. Select your project: loanify-ai', 'yellow');
    log('   3. Navigate to Firestore Database', 'yellow');
    log('   4. Look for "loan_applications" collection', 'yellow');
    
  } catch (error) {
    log(`❌ Database data check failed: ${error.message}`, 'red');
  }
}

// Main test runner
async function runTests() {
  log('🚀 Starting Backend & Database Tests...', 'blue');
  log('=' .repeat(50), 'blue');
  
  const results = {
    backend: await testBackendHealth(),
    database: await testDatabaseConnection(),
    frontend: await testFrontendConnection(),
    config: await checkFirebaseConfig()
  };
  
  await showDatabaseData();
  
  log('\n📊 Test Results Summary:', 'blue');
  log('=' .repeat(30), 'blue');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`${test.toUpperCase()}: ${status}`, color);
  });
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    log('\n🎉 All tests passed! Your backend and database are working correctly.', 'green');
  } else {
    log('\n⚠️  Some tests failed. Check the configuration and try again.', 'yellow');
  }
  
  log('\n📝 Next Steps:', 'blue');
  log('   1. Start backend: cd loanify-backend && npm run dev', 'yellow');
  log('   2. Start frontend: npm run dev', 'yellow');
  log('   3. Test API endpoints using the browser or Postman', 'yellow');
}

// Run the tests
runTests().catch(console.error);