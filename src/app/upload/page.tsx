'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, ArrowLeft, CheckCircle } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loanId = searchParams.get('loanId');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !loanId) return;

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('salarySlip', file);
      formData.append('loanId', loanId);

      const response = await fetch('http://localhost:5000/upload/salary', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.status === 'approved') {
        router.push(`/result?loanId=${loanId}&status=approved`);
      } else if (result.status === 'rejected') {
        router.push(`/result?loanId=${loanId}&status=rejected`);
      } else {
        setUploaded(true);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/eligibility" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Loanify NBFC</h1>
                <p className="text-sm text-gray-600">Document Upload</p>
              </div>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Upload Salary Slip</h1>
            <p className="text-lg text-gray-600">Please upload your latest salary slip for verification</p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Upload className="h-6 w-6 text-blue-600" />
                Document Upload
              </CardTitle>
              <CardDescription>
                Upload your latest salary slip (PDF format, max 2MB)
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
                          {file ? file.name : 'Choose salary slip to upload'}
                        </p>
                        <p className="text-sm text-gray-500">PDF format, maximum 2MB</p>
                      </div>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                      >
                        Select File
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </Button>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Uploaded Successfully</h3>
                  <p className="text-gray-600 mb-6">Your salary slip has been uploaded and is being processed.</p>
                  <Button
                    onClick={() => router.push(`/result?loanId=${loanId}`)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    View Results
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}