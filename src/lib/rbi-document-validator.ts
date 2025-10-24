import { createWorker } from 'tesseract.js';

// RBI Guidelines for Document Validation
export interface RBIValidationRules {
  aadhar: {
    patterns: RegExp[];
    keywords: string[];
    mandatoryFields: string[];
    format: string;
  };
  pan: {
    patterns: RegExp[];
    keywords: string[];
    mandatoryFields: string[];
    format: string;
  };
  salary: {
    patterns: RegExp[];
    keywords: string[];
    mandatoryFields: string[];
    minAmount: number;
  };
  bank: {
    patterns: RegExp[];
    keywords: string[];
    mandatoryFields: string[];
    minBalance: number;
  };
}

export const RBI_VALIDATION_RULES: RBIValidationRules = {
  aadhar: {
    patterns: [
      /\b\d{4}\s?\d{4}\s?\d{4}\b/, // 12-digit Aadhar number
      /\b\d{12}\b/ // Continuous 12 digits
    ],
    keywords: [
      'GOVERNMENT OF INDIA',
      'UNIQUE IDENTIFICATION AUTHORITY',
      'AADHAAR',
      'AADHAR',
      'UID',
      'UNIQUE IDENTIFICATION'
    ],
    mandatoryFields: ['name', 'dob', 'gender', 'address'],
    format: 'XXXX XXXX XXXX'
  },
  pan: {
    patterns: [
      /\b[A-Z]{5}\d{4}[A-Z]\b/, // PAN format: ABCDE1234F
      /[A-Z]{3}P[A-Z]\d{4}[A-Z]/ // Specific PAN pattern
    ],
    keywords: [
      'INCOME TAX DEPARTMENT',
      'GOVERNMENT OF INDIA',
      'PERMANENT ACCOUNT NUMBER',
      'PAN',
      'TAX DEDUCTION'
    ],
    mandatoryFields: ['name', 'father_name', 'dob', 'pan_number'],
    format: 'ABCDE1234F'
  },
  salary: {
    patterns: [
      /₹\s?[\d,]+\.?\d*/, // Indian Rupee amounts
      /INR\s?[\d,]+\.?\d*/, // INR amounts
      /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\b/ // Number formats
    ],
    keywords: [
      'SALARY SLIP',
      'PAY SLIP',
      'PAYSLIP',
      'BASIC PAY',
      'GROSS SALARY',
      'NET PAY',
      'DEDUCTIONS',
      'ALLOWANCES',
      'EMPLOYEE',
      'EMPLOYER'
    ],
    mandatoryFields: ['employee_name', 'employee_id', 'basic_pay', 'gross_salary'],
    minAmount: 15000 // Minimum salary for loan eligibility
  },
  bank: {
    patterns: [
      /\b\d{9,18}\b/, // Account numbers
      /IFSC\s?:?\s?[A-Z]{4}0[A-Z0-9]{6}/, // IFSC codes
      /₹\s?[\d,]+\.?\d*/ // Balance amounts
    ],
    keywords: [
      'BANK STATEMENT',
      'ACCOUNT STATEMENT',
      'STATEMENT OF ACCOUNT',
      'CURRENT BALANCE',
      'AVAILABLE BALANCE',
      'TRANSACTION',
      'DEBIT',
      'CREDIT'
    ],
    mandatoryFields: ['account_number', 'ifsc', 'account_holder', 'balance'],
    minBalance: 10000 // Minimum balance requirement
  }
};

export class RBIDocumentValidator {
  private worker: Tesseract.Worker | null = null;

  async initializeOCR() {
    if (!this.worker) {
      this.worker = await createWorker('eng', 1, {
        logger: () => {} // Disable logging for performance
      });
    }
    return this.worker;
  }

  async validateDocumentType(file: File, expectedType: keyof RBIValidationRules): Promise<{
    isCorrectType: boolean;
    confidence: number;
    extractedText: string;
    detectedType: string | null;
    issues: string[];
  }> {
    try {
      const extractedText = await this.extractText(file);
      const detectedType = this.detectDocumentType(extractedText);
      
      const isCorrectType = detectedType === expectedType;
      const confidence = this.calculateTypeConfidence(extractedText, expectedType);
      
      const issues: string[] = [];
      if (!isCorrectType) {
        issues.push(`Document appears to be ${detectedType || 'unknown'} but uploaded as ${expectedType}`);
      }
      
      return {
        isCorrectType,
        confidence,
        extractedText,
        detectedType,
        issues
      };
    } catch (error) {
      console.error('Document processing error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        isCorrectType: false,
        confidence: 0,
        extractedText: '',
        detectedType: null,
        issues: [`Failed to process document: ${errorMessage}. Please ensure the file is a valid PDF or image.`]
      };
    }
  }

  private async extractText(file: File): Promise<string> {
    try {
      if (file.type === 'application/pdf') {
        return await this.extractPDFText(file);
      } else if (file.type.startsWith('image/')) {
        return await this.extractImageText(file);
      } else {
        throw new Error('Unsupported file type. Please upload PDF or image files only.');
      }
    } catch (error) {
      console.error('Text extraction error:', error);
      // Fallback to image processing for PDFs that fail
      if (file.type === 'application/pdf') {
        try {
          return await this.extractImageText(file);
        } catch (fallbackError) {
          throw new Error('Failed to process PDF. Please try converting to image format.');
        }
      }
      throw error;
    }
  }

  private async extractImageText(file: File): Promise<string> {
    const worker = await this.initializeOCR();
    
    // Optimize image for better OCR
    const optimizedImage = await this.optimizeImage(file);
    const { data } = await worker.recognize(optimizedImage);
    
    return data.text.toUpperCase();
  }

  private async extractPDFText(file: File): Promise<string> {
    try {
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configure PDF.js worker - use local worker to avoid CDN issues
      if (typeof window !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise;
      let fullText = '';
      
      // Process first 3 pages for comprehensive analysis
      const maxPages = Math.min(pdf.numPages, 3);
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + ' ';
      }
      
      return fullText.toUpperCase();
    } catch (pdfError) {
      console.error('PDF processing failed:', pdfError);
      throw new Error('PDF processing failed. Please ensure the file is not corrupted.');
    }
  }

  private async optimizeImage(file: File): Promise<HTMLCanvasElement> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Optimize size for better OCR performance
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);
        
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        // Apply image enhancements for better OCR
        ctx.filter = 'contrast(1.2) brightness(1.1)';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        resolve(canvas);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  private detectDocumentType(text: string): keyof RBIValidationRules | null {
    const scores = {
      aadhar: 0,
      pan: 0,
      salary: 0,
      bank: 0
    };

    // Score based on keywords and patterns
    Object.entries(RBI_VALIDATION_RULES).forEach(([type, rules]) => {
      // Keyword matching
      rules.keywords.forEach((keyword: string) => {
        if (text.includes(keyword)) {
          scores[type as keyof RBIValidationRules] += 10;
        }
      });

      // Pattern matching
      rules.patterns.forEach((pattern: RegExp) => {
        if (pattern.test(text)) {
          scores[type as keyof RBIValidationRules] += 15;
        }
      });
    });

    // Return type with highest score
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore < 10) return null; // Minimum threshold

    return Object.keys(scores).find(
      key => scores[key as keyof RBIValidationRules] === maxScore
    ) as keyof RBIValidationRules;
  }

  private calculateTypeConfidence(text: string, expectedType: keyof RBIValidationRules): number {
    const rules = RBI_VALIDATION_RULES[expectedType];
    let confidence = 0;
    let maxPossible = 0;

    // Check keywords
    rules.keywords.forEach(keyword => {
      maxPossible += 10;
      if (text.includes(keyword)) {
        confidence += 10;
      }
    });

    // Check patterns
    rules.patterns.forEach(pattern => {
      maxPossible += 15;
      if (pattern.test(text)) {
        confidence += 15;
      }
    });

    return maxPossible > 0 ? Math.round((confidence / maxPossible) * 100) : 0;
  }

  async performRBICompliantAnalysis(
    file: File, 
    expectedType: keyof RBIValidationRules
  ): Promise<{
    isValid: boolean;
    confidence: number;
    rbiCompliant: boolean;
    extractedData: Record<string, any>;
    validationResults: Array<{
      field: string;
      value: string;
      isValid: boolean;
      rbiRequirement: string;
    }>;
    issues: string[];
    recommendation: 'APPROVE' | 'REJECT' | 'MANUAL_REVIEW';
  }> {
    const typeValidation = await this.validateDocumentType(file, expectedType);
    
    if (!typeValidation.isCorrectType) {
      return {
        isValid: false,
        confidence: 0,
        rbiCompliant: false,
        extractedData: {},
        validationResults: [],
        issues: typeValidation.issues,
        recommendation: 'REJECT'
      };
    }

    const extractedData = this.extractStructuredData(typeValidation.extractedText, expectedType);
    const validationResults = this.validateRBIRequirements(extractedData, expectedType);
    
    const isValid = validationResults.every(result => result.isValid);
    const rbiCompliant = this.checkRBICompliance(extractedData, expectedType);
    
    const issues = [
      ...typeValidation.issues,
      ...validationResults.filter(r => !r.isValid).map(r => `${r.field}: ${r.rbiRequirement}`)
    ];

    const recommendation = this.makeRBIDecision(isValid, rbiCompliant, typeValidation.confidence, issues);

    return {
      isValid,
      confidence: typeValidation.confidence,
      rbiCompliant,
      extractedData,
      validationResults,
      issues,
      recommendation
    };
  }

  private extractStructuredData(text: string, type: keyof RBIValidationRules): Record<string, any> {
    const data: Record<string, any> = {};

    switch (type) {
      case 'aadhar':
        data.aadhar_number = text.match(/\b\d{4}\s?\d{4}\s?\d{4}\b/)?.[0] || null;
        data.name = this.extractName(text);
        data.dob = this.extractDOB(text);
        data.gender = this.extractGender(text);
        data.address = this.extractAddress(text);
        break;

      case 'pan':
        data.pan_number = text.match(/\b[A-Z]{5}\d{4}[A-Z]\b/)?.[0] || null;
        data.name = this.extractName(text);
        data.father_name = this.extractFatherName(text);
        data.dob = this.extractDOB(text);
        break;

      case 'salary':
        data.employee_name = this.extractName(text);
        data.employee_id = this.extractEmployeeId(text);
        data.basic_pay = this.extractBasicPay(text);
        data.gross_salary = this.extractGrossSalary(text);
        data.net_pay = this.extractNetPay(text);
        break;

      case 'bank':
        data.account_number = text.match(/\b\d{9,18}\b/)?.[0] || null;
        data.ifsc = text.match(/[A-Z]{4}0[A-Z0-9]{6}/)?.[0] || null;
        data.account_holder = this.extractName(text);
        data.balance = this.extractBalance(text);
        break;
    }

    return data;
  }

  private extractName(text: string): string | null {
    // Enhanced name extraction logic
    const namePatterns = [
      /NAME\s*:?\s*([A-Z\s]+)/,
      /MR\.?\s+([A-Z\s]+)/,
      /MS\.?\s+([A-Z\s]+)/,
      /([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)/
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].trim().length > 3) {
        return match[1].trim();
      }
    }
    return null;
  }

  private extractDOB(text: string): string | null {
    const dobPatterns = [
      /DOB\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
      /DATE OF BIRTH\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/,
      /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4})/
    ];

    for (const pattern of dobPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  private extractGender(text: string): string | null {
    if (text.includes('MALE') && !text.includes('FEMALE')) return 'MALE';
    if (text.includes('FEMALE')) return 'FEMALE';
    return null;
  }

  private extractAddress(text: string): string | null {
    const addressPattern = /ADDRESS\s*:?\s*([A-Z0-9\s,.-]+)/;
    const match = text.match(addressPattern);
    return match ? match[1].trim() : null;
  }

  private extractFatherName(text: string): string | null {
    const fatherPatterns = [
      /FATHER\s*:?\s*([A-Z\s]+)/,
      /S\/O\s+([A-Z\s]+)/,
      /SON OF\s+([A-Z\s]+)/
    ];

    for (const pattern of fatherPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  }

  private extractEmployeeId(text: string): string | null {
    const idPatterns = [
      /EMP\s*ID\s*:?\s*([A-Z0-9]+)/,
      /EMPLOYEE\s*ID\s*:?\s*([A-Z0-9]+)/,
      /ID\s*:?\s*([A-Z0-9]+)/
    ];

    for (const pattern of idPatterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  private extractBasicPay(text: string): number | null {
    const basicPayPattern = /BASIC\s*PAY\s*:?\s*₹?\s*([\d,]+)/;
    const match = text.match(basicPayPattern);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  private extractGrossSalary(text: string): number | null {
    const grossPattern = /GROSS\s*SALARY\s*:?\s*₹?\s*([\d,]+)/;
    const match = text.match(grossPattern);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  private extractNetPay(text: string): number | null {
    const netPattern = /NET\s*PAY\s*:?\s*₹?\s*([\d,]+)/;
    const match = text.match(netPattern);
    return match ? parseInt(match[1].replace(/,/g, '')) : null;
  }

  private extractBalance(text: string): number | null {
    const balancePatterns = [
      /BALANCE\s*:?\s*₹?\s*([\d,]+)/,
      /AVAILABLE\s*BALANCE\s*:?\s*₹?\s*([\d,]+)/,
      /CURRENT\s*BALANCE\s*:?\s*₹?\s*([\d,]+)/
    ];

    for (const pattern of balancePatterns) {
      const match = text.match(pattern);
      if (match) return parseInt(match[1].replace(/,/g, ''));
    }
    return null;
  }

  private validateRBIRequirements(data: Record<string, any>, type: keyof RBIValidationRules) {
    const rules = RBI_VALIDATION_RULES[type];
    const results = [];

    for (const field of rules.mandatoryFields) {
      const value = data[field];
      const isValid = value !== null && value !== undefined && value !== '';
      
      results.push({
        field,
        value: value?.toString() || 'Not found',
        isValid,
        rbiRequirement: `${field} is mandatory as per RBI guidelines`
      });
    }

    // Additional validations based on type
    if (type === 'salary' && data.basic_pay) {
      results.push({
        field: 'minimum_salary',
        value: data.basic_pay.toString(),
        isValid: data.basic_pay >= ('minAmount' in rules ? rules.minAmount : 0),
        rbiRequirement: `Minimum salary of ₹${'minAmount' in rules ? rules.minAmount : 0} required`
      });
    }

    if (type === 'bank' && data.balance) {
      results.push({
        field: 'minimum_balance',
        value: data.balance.toString(),
        isValid: data.balance >= ('minBalance' in rules ? rules.minBalance : 0),
        rbiRequirement: `Minimum balance of ₹${'minBalance' in rules ? rules.minBalance : 0} required`
      });
    }

    return results;
  }

  private checkRBICompliance(data: Record<string, any>, type: keyof RBIValidationRules): boolean {
    const rules = RBI_VALIDATION_RULES[type];
    
    // Check if all mandatory fields are present
    const hasMandatoryFields = rules.mandatoryFields.every(field => 
      data[field] !== null && data[field] !== undefined && data[field] !== ''
    );

    // Additional RBI compliance checks
    switch (type) {
      case 'aadhar':
        return hasMandatoryFields && data.aadhar_number?.length === 12;
      case 'pan':
        return hasMandatoryFields && /^[A-Z]{5}\d{4}[A-Z]$/.test(data.pan_number);
      case 'salary':
        return hasMandatoryFields && data.basic_pay >= ('minAmount' in rules ? rules.minAmount : 0);
      case 'bank':
        return hasMandatoryFields && data.balance >= ('minBalance' in rules ? rules.minBalance : 0);
      default:
        return hasMandatoryFields;
    }
  }

  private makeRBIDecision(
    isValid: boolean, 
    rbiCompliant: boolean, 
    confidence: number, 
    issues: string[]
  ): 'APPROVE' | 'REJECT' | 'MANUAL_REVIEW' {
    if (!isValid || !rbiCompliant) {
      return 'REJECT';
    }

    if (confidence >= 90 && issues.length === 0) {
      return 'APPROVE';
    }

    if (confidence >= 70 && issues.length <= 1) {
      return 'MANUAL_REVIEW';
    }

    return 'REJECT';
  }

  async cleanup() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}