'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Brain, FileCheck, Shield, BarChart3, MessageCircle } from 'lucide-react';
import { CustomerEligibilityChecker } from '@/components/customer-eligibility-checker';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';

function HomeContent() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
        <div className="container mx-auto px-6 h-[100px] flex items-center justify-between">
          <div className="flex items-center -space-x-2 p-5">
            <Image 
              src="https://i.postimg.cc/9Q09JtXp/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png" 
              alt="Loanify" 
              width={200} 
              height={120} 
              className="w-[200px] h-[120px] object-contain hover:scale-[1.05] transition-all duration-300 ease-in-out" 
            />
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-white tracking-tight">Loanify</span>
              <span className="text-sm text-blue-300 font-medium tracking-wide">AI-Powered Loan Solutions</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors font-medium">{t('home')}</Link>
            <Link href="#features" className="text-slate-300 hover:text-blue-300 transition-colors font-medium">Features</Link>
            <Link href="/about" className="text-slate-300 hover:text-blue-300 transition-colors font-medium">{t('about')}</Link>
            <Link href="/contact" className="text-slate-300 hover:text-blue-300 transition-colors font-medium">{t('contact')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <ThemeToggle />
            <Link href="/login">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                <Lock className="h-4 w-4" />
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
          <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    RBI Licensed NBFC
                  </div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                    {t('adminPortalFor')}
                    <span className="text-gold-400"> {t('loanProcessing')}</span>
                  </h1>
                  <p className="text-xl text-slate-300 leading-relaxed">
                    {t('uploadCustomerDocs')}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 rounded-xl px-8 py-4 text-lg font-semibold">
                    <Link href="/login">{t('accessAdminPortal')}</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white bg-white text-black hover:bg-slate-100 active:bg-slate-200 focus:text-black rounded-xl px-8 py-4 text-lg font-semibold">
                    <a href="#eligibility-checker">{t('checkEligibility')}</a>
                  </Button>
                </div>
                <div className="flex items-center gap-6 text-slate-400 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('instantReports')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gold-400 rounded-full"></div>
                    <span>{t('rbiCompliant')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{t('secureProcessing')}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                  <Image 
                    src="/hero-image.png" 
                    alt="Loanify NBFC Platform" 
                    width={500} 
                    height={400} 
                    className="relative max-w-full h-auto object-contain rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('adminPortalFeatures')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('professionalTools')}</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('aiDrivenScoring')}</h3>
                  <p className="text-sm text-gray-600">{t('advancedAlgorithms')}</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileCheck className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('documentUpload')}</h3>
                  <p className="text-sm text-gray-600">{t('uploadDocsGenerate')}</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('rbiCompliantFull')}</h3>
                  <p className="text-sm text-gray-600">{t('builtInCompliance')}</p>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{t('reportGeneration')}</h3>
                  <p className="text-sm text-gray-600">{t('professionalPdfReports')}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Eligibility Checker Section */}
        <section id="eligibility-checker" className="py-16 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('checkEligibility')}</h2>
                <p className="text-gray-600">RBI-compliant instant loan eligibility assessment</p>
              </div>
              <Card className="border border-gray-200 shadow-lg rounded-xl">
                <CardContent className="p-8">
                  <CustomerEligibilityChecker />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Admin Features Section */}
        <section id="admin-features" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('professionalLoanProcessing')}</h2>
                <p className="text-lg text-gray-600">{t('uploadDocsProcess')}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border border-gray-200 shadow-lg rounded-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <FileCheck className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('documentProcessing')}</h3>
                    <p className="text-gray-600 mb-6">{t('uploadCustomerDocsAi')}</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                      <Link href="/login">{t('startProcessing')}</Link>
                    </Button>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 shadow-lg rounded-xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('instantReportsFull')}</h3>
                    <p className="text-gray-600 mb-6">{t('generateProfessionalPdf')}</p>
                    <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 rounded-xl">
                      <Link href="/login">{t('viewDashboard')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Admin CTA */}
        <section className="py-16 bg-gradient-to-r from-navy-800 to-navy-900">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">{t('readyToProcessLoans')}</h2>
              <p className="text-lg text-slate-300 mb-6">{t('accessDashboardUpload')}</p>
              <Button size="lg" asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 rounded-xl px-8 py-4 font-semibold">
                <Link href="/login">{t('loginToDashboard')}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>



      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12 border-t border-navy-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src="/logo.png" alt="Loanify" width={32} height={32} className="h-8 w-8" />
                <div>
                  <span className="font-bold text-lg">Loanify</span>
                  <span className="block text-xs text-gold-400">RBI Licensed NBFC</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted partner for instant loan approvals with AI-powered processing
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gold-400 mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link href="/" className="block text-slate-300 hover:text-gold-400 transition-colors">Home</Link>
                <Link href="/about" className="block text-slate-300 hover:text-gold-400 transition-colors">About Us</Link>
                <Link href="/contact" className="block text-slate-300 hover:text-gold-400 transition-colors">Contact</Link>
                <Link href="/login" className="block text-slate-300 hover:text-gold-400 transition-colors">Admin Portal</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gold-400 mb-4">Loan Products</h3>
              <div className="space-y-2 text-sm">
                <span className="block text-slate-300">Personal Loans</span>
                <span className="block text-slate-300">Home Loans</span>
                <span className="block text-slate-300">Vehicle Loans</span>
                <span className="block text-slate-300">Business Loans</span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gold-400 mb-4">Compliance</h3>
              <div className="space-y-2 text-sm text-slate-400">
                <p>RBI Registration: N-14.03268</p>
                <p>NBFC License: Active</p>
                <p>ISO 27001 Certified</p>
                <p>Data Protection Compliant</p>
              </div>
            </div>
          </div>
          <div className="border-t border-navy-800 mt-8 pt-8 text-center">
            <p className="text-slate-400 text-sm">
              © 2025 Loanify NBFC. All rights reserved. | Licensed by RBI | Responsible Lending Practices
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return <HomeContent />;
}
