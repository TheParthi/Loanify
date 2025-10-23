'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  TrendingUp, 
  Users, 
  Award,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Calculator,
  Building,
  CreditCard,
  Home,
  Car,
  Briefcase,
  FileText,
  Clock,
  Lock,
  Globe,
  IndianRupee,
  Percent,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(24);
  const [interestRate, setInterestRate] = useState(12.5);
  const [emi, setEmi] = useState(0);
  const [eligibilityForm, setEligibilityForm] = useState({
    income: '',
    employment: '',
    creditScore: '',
    existingLoans: ''
  });

  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const time = tenure;
    
    const emiValue = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    setEmi(Math.round(emiValue));
  };

  const checkEligibility = () => {
    const income = parseInt(eligibilityForm.income);
    const creditScore = parseInt(eligibilityForm.creditScore);
    const existingLoans = parseInt(eligibilityForm.existingLoans) || 0;
    
    if (!income || !creditScore) {
      alert('Please fill all required fields');
      return;
    }

    // RBI-compliant eligibility logic
    const maxLoanAmount = income * 60; // 5 years of income
    const emiToIncomeRatio = (emi / income) * 100;
    
    let eligibilityStatus = 'Not Eligible';
    let message = '';
    
    if (creditScore >= 750 && emiToIncomeRatio <= 40 && existingLoans < income * 24) {
      eligibilityStatus = 'Highly Eligible';
      message = 'You qualify for our best rates!';
    } else if (creditScore >= 650 && emiToIncomeRatio <= 50) {
      eligibilityStatus = 'Eligible';
      message = 'You qualify for standard rates.';
    } else {
      message = 'Please improve credit score or reduce loan amount.';
    }
    
    alert(`${eligibilityStatus}: ${message}`);
  };

  const applyForLoan = (loanType: string) => {
    // Redirect to eligibility page with loan type
    window.location.href = `/eligibility?type=${loanType}`;
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Header */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4" style={{ borderColor: '#0047AB' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Image 
                src="https://i.postimg.cc/MGyDGd6p/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png"
                alt="Loanify Logo"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loanify NBFC</h1>
                <p className="text-xs font-medium" style={{ color: '#C9D1D9' }}>RBI Licensed • NBFC-ND-SI • Est. 2020</p>
              </div>
            </div>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-semibold text-lg transition-all duration-300 hover:scale-105" style={{ color: '#0047AB' }}>Home</Link>
              <Link href="/loans" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Loans</Link>
              <Link href="/eligibility" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Eligibility</Link>
              <Link href="/about" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>About</Link>
              <Link href="/contact" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Contact</Link>
              <Link href="/chat" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>AI Assistant</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-2 hidden md:flex font-semibold hover:shadow-lg transition-all duration-300" style={{ borderColor: '#0047AB', color: '#0047AB' }}>
                <Phone className="h-4 w-4 mr-2" />
                1800-123-LOAN
              </Button>
              <Link href="/login">
                <Button className="text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  <Lock className="h-4 w-4 mr-2" />
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 50%, #F4F6F8 100%)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-100/30"></div>
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)', color: '#0047AB', border: '2px solid #00B4D8' }}>
                <Shield className="h-5 w-5" />
                RBI Licensed NBFC-ND-SI • CRISIL A+ Rated • ISO 27001 Certified
              </div>
              
              <h1 className="text-7xl font-black mb-8 leading-tight">
                <span style={{ color: '#1E1E1E' }}>India's Most</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Trusted NBFC</span>
                <br />
                <span style={{ color: '#1E1E1E' }}>for Instant Loans</span>
              </h1>
              
              <p className="text-2xl mb-10 leading-relaxed font-medium" style={{ color: '#C9D1D9' }}>
                Get instant loan approvals with our AI-powered system. 
                <br />✓ 2-minute approval ✓ Competitive rates ✓ Zero hidden charges
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 mb-12">
                <Button 
                  size="lg" 
                  onClick={() => window.location.href = '/eligibility'}
                  className="text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
                  style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                >
                  <Calculator className="h-6 w-6 mr-3" />
                  Check Eligibility Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-6 text-xl font-bold border-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                  style={{ borderColor: '#0047AB', color: '#0047AB', background: 'white' }}
                >
                  <IndianRupee className="h-6 w-6 mr-3" />
                  Calculate EMI
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)' }}>
                  <p className="text-4xl font-black mb-2" style={{ color: '#0047AB' }}>₹500Cr+</p>
                  <p className="text-sm font-semibold" style={{ color: '#C9D1D9' }}>Loans Disbursed</p>
                </div>
                <div className="text-center p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F6F3 0%, #FFFFFF 100%)' }}>
                  <p className="text-4xl font-black mb-2" style={{ color: '#2ECC71' }}>50K+</p>
                  <p className="text-sm font-semibold" style={{ color: '#C9D1D9' }}>Happy Customers</p>
                </div>
                <div className="text-center p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FFFFFF 100%)' }}>
                  <p className="text-4xl font-black mb-2" style={{ color: '#F39C12' }}>98.5%</p>
                  <p className="text-sm font-semibold" style={{ color: '#C9D1D9' }}>Approval Rate</p>
                </div>
              </div>
            </div>
            
            {/* EMI Calculator Widget */}
            <div id="emi-calculator">
              <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F4F6F8 100%)' }}>
                <CardContent className="p-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                      <Calculator className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-2" style={{ color: '#1E1E1E' }}>EMI Calculator</h3>
                    <p className="text-lg" style={{ color: '#C9D1D9' }}>Calculate your monthly payments</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-bold mb-3" style={{ color: '#1E1E1E' }}>
                        Loan Amount: ₹{loanAmount.toLocaleString()}
                      </label>
                      <input
                        type="range"
                        min="50000"
                        max="5000000"
                        step="50000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #0047AB 0%, #00B4D8 ${(loanAmount/5000000)*100}%, #C9D1D9 ${(loanAmount/5000000)*100}%, #C9D1D9 100%)` }}
                      />
                      <div className="flex justify-between text-sm mt-2" style={{ color: '#C9D1D9' }}>
                        <span>₹50K</span>
                        <span>₹50L</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-3" style={{ color: '#1E1E1E' }}>
                        Tenure: {tenure} months
                      </label>
                      <input
                        type="range"
                        min="6"
                        max="84"
                        step="6"
                        value={tenure}
                        onChange={(e) => setTenure(parseInt(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #2ECC71 0%, #2ECC71 ${(tenure/84)*100}%, #C9D1D9 ${(tenure/84)*100}%, #C9D1D9 100%)` }}
                      />
                      <div className="flex justify-between text-sm mt-2" style={{ color: '#C9D1D9' }}>
                        <span>6 months</span>
                        <span>84 months</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-lg font-bold mb-3" style={{ color: '#1E1E1E' }}>
                        Interest Rate: {interestRate}% p.a.
                      </label>
                      <input
                        type="range"
                        min="8.5"
                        max="24"
                        step="0.5"
                        value={interestRate}
                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #F39C12 0%, #F39C12 ${((interestRate-8.5)/(24-8.5))*100}%, #C9D1D9 ${((interestRate-8.5)/(24-8.5))*100}%, #C9D1D9 100%)` }}
                      />
                      <div className="flex justify-between text-sm mt-2" style={{ color: '#C9D1D9' }}>
                        <span>8.5%</span>
                        <span>24%</span>
                      </div>
                    </div>

                    <Button 
                      onClick={calculateEMI}
                      className="w-full py-4 text-xl font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                      style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                    >
                      Calculate EMI
                    </Button>

                    {emi > 0 && (
                      <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F6F3 0%, #FFFFFF 100%)', border: '2px solid #2ECC71' }}>
                        <p className="text-lg font-semibold mb-2" style={{ color: '#1E1E1E' }}>Your Monthly EMI</p>
                        <p className="text-4xl font-black" style={{ color: '#2ECC71' }}>₹{emi.toLocaleString()}</p>
                        <p className="text-sm mt-2" style={{ color: '#C9D1D9' }}>
                          Total Amount: ₹{(emi * tenure).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6" style={{ color: '#1E1E1E' }}>Our Loan Products</h2>
            <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>RBI-compliant financial solutions for every need</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-105" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  <CreditCard className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Personal Loan</h3>
                <p className="text-lg mb-6" style={{ color: '#C9D1D9' }}>Quick personal loans for any purpose</p>
                <div className="space-y-3 text-lg mb-8">
                  <p><strong>Rate:</strong> 10.99% onwards</p>
                  <p><strong>Amount:</strong> ₹50K - ₹40L</p>
                  <p><strong>Tenure:</strong> 12-84 months</p>
                </div>
                <Button 
                  onClick={() => applyForLoan('personal')}
                  className="w-full py-4 text-lg font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-105" style={{ background: 'linear-gradient(135deg, #E8F6F3 0%, #FFFFFF 100%)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                  <Home className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Home Loan</h3>
                <p className="text-lg mb-6" style={{ color: '#C9D1D9' }}>Fulfill your dream of owning a home</p>
                <div className="space-y-3 text-lg mb-8">
                  <p><strong>Rate:</strong> 8.50% onwards</p>
                  <p><strong>Amount:</strong> ₹5L - ₹5Cr</p>
                  <p><strong>Tenure:</strong> Up to 30 years</p>
                </div>
                <Button 
                  onClick={() => applyForLoan('home')}
                  className="w-full py-4 text-lg font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-105" style={{ background: 'linear-gradient(135deg, #FEF3E2 0%, #FFFFFF 100%)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)' }}>
                  <Car className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Vehicle Loan</h3>
                <p className="text-lg mb-6" style={{ color: '#C9D1D9' }}>Drive your dream car today</p>
                <div className="space-y-3 text-lg mb-8">
                  <p><strong>Rate:</strong> 9.25% onwards</p>
                  <p><strong>Amount:</strong> ₹1L - ₹1Cr</p>
                  <p><strong>Tenure:</strong> 12-84 months</p>
                </div>
                <Button 
                  onClick={() => applyForLoan('vehicle')}
                  className="w-full py-4 text-lg font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  style={{ background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)' }}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl overflow-hidden hover:scale-105" style={{ background: 'linear-gradient(135deg, #F3E8FF 0%, #FFFFFF 100%)' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}>
                  <Briefcase className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Business Loan</h3>
                <p className="text-lg mb-6" style={{ color: '#C9D1D9' }}>Grow your business with us</p>
                <div className="space-y-3 text-lg mb-8">
                  <p><strong>Rate:</strong> 11.50% onwards</p>
                  <p><strong>Amount:</strong> ₹1L - ₹10Cr</p>
                  <p><strong>Tenure:</strong> 12-120 months</p>
                </div>
                <Button 
                  onClick={() => applyForLoan('business')}
                  className="w-full py-4 text-lg font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" 
                  style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RBI Compliance Section */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6" style={{ color: '#1E1E1E' }}>RBI Compliant & Secure</h2>
            <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>Your trust is our foundation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="bg-white shadow-2xl border-0 p-10 text-center rounded-3xl hover:scale-105 transition-all duration-300">
              <Shield className="h-16 w-16 mx-auto mb-6" style={{ color: '#0047AB' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>RBI Licensed</h3>
              <p className="text-lg" style={{ color: '#C9D1D9' }}>NBFC-ND-SI License No: N-14.03268</p>
            </Card>
            
            <Card className="bg-white shadow-2xl border-0 p-10 text-center rounded-3xl hover:scale-105 transition-all duration-300">
              <Award className="h-16 w-16 mx-auto mb-6" style={{ color: '#2ECC71' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>CRISIL Rated</h3>
              <p className="text-lg" style={{ color: '#C9D1D9' }}>CRISIL A+ Rating for Financial Strength</p>
            </Card>
            
            <Card className="bg-white shadow-2xl border-0 p-10 text-center rounded-3xl hover:scale-105 transition-all duration-300">
              <Lock className="h-16 w-16 mx-auto mb-6" style={{ color: '#F39C12' }} />
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>ISO Certified</h3>
              <p className="text-lg" style={{ color: '#C9D1D9' }}>ISO 27001:2013 Information Security</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-white" style={{ background: 'linear-gradient(135deg, #1E1E1E 0%, #0047AB 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Image 
                  src="https://i.postimg.cc/MGyDGd6p/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png"
                  alt="Loanify Logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h3 className="font-bold text-2xl">Loanify NBFC</h3>
                  <p className="text-sm" style={{ color: '#C9D1D9' }}>RBI Licensed NBFC</p>
                </div>
              </div>
              <p className="mb-6 text-lg" style={{ color: '#C9D1D9' }}>
                India's most trusted AI-powered NBFC providing innovative financial solutions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span className="text-lg">1800-123-LOAN (5626)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5" />
                  <span className="text-lg">support@loanify.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">Mumbai, Maharashtra, India</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Loan Products</h4>
              <div className="space-y-3">
                <Link href="/personal-loan" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Personal Loan</Link>
                <Link href="/home-loan" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Home Loan</Link>
                <Link href="/vehicle-loan" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Vehicle Loan</Link>
                <Link href="/business-loan" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Business Loan</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Quick Links</h4>
              <div className="space-y-3">
                <Link href="/eligibility" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Check Eligibility</Link>
                <Link href="/emi-calculator" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>EMI Calculator</Link>
                <Link href="/branch-locator" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Branch Locator</Link>
                <Link href="/careers" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Careers</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-xl mb-6">Legal & Compliance</h4>
              <div className="space-y-3">
                <Link href="/rbi-guidelines" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>RBI Guidelines</Link>
                <Link href="/privacy-policy" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Privacy Policy</Link>
                <Link href="/terms-conditions" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Terms & Conditions</Link>
                <Link href="/grievance" className="block text-lg hover:text-white transition-colors" style={{ color: '#C9D1D9' }}>Grievance Redressal</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 text-center text-lg" style={{ borderColor: '#C9D1D9' }}>
            <p style={{ color: '#C9D1D9' }}>
              © 2025 Loanify NBFC Ltd. All rights reserved. | RBI Registration: NBFC-ND-SI N-14.03268 | 
              CIN: U65923MH2020PLC123456 | CRISIL Rating: A+
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
