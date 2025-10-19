export type Applicant = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  loanType: 'Personal' | 'Home' | 'Auto';
  loanAmount: number;
  loanTenure: number;
  creditScore: number;
  incomeToEmiRatio: number;
  branch: 'New York' | 'London' | 'Tokyo';
  status: 'Pending' | 'Approved' | 'Rejected';
  applicationDate: string;
  eligibilityScore: number;
};
