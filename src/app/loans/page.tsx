'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CreditCard,
  Home,
  Car,
  Briefcase,
  Calculator,
  CheckCircle,
  ArrowRight,
  Phone,
  Lock,
  Shield,
  FileText,
  Clock,
  Users
} from 'lucide-react';

export default function LoansPage() {
  const [selectedLoan, setSelectedLoan] = useState('personal');
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);

  const loanProducts = {
    personal: {
      title: 'Personal Loan',
      icon: CreditCard,
      rate: '10.99%',
      minAmount: '₹50,000',
      maxAmount: '₹40,00,000',
      minTenure: '12 months',
      maxTenure: '84 months',
      features: [
        'No collateral required',
        'Instant approval in 2 minutes',
        'Flexible repayment options',
        'Minimal documentation',
        'Competitive interest rates'
      ],
      eligibility: [
        'Age: 21-65 years',
        'Minimum salary: ₹25,000/month',
        'Credit score: 650+',
        'Employment: Salaried/Self-employed'
      ],
      documents: [
        'Identity proof (Aadhaar/PAN)',
        'Address proof',
        'Income proof (3 months salary slips)',
        'Bank statements (6 months)'
      ]
    },
    home: {
      title: 'Home Loan',
      icon: Home,
      rate: '8.50%',
      minAmount: '₹5,00,000',
      maxAmount: '₹5,00,00,000',
      minTenure: '5 years',
      maxTenure: '30 years',
      features: [
        'Property as collateral',
        'Tax benefits under Section 80C',
        'Balance transfer facility',
        'Top-up loan available',
        'Lowest interest rates'
      ],
      eligibility: [
        'Age: 23-65 years',
        'Minimum income: ₹50,000/month',
        'Credit score: 700+',
        'Property value assessment'
      ],
      documents: [
        'Property documents',
        'Income proof (6 months)',
        'Identity & address proof',
        'Bank statements (12 months)'
      ]
    },
    vehicle: {
      title: 'Vehicle Loan',
      icon: Car,
      rate: '9.25%',
      minAmount: '₹1,00,000',
      maxAmount: '₹1,00,00,000',
      minTenure: '12 months',
      maxTenure: '84 months',
      features: [
        'Vehicle as collateral',
        'Up to 90% financing',
        'Quick processing',
        'Insurance assistance',
        'Flexible EMI options'
      ],
      eligibility: [
        'Age: 21-65 years',
        'Minimum income: ₹30,000/month',
        'Credit score: 650+',
        'Valid driving license'
      ],
      documents: [
        'Vehicle quotation/invoice',
        'Income proof',
        'Identity & address proof',
        'Driving license'
      ]
    },
    business: {
      title: 'Business Loan',
      icon: Briefcase,
      rate: '11.50%',
      minAmount: '₹1,00,000',
      maxAmount: '₹10,00,00,000',
      minTenure: '12 months',
      maxTenure: '120 months',
      features: [
        'Working capital support',
        'Equipment financing',
        'Business expansion',
        'Flexible repayment',
        'Competitive rates'
      ],
      eligibility: [
        'Business vintage: 2+ years',
        'Annual turnover: ₹10L+',
        'Credit score: 700+',
        'Profit for last 2 years'
      ],
      documents: [
        'Business registration',
        'Financial statements (2 years)',
        'ITR (3 years)',
        'Bank statements (12 months)'
      ]
    }
  };

  const calculateEMI = (amount: number, rate: number, months: number) => {
    const monthlyRate = rate / 12 / 100;
    const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const currentLoan = loanProducts[selectedLoan];
  const emi = calculateEMI(loanAmount, parseFloat(currentLoan.rate), tenure);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
      {/* Navigation Header */}
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4" style={{ borderColor: '#0047AB' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loanify NBFC</h1>
                <p className="text-xs font-medium" style={{ color: '#C9D1D9' }}>Loan Products</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Home</Link>
              <Link href="/loans" className="font-semibold text-lg transition-all duration-300 hover:scale-105" style={{ color: '#0047AB' }}>Loans</Link>
              <Link href="/eligibility" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Eligibility</Link>
              <Link href="/about" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>About</Link>
              <Link href="/contact" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Contact</Link>
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
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)', color: '#0047AB', border: '2px solid #00B4D8' }}>
              <Shield className="h-5 w-5" />
              RBI Licensed NBFC-ND-SI • CRISIL A+ Rated
            </div>
            <h1 className="text-6xl font-black mb-6" style={{ color: '#1E1E1E' }}>
              Choose Your Perfect
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loan Solution</span>
            </h1>
            <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>
              Competitive rates, instant approval, and flexible terms for all your financial needs
            </p>
          </div>

          {/* Loan Type Selector */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {Object.entries(loanProducts).map(([key, loan]) => {
              const Icon = loan.icon;
              return (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 border-0 rounded-3xl ${
                    selectedLoan === key ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'
                  }`}
                  style={{ 
                    background: selectedLoan === key 
                      ? 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' 
                      : 'linear-gradient(135deg, #FFFFFF 0%, #F4F6F8 100%)'
                  }}
                  onClick={() => setSelectedLoan(key)}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center`} style={{ 
                      background: selectedLoan === key 
                        ? 'rgba(255,255,255,0.2)' 
                        : 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)'
                    }}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold" style={{ 
                      color: selectedLoan === key ? 'white' : '#1E1E1E' 
                    }}>
                      {loan.title}
                    </h3>
                    <p className="text-lg font-semibold mt-2" style={{ 
                      color: selectedLoan === key ? 'white' : '#0047AB' 
                    }}>
                      From {loan.rate} p.a.
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Selected Loan Details */}
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Loan Information */}
            <div className="space-y-8">
              <Card className="shadow-2xl border-0 rounded-3xl bg-white">
                <CardContent className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                      <currentLoan.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold" style={{ color: '#1E1E1E' }}>{currentLoan.title}</h2>
                      <p className="text-xl font-semibold" style={{ color: '#0047AB' }}>Starting from {currentLoan.rate} per annum</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)' }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#C9D1D9' }}>Loan Amount</p>
                      <p className="text-lg font-bold" style={{ color: '#0047AB' }}>{currentLoan.minAmount} - {currentLoan.maxAmount}</p>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)' }}>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#C9D1D9' }}>Tenure</p>
                      <p className="text-lg font-bold" style={{ color: '#0047AB' }}>{currentLoan.minTenure} - {currentLoan.maxTenure}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Key Features</h3>
                      <div className="space-y-3">
                        {currentLoan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5" style={{ color: '#2ECC71' }} />
                            <span style={{ color: '#1E1E1E' }}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Eligibility Criteria</h3>
                      <div className="space-y-3">
                        {currentLoan.eligibility.map((criteria, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5" style={{ color: '#0047AB' }} />
                            <span style={{ color: '#1E1E1E' }}>{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-4" style={{ color: '#1E1E1E' }}>Required Documents</h3>
                      <div className="space-y-3">
                        {currentLoan.documents.map((doc, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <FileText className="h-5 w-5" style={{ color: '#F39C12' }} />
                            <span style={{ color: '#1E1E1E' }}>{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => window.location.href = `/eligibility?type=${selectedLoan}`}
                    className="w-full mt-8 py-4 text-xl font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                    style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                  >
                    Apply for {currentLoan.title}
                    <ArrowRight className="h-6 w-6 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* EMI Calculator */}
            <div className="space-y-8">
              <Card className="shadow-2xl border-0 rounded-3xl bg-white">
                <CardContent className="p-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
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
                        min="12"
                        max="84"
                        step="6"
                        value={tenure}
                        onChange={(e) => setTenure(parseInt(e.target.value))}
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                        style={{ background: `linear-gradient(to right, #2ECC71 0%, #2ECC71 ${(tenure/84)*100}%, #C9D1D9 ${(tenure/84)*100}%, #C9D1D9 100%)` }}
                      />
                      <div className="flex justify-between text-sm mt-2" style={{ color: '#C9D1D9' }}>
                        <span>12 months</span>
                        <span>84 months</span>
                      </div>
                    </div>

                    <div className="text-center p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #E8F6F3 0%, #FFFFFF 100%)', border: '2px solid #2ECC71' }}>
                      <p className="text-lg font-semibold mb-2" style={{ color: '#1E1E1E' }}>Monthly EMI</p>
                      <p className="text-4xl font-black mb-2" style={{ color: '#2ECC71' }}>₹{emi.toLocaleString()}</p>
                      <p className="text-sm" style={{ color: '#C9D1D9' }}>
                        Total Amount: ₹{(emi * tenure).toLocaleString()}
                      </p>
                      <p className="text-sm" style={{ color: '#C9D1D9' }}>
                        Total Interest: ₹{((emi * tenure) - loanAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="shadow-lg border-0 rounded-2xl bg-white p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3" style={{ color: '#0047AB' }} />
                  <p className="text-2xl font-bold" style={{ color: '#0047AB' }}>2 Min</p>
                  <p className="text-sm" style={{ color: '#C9D1D9' }}>Approval Time</p>
                </Card>
                <Card className="shadow-lg border-0 rounded-2xl bg-white p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3" style={{ color: '#2ECC71' }} />
                  <p className="text-2xl font-bold" style={{ color: '#2ECC71' }}>50K+</p>
                  <p className="text-sm" style={{ color: '#C9D1D9' }}>Customers</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}