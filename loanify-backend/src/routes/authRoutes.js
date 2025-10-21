const express = require('express');
const { auth, db } = require('../../config/firebase');
const logger = require('../utils/logger');

const router = express.Router();

// Create user profile after Firebase Auth registration
router.post('/create-profile', async (req, res) => {
  try {
    const { uid, email, displayName, role = 'customer' } = req.body;
    
    // Verify the user exists in Firebase Auth
    const userRecord = await auth.getUser(uid);
    
    // Create user profile in Firestore
    const userProfile = {
      uid,
      email: userRecord.email,
      displayName: displayName || userRecord.displayName,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };
    
    await db.collection('users').doc(uid).set(userProfile);
    
    logger.info('User profile created', { uid, email, role });
    
    res.status(201).json({
      success: true,
      message: 'User profile created successfully',
      data: userProfile
    });
    
  } catch (error) {
    logger.error('Create profile failed', { error: error.message });
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    
    const doc = await db.collection('users').doc(uid).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
    
    res.json({
      success: true,
      data: doc.data()
    });
    
  } catch (error) {
    logger.error('Get profile failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user role (admin only)
router.put('/update-role', async (req, res) => {
  try {
    const { uid, role } = req.body;
    
    if (!['customer', 'loan_officer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    await db.collection('users').doc(uid).update({
      role,
      updatedAt: new Date().toISOString()
    });
    
    // Set custom claims in Firebase Auth
    await auth.setCustomUserClaims(uid, { role });
    
    logger.info('User role updated', { uid, role });
    
    res.json({
      success: true,
      message: 'User role updated successfully'
    });
    
  } catch (error) {
    logger.error('Update role failed', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;