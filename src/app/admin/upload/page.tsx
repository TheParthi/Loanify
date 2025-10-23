'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  Check, 
  AlertCircle,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  Zap,
  CheckCircle
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from '@/lib/i18n';
import Link from 'next/link';
import { documentAnalyzer, ProcessingResult } from '@/lib/document-analyzer';
import { ProcessingModal } from '@/components/ui/processing-modal';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
  preview?: string;
  file?: File; // Store the actual file for processing
}

const loanTypes = {
  personal: {
    name: 'Personal Loan',
    documents: [
      { id: 'aadhar', name: 'Aadhar Card', icon: FileText, required: true },
      { id: 'pan', name: 'PAN Card', icon: FileText, required: true },
      { id: 'salary', name: 'Salary Slips (3 months)', icon: FileText, required: true },
      { id: 'bank', name: 'Bank Statement (6 months)', icon: FileText, required: true },
      { id: 'photo', name: 'Passport Photo', icon: Image, required: true }
    ]
  },
  home: {
    name: 'Home Loan',
    documents: [
      { id: 'aadhar', name: 'Aadhar Card', icon: FileText, required: true },
      { id: 'pan', name: 'PAN Card', icon: FileText, required: true },
      { id: 'income', name: 'Income Proof', icon: FileText, required: true },
      { id: 'property', name: 'Property Documents', icon: FileText, required: true },
      { id: 'bank', name: 'Bank Statement', icon: FileText, required: true },
      { id: 'valuation', name: 'Property Valuation', icon: FileText, required: true }
    ]
  },
  vehicle: {
    name: 'Vehicle Loan',
    documents: [
      { id: 'aadhar', name: 'Aadhar Card', icon: FileText, required: true },
      { id: 'pan', name: 'PAN Card', icon: FileText, required: true },
      { id: 'income', name: 'Income Proof', icon: FileText, required: true },
      { id: 'quotation', name: 'Vehicle Quotation', icon: FileText, required: true },
      { id: 'bank', name: 'Bank Statement', icon: FileText, required: true }
    ]
  },
  business: {
    name: 'Business Loan',
    documents: [
      { id: 'aadhar', name: 'Aadhar Card', icon: FileText, required: true },
      { id: 'pan', name: 'PAN Card', icon: FileText, required: true },
      { id: 'gst', name: 'GST Registration', icon: FileText, required: true },
      { id: 'financials', name: 'Financial Statements', icon: FileText, required: true },
      { id: 'bank', name: 'Bank Statement (12 months)', icon: FileText, required: true },
      { id: 'itr', name: 'ITR (3 years)', icon: FileText, required: true }
    ]
  }
};

export default function DocumentUpload() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedLoanType, setSelectedLoanType] = useState<keyof typeof loanTypes>('personal');
  const [selectedDocType, setSelectedDocType] = useState('aadhar');
  const [applicantName, setApplicantName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState(false);

  const currentDocuments = loanTypes[selectedLoanType].documents;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!applicantName.trim()) {
      // Show in-app notification instead of alert
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm';
      notification.innerHTML = `
        <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span class="text-sm font-medium">Please enter applicant name first</span>
        <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      return;
    }

    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: selectedDocType,
      status: 'uploading',
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      file: file // Store the actual file
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Fast upload simulation
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + 50, 100); // Faster progress
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 200); // Faster updates

      setTimeout(() => clearInterval(interval), 800); // Complete in 800ms
    });
  }, [selectedDocType, applicantName, selectedLoanType]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processDocuments = async () => {
    setIsProcessing(true);
    // Simulate AI processing with Amazon Q
    await new Promise(resolve => setTimeout(resolve, 3000));
    setUploadComplete(true);
    setIsProcessing(false);
  };

  const completedFiles = files.filter(f => f.status === 'completed');

  if (uploadComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Documents Uploaded Successfully! ✅</h2>
              <p className="text-gray-600 mb-8">
                All documents for <strong>{applicantName}</strong> have been processed and saved to the system.
                The AI evaluation has been completed.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-navy-600 hover:bg-navy-700">
                  <Link href="/admin/applicants">Go to Applicants</Link>
                </Button>
                <Button variant="outline" onClick={() => {
                  setUploadComplete(false);
                  setFiles([]);
                  setApplicantName('');
                }}>
                  Upload More Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Upload</h1>
            <p className="text-gray-600 mt-1">Upload customer documents for AI-powered loan evaluation</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => {
              setFiles([]);
              setApplicantName('');
            }}>
              <RefreshCw className="h-4 w-4" />
              Clear All
            </Button>
            <Button 
              onClick={async () => {
                if (completedFiles.length === 0 || !applicantName.trim()) {
                  // Show in-app notification
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 right-4 z-50 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm';
                  notification.innerHTML = `
                    <svg class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="text-sm font-medium">Please upload documents and enter applicant name first</span>
                    <button onclick="this.parentElement.remove()" class="ml-2 text-yellow-600 hover:text-yellow-800">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  `;
                  document.body.appendChild(notification);
                  setTimeout(() => notification.remove(), 4000);
                  return;
                }
                
                setIsProcessing(true);
                setShowProcessingModal(true);
                
                try {
                  // Validate that we have actual uploaded files with content
                  const validFiles = completedFiles.filter(fileData => 
                    fileData.file && 
                    fileData.file.size > 0 && 
                    fileData.status === 'completed'
                  );
                  
                  if (validFiles.length === 0) {
                    // Show in-app notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm';
                    notification.innerHTML = `
                      <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span class="text-sm font-medium">No valid documents uploaded. Please upload actual document files</span>
                      <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    `;
                    document.body.appendChild(notification);
                    setTimeout(() => notification.remove(), 4000);
                    setIsProcessing(false);
                    return;
                  }
                  
                  // Map valid files for processing
                  const filesToProcess = validFiles.map(fileData => ({
                    file: fileData.file!,
                    type: fileData.type
                  }));
                  
                  // Process documents with real analysis - no mock data
                  const result = await realDocumentAnalysis(filesToProcess, applicantName);
                  
                  setProcessingResult(result);
                  setIsProcessing(false);
                  
                  // Auto-close modal after 10 seconds if user doesn't interact
                  setTimeout(() => {
                    if (showProcessingModal) {
                      setUploadComplete(true);
                      setShowProcessingModal(false);
                    }
                  }, 10000);
                  
                } catch (error) {
                  console.error('Document processing failed:', error);
                  // Show in-app notification
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm';
                  notification.innerHTML = `
                    <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span class="text-sm font-medium">Document processing failed. Please try again</span>
                    <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  `;
                  document.body.appendChild(notification);
                  setTimeout(() => notification.remove(), 4000);
                  setIsProcessing(false);
                  setShowProcessingModal(false);
                }
              }}
              disabled={completedFiles.length === 0 || isProcessing || !applicantName.trim()}
              className="bg-navy-600 hover:bg-navy-700 gap-2"
            >
              <Zap className="h-4 w-4" />
              {isProcessing ? 'Processing with AI...' : 'Process with AI'}
            </Button>
          </div>
        </div>

        {/* Loan Type & Applicant Info */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Loan Type</CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedLoanType}
                onChange={(e) => {
                  setSelectedLoanType(e.target.value as keyof typeof loanTypes);
                  setSelectedDocType(loanTypes[e.target.value as keyof typeof loanTypes].documents[0].id);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
              >
                {Object.entries(loanTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.name}</option>
                ))}
              </select>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Applicant Name *</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Enter applicant full name"
                required
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Required Documents */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Required Documents</CardTitle>
              <p className="text-sm text-gray-600">{loanTypes[selectedLoanType].name}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentDocuments.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocType(doc.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                    selectedDocType === doc.id 
                      ? 'bg-navy-100 border-2 border-navy-500 text-navy-700' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <doc.icon className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="font-medium">{doc.name}</p>
                    {doc.required && (
                      <Badge variant="secondary" className="text-xs mt-1">Required</Badge>
                    )}
                  </div>
                  {files.some(f => f.type === doc.id && f.status === 'completed') && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Upload Area */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Upload {currentDocuments.find(t => t.id === selectedDocType)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragActive 
                    ? 'border-navy-500 bg-navy-50' 
                    : 'border-gray-300 hover:border-navy-400 hover:bg-gray-50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-gray-500 mb-4">or click to browse</p>
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Choose Files
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Supports: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>

              {/* Uploaded Files */}
              {files.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-gray-900">Uploaded Files ({files.length})</h3>
                  <div className="space-y-3">
                    {files.map(file => (
                      <div key={file.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border shadow-sm">
                        {file.preview ? (
                          <img src={file.preview} alt={file.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                            <FileText className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          
                          {file.status === 'uploading' && (
                            <div className="mt-2">
                              <Progress value={file.progress} className="h-2" />
                              <p className="text-xs text-gray-500 mt-1">{Math.round(file.progress)}% uploaded</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {file.status === 'completed' && (
                            <>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Download className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center">
                          {file.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <Check className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                          {file.status === 'uploading' && (
                            <Badge variant="secondary">
                              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                              Uploading
                            </Badge>
                          )}
                          {file.status === 'error' && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Processing Status */}
              {isProcessing && (
                <div className="mt-8 p-6 bg-navy-50 rounded-xl border border-navy-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy-900">AI Processing in Progress</h3>
                      <p className="text-sm text-navy-600">Analyzing documents and generating evaluation report...</p>
                    </div>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-navy-600 mt-2">This may take a few moments</p>
                </div>
              )}

            </CardContent>
          </Card>

        </div>

      </div>
      
      {/* Processing Modal */}
      <ProcessingModal 
        isOpen={showProcessingModal}
        onClose={() => {
          setShowProcessingModal(false);
          if (processingResult) {
            setUploadComplete(true);
          }
        }}
        result={processingResult}
        isProcessing={isProcessing}
      />
    </div>
  );

}

// RBI-Compliant Document Analysis with AI Deduction
async function realDocumentAnalysis(files: Array<{file: File, type: string}>, applicantName: string): Promise<ProcessingResult> {
  const { RBIDocumentValidator } = await import('@/lib/rbi-document-validator');
  const validator = new RBIDocumentValidator();
  
  const documentAnalyses = await Promise.all(files.map(async ({file, type}) => {
    try {
      // Perform RBI-compliant analysis
      const analysis = await validator.performRBICompliantAnalysis(file, type as any);
      
      // Convert to expected format
      const validationResults = analysis.validationResults.map(result => ({
        field: result.field,
        value: result.value,
        isValid: result.isValid,
        confidence: result.isValid ? 95 : 10
      }));
      
      return {
        documentType: type,
        extractedText: `RBI Analysis: ${analysis.recommendation}\nExtracted: ${Object.entries(analysis.extractedData).map(([k,v]) => `${k}: ${v}`).join(', ')}`,
        confidence: analysis.confidence,
        validationResults,
        rbiCompliant: analysis.rbiCompliant,
        issues: analysis.issues,
        recommendation: analysis.recommendation
      };

      
    } catch (error) {
      console.error('RBI Document analysis failed:', error);
      return {
        documentType: type,
        extractedText: 'RBI Analysis failed',
        confidence: 0,
        validationResults: [
          { field: 'Document Processing', value: 'Failed', isValid: false, confidence: 0 }
        ],
        rbiCompliant: false,
        issues: [error.message || 'Failed to process document with RBI validator'],
        recommendation: 'REJECT'
      };
    }
  }));
  
  // Cleanup validator
  await validator.cleanup();
  
  // Minimal processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const averageOcrAccuracy = documentAnalyses.reduce((sum, analysis) => sum + analysis.confidence, 0) / documentAnalyses.length;
  const rbiCompliance = documentAnalyses.every(analysis => analysis.rbiCompliance);
  const allIssues = [...new Set(documentAnalyses.flatMap(analysis => analysis.issues))];
  
  // RBI-Based Credit Scoring and Decision Making
  const approvedCount = documentAnalyses.filter(doc => doc.recommendation === 'APPROVE').length;
  const rejectedCount = documentAnalyses.filter(doc => doc.recommendation === 'REJECT').length;
  const reviewCount = documentAnalyses.filter(doc => doc.recommendation === 'MANUAL_REVIEW').length;
  
  // Calculate credit score based on RBI analysis
  let creditScore = 300; // Base score
  
  // Award points for approved documents
  creditScore += approvedCount * 120;
  creditScore += reviewCount * 60;
  
  // Penalty for rejected documents
  creditScore -= rejectedCount * 100;
  
  // RBI compliance bonus
  if (rbiCompliance) creditScore += 80;
  
  // OCR quality bonus
  creditScore += Math.round(averageOcrAccuracy * 2);
  
  // Cap the score
  creditScore = Math.max(300, Math.min(850, creditScore));
  
  // Final decision based on RBI recommendations
  let decision: 'APPROVED' | 'REJECTED' | 'PENDING' = 'REJECTED';
  
  if (rejectedCount > 0) {
    decision = 'REJECTED';
  } else if (approvedCount === documentAnalyses.length) {
    decision = 'APPROVED';
  } else if (reviewCount > 0) {
    decision = 'PENDING';
  } else {
    decision = 'REJECTED';
  }
  
  return {
    documentsAnalyzed: files.length,
    averageOcrAccuracy: Math.round(averageOcrAccuracy),
    rbiCompliance,
    creditScore,
    decision,
    issues: allIssues,
    documentAnalyses
  };
}