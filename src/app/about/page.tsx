'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Award, 
  Users, 
  TrendingUp, 
  CheckCircle,
  Star,
  Globe,
  Zap,
  Heart,
  Target,
  Eye,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Loans Processed', value: '50,000+', icon: TrendingUp },
  { label: 'Happy Customers', value: '45,000+', icon: Users },
  { label: 'Years of Experience', value: '4+', icon: Award },
  { label: 'Success Rate', value: '98.5%', icon: CheckCircle }
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Processing',
    description: 'Get loan approvals in under 2 minutes with our AI-powered evaluation system'
  },
  {
    icon: Shield,
    title: 'RBI Compliant Security',
    description: 'Your data is protected with bank-grade encryption and full RBI compliance'
  },
  {
    icon: Globe,
    title: 'Pan-India Presence',
    description: 'Serving customers across all major cities and towns in India'
  },
  {
    icon: Heart,
    title: 'Customer First Approach',
    description: 'Dedicated support team available 24/7 to assist with your financial needs'
  }
];

const team = [
  {
    name: 'Parthiban G',
    role: 'CEO & Founder',
    description: 'Visionary leader with expertise in fintech innovation and AI-driven lending'
  },
  {
    name: 'Ponmadhan R',
    role: 'Chief Technology Officer',
    description: 'Technology expert driving AI-powered lending solutions and digital transformation'
  },
  {
    name: 'Prem Kumar',
    role: 'Chief Operating Officer',
    description: 'Operations specialist ensuring seamless customer experience and process optimization'
  },
  {
    name: 'Shakhib Akthar',
    role: 'Head of Risk & Compliance',
    description: 'Risk management expert ensuring responsible lending and RBI compliance'
  }
];

export default function AboutPage() {
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
                <p className="text-xs font-medium" style={{ color: '#C9D1D9' }}>About Our Company</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Home</Link>
              <Link href="/loans" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Loans</Link>
              <Link href="/eligibility" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Eligibility</Link>
              <Link href="/about" className="font-semibold text-lg transition-all duration-300 hover:scale-105" style={{ color: '#0047AB' }}>About</Link>
              <Link href="/contact" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Contact</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-2 hidden md:flex font-semibold hover:shadow-lg transition-all duration-300" style={{ borderColor: '#0047AB', color: '#0047AB' }}>
                <Phone className="h-4 w-4 mr-2" />
                1800-123-LOAN
              </Button>
              <Link href="/login">
                <Button className="text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-100/30"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #E8F4FD 0%, #FFFFFF 100%)', color: '#0047AB', border: '2px solid #00B4D8' }}>
              <Shield className="h-5 w-5" />
              RBI Licensed NBFC-ND-SI • CRISIL A+ Rated • ISO 27001 Certified
            </div>
            <h1 className="text-7xl font-black mb-8 leading-tight">
              <span style={{ color: '#1E1E1E' }}>Transforming Lives</span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Through Smart</span>
              <br />
              <span style={{ color: '#1E1E1E' }}>Financial Solutions</span>
            </h1>
            <p className="text-2xl mb-10 leading-relaxed font-medium" style={{ color: '#C9D1D9' }}>
              We're revolutionizing India's lending industry with AI-powered solutions,
              <br />making loans accessible, transparent, and lightning-fast for millions.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-6 text-xl font-bold border-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" 
                style={{ borderColor: '#0047AB', color: '#0047AB', background: 'white' }}
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-3xl hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  <stat.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-4xl font-black mb-3" style={{ color: '#0047AB' }}>{stat.value}</h3>
                <p className="text-lg font-semibold" style={{ color: '#C9D1D9' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black mb-6" style={{ color: '#1E1E1E' }}>Our Mission & Vision</h2>
              <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>
                Driving financial inclusion through innovative technology and responsible lending
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F4F6F8 100%)' }}>
                <CardContent className="p-10">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Our Mission</h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#C9D1D9' }}>
                    To democratize access to credit by leveraging cutting-edge AI technology, 
                    ensuring every deserving individual and business gets the financial support 
                    they need to achieve their dreams and contribute to India's growth story.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F4F6F8 100%)' }}>
                <CardContent className="p-10">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-lg" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold mb-6" style={{ color: '#1E1E1E' }}>Our Vision</h3>
                  <p className="text-lg leading-relaxed" style={{ color: '#C9D1D9' }}>
                    To become India's most trusted and innovative NBFC, setting new standards 
                    in digital lending while maintaining the highest levels of transparency, 
                    security, and customer satisfaction in every interaction.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black mb-6" style={{ color: '#1E1E1E' }}>Why Choose Loanify?</h2>
              <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>
                We combine the best of technology and human expertise to deliver exceptional experiences
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F4F6F8 100%)' }}>
                  <CardContent className="p-10">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                        <feature.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E1E1E' }}>{feature.title}</h3>
                        <p className="text-lg leading-relaxed" style={{ color: '#C9D1D9' }}>{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black mb-6" style={{ color: '#1E1E1E' }}>Meet Our Leadership</h2>
              <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>
                Experienced professionals dedicated to revolutionizing the lending industry
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 rounded-3xl overflow-hidden bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: '#1E1E1E' }}>{member.name}</h3>
                    <p className="font-semibold mb-4" style={{ color: '#0047AB' }}>{member.role}</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#C9D1D9' }}>{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 text-white" style={{ background: 'linear-gradient(135deg, #1E1E1E 0%, #0047AB 100%)' }}>
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-black mb-8">Ready to Experience the Future of Lending?</h2>
            <p className="text-2xl mb-12 font-medium" style={{ color: '#C9D1D9' }}>
              Join thousands of satisfied customers who trust Loanify for their financial needs
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105" 
                style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #FFFFFF 100%)', color: '#0047AB' }}
              >
                <Link href="/eligibility" className="flex items-center gap-3">
                  Get Started Today
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="px-10 py-6 text-xl font-bold border-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-900" 
                style={{ borderColor: 'white', color: 'white' }}
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-white" style={{ background: 'linear-gradient(135deg, #1E1E1E 0%, #0047AB 100%)' }}>
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #FFFFFF 100%)' }}>
                  <span className="font-bold text-xl" style={{ color: '#0047AB' }}>L</span>
                </div>
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