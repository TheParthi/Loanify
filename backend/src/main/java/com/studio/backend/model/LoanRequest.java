package com.studio.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_requests")
public class LoanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Column(name = "loan_type")
    private String loanType = "Personal";
    
    @Column(nullable = false)
    private String status = "PENDING";
    
    @Column(name = "eligibility_score")
    private Double eligibilityScore;
    
    @Column(name = "agent_decision")
    private String agentDecision;
    
    @Column(name = "sanction_letter_url")
    private String sanctionLetterUrl;
    
    @Column(name = "rejection_reason")
    private String rejectionReason;
    
    @Column(name = "current_agent")
    private String currentAgent = "Master Agent";
    
    @Column(name = "page_transition")
    private String pageTransition = "stay_chat";
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public LoanRequest() {}

    public LoanRequest(Long customerId, String loanType) {
        this.customerId = customerId;
        this.loanType = loanType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getEligibilityScore() { return eligibilityScore; }
    public void setEligibilityScore(Double eligibilityScore) { this.eligibilityScore = eligibilityScore; }

    public String getAgentDecision() { return agentDecision; }
    public void setAgentDecision(String agentDecision) { this.agentDecision = agentDecision; }

    public String getSanctionLetterUrl() { return sanctionLetterUrl; }
    public void setSanctionLetterUrl(String sanctionLetterUrl) { this.sanctionLetterUrl = sanctionLetterUrl; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getCurrentAgent() { return currentAgent; }
    public void setCurrentAgent(String currentAgent) { this.currentAgent = currentAgent; }

    public String getPageTransition() { return pageTransition; }
    public void setPageTransition(String pageTransition) { this.pageTransition = pageTransition; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}