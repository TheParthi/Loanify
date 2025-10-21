const { auth } = require('../../config/firebase');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    const token = authHeader.substring(7);
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    
    logger.info('User authenticated', { uid: decodedToken.uid, email: decodedToken.email });
    next();
    
  } catch (error) {
    logger.error('Authentication failed', { error: error.message });
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const requireRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role || 'customer';
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
      
      next();
    } catch (error) {
      logger.error('Role check failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  };
};

const requireAdmin = requireRole(['admin']);
const requireLoanOfficer = requireRole(['admin', 'loan_officer']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireLoanOfficer
};