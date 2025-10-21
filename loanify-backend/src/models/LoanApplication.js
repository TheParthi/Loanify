const Joi = require('joi');

const loanApplicationSchema = Joi.object({
  applicantName: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[6-9]\d{9}$/).required(),
  panNumber: Joi.string().pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).required(),
  aadhaarNumber: Joi.string().pattern(/^\d{12}$/).required(),
  
  // Financial Details
  monthlyIncome: Joi.number().min(25000).required(),
  employmentType: Joi.string().valid('salaried', 'self-employed', 'business').required(),
  employmentYears: Joi.number().min(1).required(),
  existingDebt: Joi.number().min(0).default(0),
  cibilScore: Joi.number().min(300).max(900).required(),
  
  // Loan Details
  loanAmount: Joi.number().min(50000).max(10000000).required(),
  loanPurpose: Joi.string().valid('home', 'personal', 'vehicle', 'education', 'business').required(),
  loanTenure: Joi.number().min(12).max(360).required(),
  
  // KYC Status
  kycVerified: Joi.boolean().default(false),
  
  // Collateral (optional)
  collateralValue: Joi.number().min(0).default(0),
  collateralType: Joi.string().allow('').default(''),
});

const createLoanApplication = (data) => {
  const { error, value } = loanApplicationSchema.validate(data);
  if (error) {
    throw new Error(`Validation error: ${error.details[0].message}`);
  }
  
  return {
    ...value,
    applicationId: generateApplicationId(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const generateApplicationId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `LA${timestamp}${random}`.toUpperCase();
};

module.exports = {
  loanApplicationSchema,
  createLoanApplication,
  generateApplicationId,
};