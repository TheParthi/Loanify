import { AdminLayout } from '@/components/admin/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Target, Eye, Award, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">About Loanify</h2>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            AI-powered loan evaluation platform built to simplify and accelerate loan processing for banks and NBFCs
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                To democratize access to credit by leveraging artificial intelligence to make loan processing 
                faster, more accurate, and completely transparent. We aim to eliminate bias and reduce processing 
                time from weeks to minutes while maintaining the highest standards of compliance and security.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 leading-relaxed">
                To become the leading AI-powered financial technology platform that transforms how lending 
                institutions evaluate creditworthiness, enabling millions of individuals and businesses to 
                access fair and timely financial services across emerging markets.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Why Choose Loanify?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-slate-600">
                  Process loan applications in under 5 minutes with 94% accuracy using advanced AI algorithms
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Bank-Grade Security</h3>
                <p className="text-sm text-slate-600">
                  Enterprise-level security with end-to-end encryption and compliance with RBI guidelines
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Regulatory Compliant</h3>
                <p className="text-sm text-slate-600">
                  Built with RBI Fair Practice Code and GDPR compliance from the ground up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Platform Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">50K+</p>
                <p className="text-sm text-slate-600 mt-1">Applications Processed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">94%</p>
                <p className="text-sm text-slate-600 mt-1">AI Accuracy Rate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">2.3 min</p>
                <p className="text-sm text-slate-600 mt-1">Average Processing Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">150+</p>
                <p className="text-sm text-slate-600 mt-1">Partner Institutions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-slate-900">Compliance & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Regulatory Compliance</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    RBI Fair Practice Code for Lenders
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    GDPR Data Privacy Compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    ISO 27001 Information Security
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    SOC 2 Type II Certified
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Data Protection</h3>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    256-bit AES Encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Multi-factor Authentication
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Regular Security Audits
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Zero-trust Architecture
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 mt-6">
              <p className="text-sm text-slate-700">
                <strong>Privacy Notice:</strong> Loanify is committed to protecting your privacy and ensuring 
                the security of your personal information. We process data in accordance with applicable data 
                protection laws and maintain strict confidentiality standards. For detailed information about 
                our data practices, please refer to our Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-slate-900 mb-2">Need More Information?</h3>
            <p className="text-slate-600 mb-4">
              Contact our team for detailed product information, partnership opportunities, or technical support.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <span className="text-sm text-slate-600">Email: support@loanify.ai</span>
              <span className="hidden sm:inline text-slate-400">|</span>
              <span className="text-sm text-slate-600">Phone: +91-98765-43210</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}