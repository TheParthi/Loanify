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

    // Simulate Firebase upload with metadata saving
    newFiles.forEach(file => {
      const interval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === file.id) {
            const newProgress = Math.min(f.progress + Math.random() * 30, 100);
            if (newProgress === 100) {
              // Simulate saving to Firestore
              const metadata = {
                applicantName,
                loanType: selectedLoanType,
                documentType: selectedDocType,
                fileURL: `https://storage.firebase.com/${file.id}`,
                uploadTime: new Date().toISOString()
              };
              console.log('Saved to Firestore:', metadata);
            }
            return {
              ...f,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : 'uploading'
            };
          }
          return f;
        }));
      }, 500);

      setTimeout(() => clearInterval(interval), 3000);
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
                  // Get the actual files from the completed uploads
                  const filesToProcess = completedFiles
                    .filter(fileData => fileData.file) // Only process files that have the actual File object
                    .map(fileData => ({
                      file: fileData.file!,
                      type: fileData.type
                    }));
                  
                  if (filesToProcess.length === 0) {
                    // Show in-app notification
                    const notification = document.createElement('div');
                    notification.className = 'fixed top-4 right-4 z-50 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm';
                    notification.innerHTML = `
                      <svg class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span class="text-sm font-medium">No valid files found for processing. Please re-upload your documents</span>
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
                  
                  // Process documents with realistic analysis
                  const result = await simulateDocumentAnalysis(filesToProcess, applicantName);
                  
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

// Real document analysis with OCR
async function simulateDocumentAnalysis(files: Array<{file: File, type: string}>, applicantName: string): Promise<ProcessingResult> {
  // Import Tesseract dynamically
  const { createWorker } = await import('tesseract.js');
  
  const documentAnalyses = await Promise.all(files.map(async ({file, type}) => {
    try {
      // Initialize OCR worker
      const worker = await createWorker('eng');
      
      // Perform OCR on the actual image
      const { data } = await worker.recognize(file);
      const extractedText = data.text.toUpperCase();
      const ocrConfidence = data.confidence;
      
      await worker.terminate();
      
      // Analyze file properties
      const fileSize = file.size;
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      
      let confidence = Math.max(20, ocrConfidence);
      const documentIssues: string[] = [];
      let rbiCompliance = true;
      const validationResults: any[] = [];
    
      // File quality checks
      if (fileSize < 50000) {
        documentIssues.push('File size is very small - may indicate poor quality scan');
        confidence -= 15;
      }
      
      if (!fileType.startsWith('image/')) {
        documentIssues.push('Only image files are supported for OCR analysis');
        confidence -= 30;
        rbiCompliance = false;
      }
      
      // Check if text was actually extracted
      if (extractedText.length < 10) {
        documentIssues.push('Very little text detected - image may be unclear or not a document');
        confidence -= 40;
        rbiCompliance = false;
      }
    
      // Document type specific validation based on actual OCR text
      switch (type) {
        case 'aadhar':
          const aadharPattern = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
          const aadharMatch = extractedText.match(aadharPattern);
          const hasGovHeader = extractedText.includes('GOVERNMENT OF INDIA') || extractedText.includes('GOVT OF INDIA');
          const hasUID = extractedText.includes('UNIQUE IDENTIFICATION');
          
          validationResults.push(
            { field: 'Aadhar Number', value: aadharMatch ? aadharMatch[0] : 'Not found in text', isValid: !!aadharMatch, confidence: aadharMatch ? 90 : 10 },
            { field: 'Government Header', value: hasGovHeader ? 'Found' : 'Not found', isValid: hasGovHeader, confidence: hasGovHeader ? 85 : 10 }
          );
          
          if (!aadharMatch) {
            documentIssues.push('No Aadhar number pattern detected in the image');
            rbiCompliance = false;
          }
          if (!hasGovHeader && !hasUID) {
            documentIssues.push('Government of India header not found - may not be an Aadhar card');
            rbiCompliance = false;
          }
          break;
          
        case 'pan':
          const panPattern = /\b[A-Z]{5}\d{4}[A-Z]\b/;
          const panMatch = extractedText.match(panPattern);
          const hasIncomeHeader = extractedText.includes('INCOME TAX') || extractedText.includes('TAX DEPARTMENT');
          const hasPermanent = extractedText.includes('PERMANENT ACCOUNT');
          
          validationResults.push(
            { field: 'PAN Number', value: panMatch ? panMatch[0] : 'Not found in text', isValid: !!panMatch, confidence: panMatch ? 95 : 10 },
            { field: 'Income Tax Header', value: hasIncomeHeader ? 'Found' : 'Not found', isValid: hasIncomeHeader, confidence: hasIncomeHeader ? 80 : 10 }
          );
          
          if (!panMatch) {
            documentIssues.push('No PAN number pattern detected in the image');
            rbiCompliance = false;
          }
          if (!hasIncomeHeader && !hasPermanent) {
            documentIssues.push('Income Tax Department header not found - may not be a PAN card');
            rbiCompliance = false;
          }
          break;
        
        case 'salary':
          const salaryKeywords = ['SALARY', 'PAY SLIP', 'PAYSLIP', 'BASIC PAY', 'GROSS SALARY', 'NET PAY'];
          const hasSalaryKeyword = salaryKeywords.some(keyword => extractedText.includes(keyword));
          const amountPattern = /₹\s?[\d,]+\.?\d*/;
          const amountMatch = extractedText.match(amountPattern);
          
          validationResults.push(
            { field: 'Salary Document', value: hasSalaryKeyword ? 'Detected' : 'Not detected', isValid: hasSalaryKeyword, confidence: hasSalaryKeyword ? 75 : 10 },
            { field: 'Salary Amount', value: amountMatch ? amountMatch[0] : 'Not found', isValid: !!amountMatch, confidence: amountMatch ? 70 : 10 }
          );
          
          if (!hasSalaryKeyword) {
            documentIssues.push('No salary-related keywords found - may not be a salary slip');
            rbiCompliance = false;
          }
          break;
          
        case 'bank':
          const bankKeywords = ['BANK STATEMENT', 'ACCOUNT STATEMENT', 'STATEMENT OF ACCOUNT'];
          const hasBankKeyword = bankKeywords.some(keyword => extractedText.includes(keyword));
          const accountPattern = /\b\d{9,18}\b/;
          const accountMatch = extractedText.match(accountPattern);
          
          validationResults.push(
            { field: 'Bank Statement', value: hasBankKeyword ? 'Detected' : 'Not detected', isValid: hasBankKeyword, confidence: hasBankKeyword ? 80 : 10 },
            { field: 'Account Number', value: accountMatch ? accountMatch[0] : 'Not found', isValid: !!accountMatch, confidence: accountMatch ? 70 : 10 }
          );
          
          if (!hasBankKeyword) {
            documentIssues.push('No bank statement keywords found - may not be a bank statement');
            rbiCompliance = false;
          }
          break;
        
        case 'photo':
          // For photos, we don't need OCR validation, just file checks
          const photoValid = fileType.startsWith('image/') && fileSize > 20000 && fileSize < 2000000;
          validationResults.push(
            { field: 'Photo Quality', value: photoValid ? 'Good' : 'Poor', isValid: photoValid, confidence: photoValid ? 90 : 40 },
            { field: 'File Format', value: fileType, isValid: fileType.startsWith('image/'), confidence: fileType.startsWith('image/') ? 95 : 0 }
          );
          if (!photoValid) {
            documentIssues.push('Photo quality is poor or file format is not suitable');
          }
          break;
          
        default:
          validationResults.push(
            { field: 'Document Type', value: 'Unknown', isValid: false, confidence: 0 }
          );
          documentIssues.push('Document type not recognized for validation');
          rbiCompliance = false;
      }
    
      // Final confidence adjustment based on validation success
      const validationSuccess = validationResults.filter(v => v.isValid).length / validationResults.length;
      confidence = Math.max(10, Math.min(98, confidence * validationSuccess));
      
      return {
        documentType: type,
        extractedText: extractedText.substring(0, 200) + (extractedText.length > 200 ? '...' : ''),
        confidence: Math.round(confidence),
        validationResults,
        rbiCompliance,
        issues: documentIssues
      };
      
    } catch (error) {
      console.error('OCR processing failed:', error);
      return {
        documentType: type,
        extractedText: 'OCR processing failed',
        confidence: 0,
        validationResults: [
          { field: 'OCR Processing', value: 'Failed', isValid: false, confidence: 0 }
        ],
        rbiCompliance: false,
        issues: ['Failed to process document with OCR - please ensure image is clear and readable']
      };
    }
  }));
  
  // Add processing delay for realism
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const averageOcrAccuracy = documentAnalyses.reduce((sum, analysis) => sum + analysis.confidence, 0) / documentAnalyses.length;
  const rbiCompliance = documentAnalyses.every(analysis => analysis.rbiCompliance);
  const allIssues = [...new Set(documentAnalyses.flatMap(analysis => analysis.issues))];
  
  // Calculate realistic credit score based on document quality
  let creditScore = 650;
  
  // OCR accuracy impact
  if (averageOcrAccuracy > 90) creditScore += 60;
  else if (averageOcrAccuracy > 80) creditScore += 40;
  else if (averageOcrAccuracy > 70) creditScore += 20;
  else if (averageOcrAccuracy > 60) creditScore += 5;
  else creditScore -= 30;
  
  // RBI compliance impact
  if (rbiCompliance) creditScore += 40;
  else creditScore -= 60;
  
  // Document validation success rate
  const totalValidations = documentAnalyses.reduce((sum, analysis) => sum + analysis.validationResults.length, 0);
  const successfulValidations = documentAnalyses.reduce((sum, analysis) => 
    sum + analysis.validationResults.filter(result => result.isValid).length, 0
  );
  const validationRate = totalValidations > 0 ? successfulValidations / totalValidations : 0;
  
  if (validationRate > 0.9) creditScore += 50;
  else if (validationRate > 0.8) creditScore += 35;
  else if (validationRate > 0.6) creditScore += 15;
  else if (validationRate > 0.4) creditScore -= 10;
  else creditScore -= 40;
  
  // Issues penalty
  creditScore -= Math.min(allIssues.length * 15, 100);
  
  // Ensure realistic range
  creditScore = Math.max(300, Math.min(850, creditScore));
  
  // Determine decision based on comprehensive analysis
  let decision: 'APPROVED' | 'REJECTED' | 'PENDING' = 'PENDING';
  
  if (averageOcrAccuracy < 40 || !rbiCompliance || validationRate < 0.3) {
    decision = 'REJECTED';
  } else if (averageOcrAccuracy > 85 && rbiCompliance && validationRate > 0.8 && allIssues.length <= 1) {
    decision = 'APPROVED';
  } else if (averageOcrAccuracy > 75 && rbiCompliance && validationRate > 0.7) {
    decision = 'APPROVED';
  } else if (averageOcrAccuracy > 60 && validationRate > 0.5) {
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