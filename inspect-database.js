#!/usr/bin/env node

require('dotenv').config({ path: './loanify-backend/.env' });
const { db } = require('./loanify-backend/config/firebase');

async function inspectDatabase() {
  console.log('🔍 Inspecting Firestore Database...\n');
  
  try {
    // Check loan_applications collection
    console.log('📋 Checking loan_applications collection:');
    const applicationsSnapshot = await db.collection('loan_applications').get();
    
    if (applicationsSnapshot.empty) {
      console.log('   ❌ No loan applications found in database');
    } else {
      console.log(`   ✅ Found ${applicationsSnapshot.size} loan applications`);
      
      // Show recent applications
      console.log('\n📊 Recent Applications:');
      applicationsSnapshot.docs.slice(0, 5).forEach((doc, index) => {
        const data = doc.data();
        console.log(`   ${index + 1}. ID: ${data.applicationId || 'N/A'}`);
        console.log(`      Name: ${data.applicantName || 'N/A'}`);
        console.log(`      Amount: ₹${data.loanAmount || 'N/A'}`);
        console.log(`      Status: ${data.status || 'N/A'}`);
        console.log(`      Created: ${data.createdAt || 'N/A'}`);
        console.log('      ---');
      });
    }
    
    // Check users collection (if exists)
    console.log('\n👥 Checking users collection:');
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('   ❌ No users found in database');
    } else {
      console.log(`   ✅ Found ${usersSnapshot.size} users`);
    }
    
    // Show collection statistics
    console.log('\n📈 Database Statistics:');
    const collections = await db.listCollections();
    console.log(`   Total Collections: ${collections.length}`);
    
    for (const collection of collections) {
      const snapshot = await collection.get();
      console.log(`   - ${collection.id}: ${snapshot.size} documents`);
    }
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error.message);
    
    if (error.message.includes('private_key')) {
      console.log('\n💡 Fix: Update Firebase credentials in loanify-backend/.env');
    }
    
    if (error.message.includes('project_id')) {
      console.log('\n💡 Fix: Set correct FIREBASE_PROJECT_ID in loanify-backend/.env');
    }
  }
}

// Add sample data function
async function addSampleData() {
  console.log('\n🔧 Adding sample loan application...');
  
  try {
    const sampleApplication = {
      applicationId: 'LA' + Date.now(),
      applicantName: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
      loanAmount: 500000,
      loanPurpose: 'home',
      monthlyIncome: 75000,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('loan_applications').add(sampleApplication);
    console.log(`✅ Sample application added with ID: ${docRef.id}`);
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error.message);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--add-sample')) {
    await addSampleData();
  }
  
  await inspectDatabase();
  
  console.log('\n📝 Commands:');
  console.log('   node inspect-database.js              - Inspect database');
  console.log('   node inspect-database.js --add-sample - Add sample data');
}

main().catch(console.error);