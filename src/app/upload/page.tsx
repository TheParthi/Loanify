'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, ArrowLeft, CheckCircle, AlertCircle, Eye, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function UploadContent() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [loanType, setLoanType] = useState('personal');
  const router = useRouter();
  const searchParams = useSearchParams();
  const loanId = searchParams?.get('loanId') || null;

  const documentRequirements = {
    personal: [
      { name: 'Aadhaar Card', required: true, description: 'Government issued identity proof' },
      { name: 'PAN Card', required: true, description: 'Permanent Account Number card' },
      { name: 'Salary Slip', required: true, description: 'Last 3 months salary slips' },
      { name: 'Bank Statement', required: true, description: 'Last 6 months bank statements' },
      { name: 'Form 16', required: false, description: 'Income tax certificate (optional)' }
    ],
    business: [
      { name: 'Aadhaar Card', required: true, description: 'Government issued identity proof' },
      { name: 'PAN Card', required: true, description: 'Permanent Account Number card' },
      { name: 'Business License', required: true, description: 'Valid business registration' },
      { name: 'GST Certificate', required: true, description: 'GST registration certificate' },
      { name: 'Bank Statement', required: true, description: 'Last 12 months business bank statements' },
      { name: 'ITR', required: true, description: 'Last 2 years Income Tax Returns' },
      { name: 'Financial Statements', required: false, description: 'P&L and Balance Sheet (optional)' }
    ],
    vehicle: [
      { name: 'Aadhaar Card', required: true, description: 'Government issued identity proof' },
      { name: 'PAN Card', required: true, description: 'Permanent Account Number card' },
      { name: 'Salary Slip', required: true, description: 'Last 3 months salary slips' },
      { name: 'Bank Statement', required: true, description: 'Last 6 months bank statements' },
      { name: 'Vehicle Quotation', required: true, description: 'Proforma invoice from dealer' },
      { name: 'Insurance Quote', required: false, description: 'Vehicle insurance quotation (optional)' }
    ]
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeDocument = async (file: File) => {
    // Simulate OCR and AI analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockAnalysis = {
          documentType: file.name.toLowerCase().includes('aadhaar') ? 'Aadhaar Card' :
                      file.name.toLowerCase().includes('pan') ? 'PAN Card' :
                      file.name.toLowerCase().includes('salary') ? 'Salary Slip' :
                      file.name.toLowerCase().includes('bank') ? 'Bank Statement' : 'Unknown Document',
          extractedData: {
            name: 'John Doe',
            documentNumber: file.name.toLowerCase().includes('aadhaar') ? '1234 5678 9012' :
                           file.name.toLowerCase().includes('pan') ? 'ABCDE1234F' :
                           file.name.toLowerCase().includes('salary') ? 'EMP001' : 'N/A',
            issuedDate: new Date().toLocaleDateString(),
            validity: 'Valid',
            income: file.name.toLowerCase().includes('salary') ? 75000 : null
          },
          confidence: Math.random() * 30 + 70, // 70-100% confidence
          issues: Math.random() > 0.8 ? ['Document quality could be better'] : []
        };
        resolve(mockAnalysis);
      }, 2000);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      const analysisResults = [];
      
      for (const file of files) {
        const analysis = await analyzeDocument(file);
        analysisResults.push({ file: file.name, analysis });
      }

      // Calculate overall eligibility
      const avgConfidence = analysisResults.reduce((sum, result) => sum + (result.analysis as any).confidence, 0) / analysisResults.length;
      const hasAllRequired = documentRequirements[loanType as keyof typeof documentRequirements].filter(doc => doc.required).length <= files.length;
      
      const overallResult = {
        eligibilityScore: Math.round(avgConfidence),
        status: avgConfidence >= 80 && hasAllRequired ? 'APPROVED' : avgConfidence >= 60 ? 'REVIEW_REQUIRED' : 'REJECTED',
        documents: analysisResults,
        recommendations: avgConfidence < 80 ? ['Upload clearer document images', 'Ensure all required documents are provided'] : [],
        nextSteps: avgConfidence >= 80 ? 'Your application will be processed within 24 hours' : 'Additional verification may be required'
      };

      setAnalysisResult(overallResult);
      setUploaded(true);

      // Simulate backend upload
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      formData.append('loanId', loanId || 'DEMO');
      formData.append('loanType', loanType);
      formData.append('analysisResult', JSON.stringify(overallResult));

      const response = await fetch('http://localhost:8081/upload/documents', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.redirect) {
          setTimeout(() => {
            router.push(result.redirect);
          }, 3000);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const downloadReport = async () => {
    if (!analysisResult) return;

    const { generateProfessionalReport } = await import('@/lib/pdf-generator');
    
    const reportData = {
      referenceId: `DOC_${Date.now()}`,
      name: 'Document Analysis Report',
      email: 'applicant@email.com',
      mobile: '9876543210',
      loanType: loanType.charAt(0).toUpperCase() + loanType.slice(1) + ' Loan',
      loanAmount: 500000,
      creditScore: 750,
      status: analysisResult.status.toLowerCase(),
      eligibilityPercentage: analysisResult.eligibilityScore,
      recommendedAmount: analysisResult.status === 'APPROVED' ? 500000 : 0,
      interestRate: analysisResult.status === 'APPROVED' ? 10.5 : 0,
      emi: analysisResult.status === 'APPROVED' ? 16500 : 0,
      aiReport: `DOCUMENT ANALYSIS REPORT\n\nLoan Type: ${loanType.toUpperCase()}\nDocuments Analyzed: ${analysisResult.documents.length}\nOverall Confidence: ${analysisResult.eligibilityScore}%\nStatus: ${analysisResult.status}\n\nDocument Details:\n${analysisResult.documents.map((doc: any) => `• ${doc.file}: ${doc.analysis.documentType} (${doc.analysis.confidence.toFixed(1)}% confidence)`).join('\n')}\n\nRecommendations:\n${analysisResult.recommendations.map((rec: string) => `• ${rec}`).join('\n')}\n\nNext Steps: ${analysisResult.nextSteps}`,
      applicationDate: new Date().toISOString(),
      tenure: '36',
      documents: analysisResult.documents.map((doc: any) => doc.analysis.documentType)
    };
    
    generateProfessionalReport(reportData);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/eligibility" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Loanify NBFC</h1>
                <p className="text-sm text-gray-600">AI Document Analysis</p>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Smart Document Upload & Analysis</h1>
            <p className="text-lg mb-2" style={{ color: '#64748B' }}>Upload your documents for instant AI-powered verification and eligibility assessment</p>
            <p className="text-sm" style={{ color: '#64748B' }}>Our OCR technology reads and verifies your documents automatically</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Document Requirements */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Document Requirements</CardTitle>
                <CardDescription>Select loan type to see required documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Type</label>
                  <select 
                    value={loanType} 
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="personal">Personal Loan</option>
                    <option value="business">Business Loan</option>
                    <option value="vehicle">Vehicle Loan</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Required Documents:</h4>
                  {documentRequirements[loanType as keyof typeof documentRequirements].map((doc, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`w-2 h-2 rounded-full mt-2 ${doc.required ? 'bg-red-500' : 'bg-green-500'}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{doc.name}</span>
                          {doc.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upload Area */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Upload Documents
                </CardTitle>
                <CardDescription>
                  Upload PDF, JPG, or PNG files (max 5MB each)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!uploaded ? (
                  <>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {files.length > 0 ? `${files.length} files selected` : 'Choose documents to upload'}
                          </p>
                          <p className="text-sm text-gray-500">PDF, JPG, PNG format, maximum 5MB each</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                          className="hidden"
                          id="file-upload"
                          multiple
                        />
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                        >
                          Select Files
                        </label>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-semibold">Selected Files:</h4>
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-sm font-medium">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => removeFile(index)}>
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={files.length === 0 || uploading}
                      className="w-full text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                      style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                      size="lg"
                    >
                      {uploading ? 'Analyzing Documents...' : 'Upload & Analyze Documents'}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Documents Analyzed Successfully</h3>
                    <p className="text-gray-600 mb-6">AI analysis completed with OCR verification</p>
                    <Button
                      onClick={() => router.push(`/result?loanId=${loanId}&status=${analysisResult?.status.toLowerCase()}`)}
                      className="text-white font-semibold"
                      style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}
                    >
                      View Results
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">AI Analysis Results</CardTitle>
                <CardDescription>
                  {analysisResult ? 'Real-time document verification results' : 'Analysis results will appear here after upload'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="45" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                          <circle
                            cx="60" cy="60" r="45"
                            stroke={analysisResult.eligibilityScore >= 80 ? "#10b981" : analysisResult.eligibilityScore >= 60 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="6" fill="none"
                            strokeDasharray={`${analysisResult.eligibilityScore * 2.83} 283`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{analysisResult.eligibilityScore}%</div>
                            <div className="text-xs text-gray-500">Confidence</div>
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        className="px-3 py-1 font-semibold text-sm mb-4"
                        style={{
                          backgroundColor: analysisResult.status === 'APPROVED' ? '#E8F6F3' : analysisResult.status === 'REVIEW_REQUIRED' ? '#FEF3E2' : '#FEF2F2',
                          color: analysisResult.status === 'APPROVED' ? '#2ECC71' : analysisResult.status === 'REVIEW_REQUIRED' ? '#F39C12' : '#E74C3C'
                        }}
                      >
                        {analysisResult.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Document Analysis:</h4>
                      {analysisResult.documents.map((doc: any, index: number) => (
                        <div key={index} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{doc.file}</span>
                            <Badge variant="outline" className="text-xs">
                              {doc.analysis.confidence.toFixed(1)}% confidence
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">Detected: {doc.analysis.documentType}</p>
                          {doc.analysis.issues.length > 0 && (
                            <div className="mt-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">{doc.analysis.issues[0]}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {analysisResult.recommendations.length > 0 && (
                      <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
                        <h4 className="font-semibold text-orange-800 mb-2">Recommendations:</h4>
                        <ul className="text-sm text-orange-700 space-y-1">
                          {analysisResult.recommendations.map((rec: string, index: number) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button 
                        onClick={downloadReport}
                        className="flex-1 text-white font-semibold"
                        style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                      <Button 
                        onClick={() => setAnalysisResult(null)}
                        variant="outline" 
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-lg font-medium">Ready for Analysis</p>
                    <p className="text-sm">Upload documents to see AI analysis results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 text-sm text-gray-500 bg-white p-6 rounded-lg shadow">
            <p className="font-medium mb-2">AI-Powered Document Verification</p>
            <p>Our advanced OCR technology automatically reads and verifies your documents for instant eligibility assessment.</p>
            <p className="mt-2 text-xs">All documents are processed securely and in compliance with data protection regulations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading upload page...</p>
        </div>
      </div>
    }>
      <UploadContent />
    </Suspense>
  );
}