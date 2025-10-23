package com.studio.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String phone;
    
    private String city;
    
    @Column(nullable = false)
    private Double salary;
    
    @Column(name = "requested_loan_amount")
    private Double requestedLoanAmount;
    
    @Column(name = "credit_score")
    private Integer creditScore;
    
    @Column(name = "preapproved_limit")
    private Double preapprovedLimit;
    
    @Column(name = "uploaded_docs")
    private String uploadedDocs;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Constructors
    public Customer() {}

    public Customer(String name, String email, String phone, String city, Double salary) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.city = city;
        this.salary = salary;
        this.preapprovedLimit = salary * 5; // Default 5x salary
        this.creditScore = generateCreditScore();
    }

    private Integer generateCreditScore() {
        return (int) (Math.random() * 400) + 500; // 500-900 range
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public Double getRequestedLoanAmount() { return requestedLoanAmount; }
    public void setRequestedLoanAmount(Double requestedLoanAmount) { this.requestedLoanAmount = requestedLoanAmount; }

    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }

    public Double getPreapprovedLimit() { return preapprovedLimit; }
    public void setPreapprovedLimit(Double preapprovedLimit) { this.preapprovedLimit = preapprovedLimit; }

    public String getUploadedDocs() { return uploadedDocs; }
    public void setUploadedDocs(String uploadedDocs) { this.uploadedDocs = uploadedDocs; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}