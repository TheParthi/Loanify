import { createWorker } from 'tesseract.js';

export interface DocumentAnalysis {
  documentType: string;
  extractedText: string;
  confidence: number;
  validationResults: ValidationResult[];
  rbiCompliance: boolean;
  issues: string[];
}

export interface ValidationResult {
  field: string;
  value: string;
  isValid: boolean;
  confidence: number;
  issue?: string;
}

export interface ProcessingResult {
  documentsAnalyzed: number;
  averageOcrAccuracy: number;
  rbiCompliance: boolean;
  creditScore: number;
  decision: 'APPROVED' | 'REJECTED' | 'PENDING';
  issues: string[];
  documentAnalyses: DocumentAnalysis[];
}

class DocumentAnalyzer {
  private worker: Tesseract.Worker | null = null;

  async initializeOCR() {
    if (!this.worker) {
      this.worker = await createWorker('eng');
    }
    return this.worker;
  }

  async analyzeDocument(file: File, documentType: string): Promise<DocumentAnalysis> {
    try {
      const worker = await this.initializeOCR();
      
      // Convert file to image data
      const imageData = await this.fileToImageData(file);
      
      // Perform OCR
      const { data } = await worker.recognize(imageData);
      const extractedText = data.text.trim();
      const confidence = data.confidence;

      // Validate document based on type
      const validationResults = this.validateDocument(extractedText, documentType);
      const rbiCompliance = this.checkRBICompliance(extractedText, documentType);
      const issues = this.identifyIssues(extractedText, documentType, validationResults);

      return {
        documentType,
        extractedText,
        confidence,
        validationResults,
        rbiCompliance,
        issues
      };
    } catch (error) {
      console.error('Document analysis failed:', error);
      return {
        documentType,
        extractedText: '',
        confidence: 0,
        validationResults: [],
        rbiCompliance: false,
        issues: ['Failed to analyze document - OCR processing error']
      };
    }
  }

  private async fileToImageData(file: File): Promise<string | File> {
    if (file.type.startsWith('image/')) {
      return file;
    } else if (file.type === 'application/pdf') {
      // For PDF files, we'd need a PDF to image converter
      // For now, return error for non-image files
      throw new Error('PDF processing not implemented - please upload image files');
    } else {
      throw new Error('Unsupported file type - please upload images or PDFs');
    }
  }

  private validateDocument(text: string, documentType: string): ValidationResult[] {
    const results: ValidationResult[] = [];
    const upperText = text.toUpperCase();

    switch (documentType) {
      case 'aadhar':
        // Validate Aadhar number pattern
        const aadharMatch = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/);
        results.push({
          field: 'Aadhar Number',
          value: aadharMatch ? aadharMatch[0] : 'Not found',
          isValid: !!aadharMatch,
          confidence: aadharMatch ? 90 : 0,
          issue: !aadharMatch ? 'Aadhar number not detected in document' : undefined
        });

        // Check for government of India text
        const govIndiaFound = upperText.includes('GOVERNMENT OF INDIA') || upperText.includes('GOVT OF INDIA');
        results.push({
          field: 'Government Header',
          value: govIndiaFound ? 'Found' : 'Not found',
          isValid: govIndiaFound,
          confidence: govIndiaFound ? 85 : 0,
          issue: !govIndiaFound ? 'Official government header not detected' : undefined
        });
        break;

      case 'pan':
        // Validate PAN number pattern
        const panMatch = text.match(/\b[A-Z]{5}\d{4}[A-Z]\b/);
        results.push({
          field: 'PAN Number',
          value: panMatch ? panMatch[0] : 'Not found',
          isValid: !!panMatch,
          confidence: panMatch ? 95 : 0,
          issue: !panMatch ? 'PAN number not detected in document' : undefined
        });

        // Check for Income Tax Department
        const itdFound = upperText.includes('INCOME TAX') || upperText.includes('TAX DEPARTMENT');
        results.push({
          field: 'Income Tax Header',
          value: itdFound ? 'Found' : 'Not found',
          isValid: itdFound,
          confidence: itdFound ? 80 : 0,
          issue: !itdFound ? 'Income Tax Department header not detected' : undefined
        });
        break;

      case 'salary':
        // Check for salary slip indicators
        const salaryIndicators = ['SALARY', 'PAY SLIP', 'PAYSLIP', 'BASIC PAY', 'GROSS SALARY'];
        const salaryFound = salaryIndicators.some(indicator => upperText.includes(indicator));
        results.push({
          field: 'Salary Document',
          value: salaryFound ? 'Detected' : 'Not detected',
          isValid: salaryFound,
          confidence: salaryFound ? 75 : 0,
          issue: !salaryFound ? 'Document does not appear to be a salary slip' : undefined
        });

        // Check for amount
        const amountMatch = text.match(/₹\s?[\d,]+\.?\d*/);
        results.push({
          field: 'Salary Amount',
          value: amountMatch ? amountMatch[0] : 'Not found',
          isValid: !!amountMatch,
          confidence: amountMatch ? 70 : 0,
          issue: !amountMatch ? 'Salary amount not clearly visible' : undefined
        });
        break;

      case 'bank':
        // Check for bank statement indicators
        const bankIndicators = ['BANK STATEMENT', 'ACCOUNT STATEMENT', 'STATEMENT OF ACCOUNT'];
        const bankFound = bankIndicators.some(indicator => upperText.includes(indicator));
        results.push({
          field: 'Bank Statement',
          value: bankFound ? 'Detected' : 'Not detected',
          isValid: bankFound,
          confidence: bankFound ? 80 : 0,
          issue: !bankFound ? 'Document does not appear to be a bank statement' : undefined
        });

        // Check for account number
        const accountMatch = text.match(/\b\d{9,18}\b/);
        results.push({
          field: 'Account Number',
          value: accountMatch ? accountMatch[0] : 'Not found',
          isValid: !!accountMatch,
          confidence: accountMatch ? 70 : 0,
          issue: !accountMatch ? 'Account number not clearly visible' : undefined
        });
        break;

      default:
        results.push({
          field: 'Document Type',
          value: 'Unknown',
          isValid: false,
          confidence: 0,
          issue: 'Document type not recognized for validation'
        });
    }

    return results;
  }

  private checkRBICompliance(text: string, documentType: string): boolean {
    // Basic RBI compliance checks
    const requiredElements = this.getRBIRequiredElements(documentType);
    const upperText = text.toUpperCase();
    
    return requiredElements.every(element => 
      upperText.includes(element.toUpperCase())
    );
  }

  private getRBIRequiredElements(documentType: string): string[] {
    switch (documentType) {
      case 'aadhar':
        return ['GOVERNMENT OF INDIA', 'UNIQUE IDENTIFICATION'];
      case 'pan':
        return ['INCOME TAX', 'PERMANENT ACCOUNT'];
      case 'bank':
        return ['BANK', 'STATEMENT'];
      default:
        return [];
    }
  }

  private identifyIssues(text: string, documentType: string, validationResults: ValidationResult[]): string[] {
    const issues: string[] = [];

    // Check OCR quality
    if (text.length < 50) {
      issues.push('Document text is too short - may indicate poor image quality');
    }

    // Check for validation failures
    const failedValidations = validationResults.filter(result => !result.isValid);
    failedValidations.forEach(validation => {
      if (validation.issue) {
        issues.push(validation.issue);
      }
    });

    // Check for common OCR issues
    const specialCharCount = (text.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (specialCharCount > text.length * 0.3) {
      issues.push('High number of special characters detected - may indicate OCR errors');
    }

    return issues;
  }

  async processDocuments(files: Array<{file: File, type: string}>): Promise<ProcessingResult> {
    const documentAnalyses: DocumentAnalysis[] = [];
    let totalConfidence = 0;
    let totalIssues: string[] = [];

    for (const {file, type} of files) {
      const analysis = await this.analyzeDocument(file, type);
      documentAnalyses.push(analysis);
      totalConfidence += analysis.confidence;
      totalIssues = [...totalIssues, ...analysis.issues];
    }

    const averageOcrAccuracy = files.length > 0 ? totalConfidence / files.length : 0;
    const rbiCompliance = documentAnalyses.every(analysis => analysis.rbiCompliance);
    
    // Calculate credit score based on document quality and compliance
    const creditScore = this.calculateCreditScore(documentAnalyses, averageOcrAccuracy, rbiCompliance);
    
    // Determine decision
    const decision = this.makeDecision(documentAnalyses, averageOcrAccuracy, rbiCompliance, totalIssues);

    return {
      documentsAnalyzed: files.length,
      averageOcrAccuracy: Math.round(averageOcrAccuracy),
      rbiCompliance,
      creditScore,
      decision,
      issues: [...new Set(totalIssues)], // Remove duplicates
      documentAnalyses
    };
  }

  private calculateCreditScore(analyses: DocumentAnalysis[], ocrAccuracy: number, rbiCompliance: boolean): number {
    let baseScore = 650; // Base credit score

    // Adjust based on OCR accuracy
    if (ocrAccuracy > 90) baseScore += 50;
    else if (ocrAccuracy > 80) baseScore += 30;
    else if (ocrAccuracy > 70) baseScore += 10;
    else baseScore -= 20;

    // Adjust based on RBI compliance
    if (rbiCompliance) baseScore += 30;
    else baseScore -= 50;

    // Adjust based on document validation
    const validDocuments = analyses.filter(analysis => 
      analysis.validationResults.every(result => result.isValid)
    ).length;
    
    const validationScore = (validDocuments / analyses.length) * 100;
    if (validationScore > 80) baseScore += 40;
    else if (validationScore > 60) baseScore += 20;
    else baseScore -= 30;

    // Ensure score is within realistic range
    return Math.max(300, Math.min(850, baseScore));
  }

  private makeDecision(analyses: DocumentAnalysis[], ocrAccuracy: number, rbiCompliance: boolean, issues: string[]): 'APPROVED' | 'REJECTED' | 'PENDING' {
    // Reject if major issues
    if (ocrAccuracy < 50 || !rbiCompliance) {
      return 'REJECTED';
    }

    // Approve if high quality
    if (ocrAccuracy > 85 && rbiCompliance && issues.length === 0) {
      return 'APPROVED';
    }

    // Check document validation success rate
    const totalValidations = analyses.reduce((sum, analysis) => sum + analysis.validationResults.length, 0);
    const successfulValidations = analyses.reduce((sum, analysis) => 
      sum + analysis.validationResults.filter(result => result.isValid).length, 0
    );

    const validationRate = totalValidations > 0 ? successfulValidations / totalValidations : 0;

    if (validationRate > 0.8 && ocrAccuracy > 75) {
      return 'APPROVED';
    } else if (validationRate > 0.6 && ocrAccuracy > 65) {
      return 'PENDING';
    } else {
      return 'REJECTED';
    }
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const documentAnalyzer = new DocumentAnalyzer();