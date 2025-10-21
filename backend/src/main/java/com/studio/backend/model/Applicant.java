package com.studio.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applicants")
public class Applicant {
    @Id
    private String id;
    private String name;
    private String avatar;
    private String email;
    private String loanType;
    private Long loanAmount;
    private Integer loanTenure;
    private Integer creditScore;
    private Double incomeToEmiRatio;
    private String branch;
    private String status;
    private String applicationDate;
    private Integer eligibilityScore;

    // Constructors
    public Applicant() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getLoanType() { return loanType; }
    public void setLoanType(String loanType) { this.loanType = loanType; }
    
    public Long getLoanAmount() { return loanAmount; }
    public void setLoanAmount(Long loanAmount) { this.loanAmount = loanAmount; }
    
    public Integer getLoanTenure() { return loanTenure; }
    public void setLoanTenure(Integer loanTenure) { this.loanTenure = loanTenure; }
    
    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }
    
    public Double getIncomeToEmiRatio() { return incomeToEmiRatio; }
    public void setIncomeToEmiRatio(Double incomeToEmiRatio) { this.incomeToEmiRatio = incomeToEmiRatio; }
    
    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getApplicationDate() { return applicationDate; }
    public void setApplicationDate(String applicationDate) { this.applicationDate = applicationDate; }
    
    public Integer getEligibilityScore() { return eligibilityScore; }
    public void setEligibilityScore(Integer eligibilityScore) { this.eligibilityScore = eligibilityScore; }
}