from sqlalchemy.orm import Session
from models import Applicant, AgentLog, StatusEnum, Document
from datetime import datetime
import time
import json
from typing import Dict, Any

class BaseAgent:
    def __init__(self, db: Session):
        self.db = db
        self.agent_name = self.__class__.__name__
    
    def log_action(self, applicant_id: str, action: str, result: Dict[Any, Any], execution_time: float = 0.0):
        log = AgentLog(
            applicant_id=applicant_id,
            agent_name=self.agent_name,
            action=action,
            result=json.dumps(result),
            execution_time=execution_time
        )
        self.db.add(log)
        self.db.commit()

class MasterAgent(BaseAgent):
    def __init__(self, db: Session):
        super().__init__(db)
        self.verification_agent = VerificationAgent(db)
        self.underwriting_agent = UnderwritingAgent(db)
        self.sanction_agent = SanctionAgent(db)
        self.rejection_agent = RejectionAgent(db)
    
    def orchestrate_evaluation(self, applicant_id: str) -> Dict[str, Any]:
        start_time = time.time()
        
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        if not applicant:
            raise ValueError(f"Applicant {applicant_id} not found")
        
        try:
            # Step 1: Verification
            verification_result = self.verification_agent.verify_kyc(applicant_id)
            if not verification_result["success"]:
                applicant.status = StatusEnum.REJECTED
                applicant.reason_summary = verification_result["reason"]
                self.db.commit()
                
                execution_time = time.time() - start_time
                self.log_action(applicant_id, "orchestrate_evaluation", {
                    "status": "rejected",
                    "stage": "verification",
                    "reason": verification_result["reason"]
                }, execution_time)
                
                return {
                    "status": "rejected",
                    "reason": verification_result["reason"],
                    "stage": "verification"
                }
            
            # Step 2: Underwriting
            underwriting_result = self.underwriting_agent.evaluate_eligibility(applicant_id)
            
            # Step 3: Decision Processing
            if underwriting_result["status"] == "approved":
                sanction_result = self.sanction_agent.generate_sanction_letter(applicant_id)
                result = {
                    "status": "approved",
                    "eligibility_score": underwriting_result["eligibility_score"],
                    "sanction_letter_url": sanction_result.get("letter_url"),
                    "stage": "completed"
                }
            else:
                rejection_result = self.rejection_agent.generate_rejection_report(applicant_id)
                result = {
                    "status": "rejected",
                    "eligibility_score": underwriting_result["eligibility_score"],
                    "reason": underwriting_result["reason"],
                    "rejection_report_url": rejection_result.get("report_url"),
                    "stage": "completed"
                }
            
            execution_time = time.time() - start_time
            self.log_action(applicant_id, "orchestrate_evaluation", result, execution_time)
            
            return result
            
        except Exception as e:
            execution_time = time.time() - start_time
            error_result = {
                "status": "error",
                "reason": str(e),
                "stage": "processing"
            }
            self.log_action(applicant_id, "orchestrate_evaluation", error_result, execution_time)
            raise

class VerificationAgent(BaseAgent):
    def verify_kyc(self, applicant_id: str) -> Dict[str, Any]:
        start_time = time.time()
        
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        
        # KYC Verification Logic
        verification_checks = {
            "name_valid": bool(applicant.name and len(applicant.name.strip()) > 2),
            "income_valid": applicant.income > 0,
            "phone_valid": bool(applicant.phone and len(applicant.phone) >= 10),
            "email_valid": bool(applicant.email and "@" in applicant.email)
        }
        
        success = all(verification_checks.values())
        reason = "KYC verification passed" if success else f"Failed checks: {[k for k, v in verification_checks.items() if not v]}"
        
        result = {
            "success": success,
            "reason": reason,
            "checks": verification_checks
        }
        
        execution_time = time.time() - start_time
        self.log_action(applicant_id, "verify_kyc", result, execution_time)
        
        return result

class UnderwritingAgent(BaseAgent):
    def evaluate_eligibility(self, applicant_id: str) -> Dict[str, Any]:
        start_time = time.time()
        
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        
        # Advanced Underwriting Algorithm
        score_factors = self._calculate_score_factors(applicant)
        eligibility_score = sum(score_factors.values())
        eligibility_score = min(100, max(0, eligibility_score))
        
        # Decision Logic
        decision = self._make_decision(applicant, eligibility_score)
        
        # Update applicant record
        applicant.eligibility_score = eligibility_score
        applicant.status = StatusEnum.APPROVED if decision["approved"] else StatusEnum.REJECTED
        applicant.reason_summary = decision["reason"]
        self.db.commit()
        
        result = {
            "status": "approved" if decision["approved"] else "rejected",
            "eligibility_score": eligibility_score,
            "reason": decision["reason"],
            "score_factors": score_factors
        }
        
        execution_time = time.time() - start_time
        self.log_action(applicant_id, "evaluate_eligibility", result, execution_time)
        
        return result
    
    def _calculate_score_factors(self, applicant: Applicant) -> Dict[str, float]:
        factors = {}
        
        # Income Factor (0-25 points)
        if applicant.income >= 100000:
            factors["income"] = 25
        elif applicant.income >= 75000:
            factors["income"] = 20
        elif applicant.income >= 50000:
            factors["income"] = 15
        elif applicant.income >= 30000:
            factors["income"] = 10
        else:
            factors["income"] = 5
        
        # Credit Score Factor (0-35 points)
        if applicant.credit_score >= 800:
            factors["credit_score"] = 35
        elif applicant.credit_score >= 750:
            factors["credit_score"] = 30
        elif applicant.credit_score >= 700:
            factors["credit_score"] = 25
        elif applicant.credit_score >= 650:
            factors["credit_score"] = 15
        else:
            factors["credit_score"] = 5
        
        # Loan-to-Income Ratio (0-25 points)
        annual_income = applicant.income * 12
        lti_ratio = applicant.requested_amount / annual_income
        
        if lti_ratio <= 2:
            factors["lti_ratio"] = 25
        elif lti_ratio <= 3:
            factors["lti_ratio"] = 20
        elif lti_ratio <= 5:
            factors["lti_ratio"] = 15
        elif lti_ratio <= 8:
            factors["lti_ratio"] = 10
        else:
            factors["lti_ratio"] = 0
        
        # Employment Type Factor (0-15 points)
        if applicant.employment_type == "salaried":
            factors["employment"] = 15
        elif applicant.employment_type == "self_employed":
            factors["employment"] = 10
        else:
            factors["employment"] = 5
        
        return factors
    
    def _make_decision(self, applicant: Applicant, eligibility_score: float) -> Dict[str, Any]:
        # Decision thresholds
        if eligibility_score >= 75:
            return {
                "approved": True,
                "reason": f"Strong financial profile with {eligibility_score:.1f}% eligibility score"
            }
        elif eligibility_score >= 60:
            # Check additional criteria
            if applicant.credit_score >= 700 and applicant.income >= 50000:
                return {
                    "approved": True,
                    "reason": f"Approved with {eligibility_score:.1f}% score based on good credit and income"
                }
            else:
                return {
                    "approved": False,
                    "reason": f"Eligibility score {eligibility_score:.1f}% requires higher credit score or income"
                }
        else:
            return {
                "approved": False,
                "reason": f"Eligibility score {eligibility_score:.1f}% below minimum threshold"
            }

class SanctionAgent(BaseAgent):
    def generate_sanction_letter(self, applicant_id: str) -> Dict[str, Any]:
        start_time = time.time()
        
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        
        # Generate sanction letter content
        letter_content = self._create_sanction_letter_content(applicant)
        
        # In a real implementation, this would generate a PDF and upload to storage
        letter_url = f"/sanction_letters/{applicant_id}.pdf"
        
        result = {
            "letter_url": letter_url,
            "content": letter_content,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        execution_time = time.time() - start_time
        self.log_action(applicant_id, "generate_sanction_letter", result, execution_time)
        
        return result
    
    def _create_sanction_letter_content(self, applicant: Applicant) -> str:
        return f"""
LOAN SANCTION LETTER

Date: {datetime.now().strftime('%Y-%m-%d')}
Reference: {applicant.id}

Dear {applicant.name},

We are pleased to inform you that your loan application has been APPROVED.

Loan Details:
- Sanctioned Amount: ₹{applicant.requested_amount:,.2f}
- Interest Rate: 10.5% per annum
- Tenure: Up to 60 months
- Processing Fee: ₹{applicant.requested_amount * 0.01:,.2f}

This sanction is valid for 30 days from the date of issue.

Best Regards,
Loanify NBFC Limited
"""

class RejectionAgent(BaseAgent):
    def generate_rejection_report(self, applicant_id: str) -> Dict[str, Any]:
        start_time = time.time()
        
        applicant = self.db.query(Applicant).filter(Applicant.id == applicant_id).first()
        
        # Generate rejection report content
        report_content = self._create_rejection_report_content(applicant)
        
        # In a real implementation, this would generate a PDF and upload to storage
        report_url = f"/rejection_reports/{applicant_id}.pdf"
        
        result = {
            "report_url": report_url,
            "content": report_content,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        execution_time = time.time() - start_time
        self.log_action(applicant_id, "generate_rejection_report", result, execution_time)
        
        return result
    
    def _create_rejection_report_content(self, applicant: Applicant) -> str:
        return f"""
LOAN APPLICATION STATUS REPORT

Date: {datetime.now().strftime('%Y-%m-%d')}
Reference: {applicant.id}

Dear {applicant.name},

We regret to inform you that your loan application could not be approved at this time.

Application Details:
- Requested Amount: ₹{applicant.requested_amount:,.2f}
- Eligibility Score: {applicant.eligibility_score:.1f}%
- Reason: {applicant.reason_summary}

Recommendations for Future Applications:
1. Improve your credit score through timely payments
2. Consider applying for a lower loan amount
3. Increase your monthly income documentation

You may reapply after 3 months.

Best Regards,
Loanify NBFC Limited
"""