CREATE TABLE IF NOT EXISTS applicants (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    loan_type VARCHAR(100) NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    loan_tenure INTEGER NOT NULL,
    credit_score INTEGER NOT NULL,
    income_to_emi_ratio DECIMAL(5,2) NOT NULL,
    branch VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    application_date DATE NOT NULL,
    eligibility_score INTEGER NOT NULL
);