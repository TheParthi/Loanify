export const LOAN_TYPES = {
  Personal: 'Personal',
  Education: 'Education',
  Home: 'Home',
  Vehicle: 'Vehicle',
  Business: 'Business',
} as const;

export type LoanType = keyof typeof LOAN_TYPES;

export const DOCUMENT_REQUIREMENTS: Record<LoanType, string[]> = {
  Personal: [
    'PAN Card',
    'Aadhaar Card',
    'Salary Slips (3 months)',
    'Bank Statements (6 months)',
    'Form 16 / ITR',
    'Employment Certificate',
  ],
  Education: [
    'PAN Card',
    'Aadhaar Card',
    'Admission Letter',
    'Fee Structure',
    'Academic Records',
    'Income Proof of Co-applicant',
    'Bank Statements (6 months)',
  ],
  Home: [
    'PAN Card',
    'Aadhaar Card',
    'Salary Slips (3 months)',
    'Bank Statements (12 months)',
    'Property Documents',
    'Sale Agreement',
    'NOC from Builder',
    'Property Valuation Report',
    'Form 16 / ITR (2 years)',
  ],
  Vehicle: [
    'PAN Card',
    'Aadhaar Card',
    'Salary Slips (3 months)',
    'Bank Statements (6 months)',
    'Vehicle Quotation',
    'Insurance Documents',
    'RC Book (for used vehicle)',
  ],
  Business: [
    'PAN Card',
    'Aadhaar Card',
    'Business Registration Certificate',
    'GST Registration',
    'ITR (3 years)',
    'Bank Statements (12 months)',
    'Financial Statements',
    'Business Plan',
    'Collateral Documents',
  ],
};