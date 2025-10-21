const { db } = require('../../config/firebase');
const { createLoanApplication } = require('../models/LoanApplication');
const aiEvaluationService = require('../services/aiEvaluationService');
const logger = require('../utils/logger');
const { encrypt, decrypt } = require('../utils/encryption');

class LoanController {
  
  async submitApplication(req, res) {
    try {
      const userId = req.user.uid;
      const applicationData = createLoanApplication(req.body);
      
      // Encrypt sensitive data
      const encryptedData = {
        ...applicationData,
        panNumber: encrypt(applicationData.panNumber),
        aadhaarNumber: encrypt(applicationData.aadhaarNumber),
        userId,
      };
      
      // Save to Firestore
      const docRef = await db.collection('loan_applications').add(encryptedData);
      
      // Trigger AI evaluation asynchronously
      this.processAIEvaluation(docRef.id, applicationData);
      
      logger.info('Loan application submitted', {
        applicationId: applicationData.applicationId,
        userId,
        loanAmount: applicationData.loanAmount
      });
      
      res.status(201).json({
        success: true,
        message: 'Loan application submitted successfully',
        applicationId: applicationData.applicationId,
        documentId: docRef.id,
        status: 'pending_evaluation'
      });
      
    } catch (error) {
      logger.error('Loan application submission failed', { error: error.message });
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async processAIEvaluation(documentId, applicationData) {
    try {
      // Validate RBI criteria first
      const rbiValidation = await aiEvaluationService.validateRBICriteria(applicationData);
      
      // Get AI evaluation
      const aiEvaluation = await aiEvaluationService.evaluateLoanApplication(applicationData);
      
      // Combine results
      const finalEvaluation = {
        ...aiEvaluation,
        rbi_compliance: rbiValidation,
        evaluated_at: new Date().toISOString(),
        evaluator: 'AI_SYSTEM'
      };
      
      // Update application with evaluation results
      await db.collection('loan_applications').doc(documentId).update({
        evaluation: finalEvaluation,
        status: this.determineApplicationStatus(aiEvaluation.approval_status),
        updatedAt: new Date().toISOString()
      });
      
      logger.info('AI evaluation completed', {
        documentId,
        score: aiEvaluation.loan_eligibility_score,
        decision: aiEvaluation.approval_status
      });
      
    } catch (error) {
      logger.error('AI evaluation failed', { documentId, error: error.message });
      
      // Update application with error status
      await db.collection('loan_applications').doc(documentId).update({
        status: 'evaluation_failed',
        error: error.message,
        updatedAt: new Date().toISOString()
      });
    }
  }

  determineApplicationStatus(aiDecision) {
    switch (aiDecision) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Needs Review':
        return 'under_review';
      default:
        return 'pending_evaluation';
    }
  }

  async getApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const userId = req.user.uid;
      
      const snapshot = await db.collection('loan_applications')
        .where('applicationId', '==', applicationId)
        .where('userId', '==', userId)
        .limit(1)
        .get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      
      const doc = snapshot.docs[0];
      const data = doc.data();
      
      // Decrypt sensitive data for response
      const responseData = {
        applicationId: data.applicationId,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        loanAmount: data.loanAmount,
        loanPurpose: data.loanPurpose,
        evaluation: data.evaluation || null
      };
      
      res.json({
        success: true,
        data: responseData
      });
      
    } catch (error) {
      logger.error('Get application status failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getUserApplications(req, res) {
    try {
      const userId = req.user.uid;
      const { page = 1, limit = 10 } = req.query;
      
      const snapshot = await db.collection('loan_applications')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(parseInt(limit))
        .offset((parseInt(page) - 1) * parseInt(limit))
        .get();
      
      const applications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          applicationId: data.applicationId,
          status: data.status,
          loanAmount: data.loanAmount,
          loanPurpose: data.loanPurpose,
          createdAt: data.createdAt,
          evaluation: data.evaluation ? {
            score: data.evaluation.loan_eligibility_score,
            status: data.evaluation.approval_status
          } : null
        };
      });
      
      res.json({
        success: true,
        data: applications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: applications.length
        }
      });
      
    } catch (error) {
      logger.error('Get user applications failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  async getAdminDashboard(req, res) {
    try {
      // Get application statistics
      const applicationsRef = db.collection('loan_applications');
      
      const [totalSnapshot, approvedSnapshot, rejectedSnapshot, pendingSnapshot] = await Promise.all([
        applicationsRef.get(),
        applicationsRef.where('status', '==', 'approved').get(),
        applicationsRef.where('status', '==', 'rejected').get(),
        applicationsRef.where('status', 'in', ['pending_evaluation', 'under_review']).get()
      ]);
      
      const total = totalSnapshot.size;
      const approved = approvedSnapshot.size;
      const rejected = rejectedSnapshot.size;
      const pending = pendingSnapshot.size;
      
      // Calculate average score
      let totalScore = 0;
      let scoredApplications = 0;
      
      totalSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.evaluation && data.evaluation.loan_eligibility_score) {
          totalScore += data.evaluation.loan_eligibility_score;
          scoredApplications++;
        }
      });
      
      const averageScore = scoredApplications > 0 ? (totalScore / scoredApplications).toFixed(1) : 0;
      
      res.json({
        success: true,
        data: {
          statistics: {
            total_applications: total,
            approved: approved,
            rejected: rejected,
            pending: pending,
            approval_rate: total > 0 ? ((approved / total) * 100).toFixed(1) : 0,
            average_score: averageScore
          },
          recent_applications: totalSnapshot.docs.slice(0, 5).map(doc => {
            const data = doc.data();
            return {
              applicationId: data.applicationId,
              applicantName: data.applicantName,
              loanAmount: data.loanAmount,
              status: data.status,
              createdAt: data.createdAt,
              score: data.evaluation?.loan_eligibility_score || null
            };
          })
        }
      });
      
    } catch (error) {
      logger.error('Get admin dashboard failed', { error: error.message });
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new LoanController();