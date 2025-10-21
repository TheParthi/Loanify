'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Zap, 
  Eye,
  Download,
  X
} from 'lucide-react';
import { ProcessingResult, DocumentAnalysis } from '@/lib/document-analyzer';

interface ProcessingModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ProcessingResult | null;
  isProcessing: boolean;
}

export function ProcessingModal({ isOpen, onClose, result, isProcessing }: ProcessingModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.random() * 15;
        });
      }, 500);

      return () => clearInterval(interval);
    } else if (result) {
      setProgress(100);
    }
  }, [isProcessing, result]);

  if (!isOpen) return null;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'APPROVED': return 'text-green-700 bg-green-100';
      case 'REJECTED': return 'text-red-700 bg-red-100';
      case 'PENDING': return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'APPROVED': return <CheckCircle className="h-5 w-5" />;
      case 'REJECTED': return <XCircle className="h-5 w-5" />;
      case 'PENDING': return <AlertTriangle className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isProcessing ? 'AI Document Processing' : 'Processing Complete'}
                </h2>
                <p className="text-sm text-gray-600">
                  {isProcessing ? 'Analyzing documents with OCR and AI validation' : 'Document analysis results'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Processing documents... {Math.round(progress)}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Performing OCR, validation, and RBI compliance checks
                </p>
              </div>
            </div>
          )}

          {result && !isProcessing && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{result.documentsAnalyzed}</p>
                  <p className="text-sm text-gray-600">Documents</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{result.averageOcrAccuracy}%</p>
                  <p className="text-sm text-gray-600">OCR Accuracy</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{result.creditScore}</p>
                  <p className="text-sm text-gray-600">Credit Score</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Badge className={`${getDecisionColor(result.decision)} flex items-center gap-1 justify-center`}>
                    {getDecisionIcon(result.decision)}
                    {result.decision}
                  </Badge>
                </div>
              </div>

              {/* RBI Compliance */}
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                {result.rbiCompliance ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-700">RBI Compliance Verified</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-700">RBI Compliance Issues Found</span>
                  </>
                )}
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    Issues Identified ({result.issues.length})
                  </h3>
                  <div className="space-y-1">
                    {result.issues.map((issue, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 rounded text-sm">
                        <div className="w-1 h-1 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-yellow-800">{issue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Document Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Document Analysis Details</h3>
                <div className="space-y-3">
                  {result.documentAnalyses.map((analysis, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="font-medium capitalize">{analysis.documentType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {Math.round(analysis.confidence)}% Confidence
                          </Badge>
                          {analysis.rbiCompliance ? (
                            <Badge className="bg-green-100 text-green-700">RBI Compliant</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-700">Non-Compliant</Badge>
                          )}
                        </div>
                      </div>

                      {/* Validation Results */}
                      <div className="space-y-2">
                        {analysis.validationResults.map((validation, vIndex) => (
                          <div key={vIndex} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{validation.field}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{validation.value}</span>
                              {validation.isValid ? (
                                <CheckCircle className="h-3 w-3 text-green-600" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Document Issues */}
                      {analysis.issues.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-red-600 font-medium mb-1">Issues:</p>
                          {analysis.issues.map((issue, iIndex) => (
                            <p key={iIndex} className="text-xs text-red-600">• {issue}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="flex-1" onClick={onClose}>
                  Continue to Applicants
                </Button>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
                <Button variant="outline" className="gap-2">
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}