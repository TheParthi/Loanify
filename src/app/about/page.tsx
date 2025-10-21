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
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';

const stats = [
  { label: 'Loans Processed', value: '50,000+', icon: TrendingUp },
  { label: 'Happy Customers', value: '45,000+', icon: Users },
  { label: 'Years of Experience', value: '15+', icon: Award },
  { label: 'Success Rate', value: '98%', icon: CheckCircle }
];

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast Processing',
    description: 'Get loan approvals in under 2 minutes with our AI-powered evaluation system'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your data is protected with military-grade encryption and RBI compliance'
  },
  {
    icon: Globe,
    title: 'Pan-India Presence',
    description: 'Serving customers across all major cities and towns in India'
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Dedicated support team available 24/7 to assist with your needs'
  }
];

const team = [
  {
    name: 'Parthiban',
    role: 'CEO & Founder',
    image: '/team/parthiban.jpg',
    description: 'Visionary leader with 2+ years experience in fintech innovation'
  },
  {
    name: 'Ponmadhan',
    role: 'CTO',
    image: '/team/ponmadhan.jpg',
    description: 'Technology expert driving AI-powered lending solutions'
  },
  {
    name: 'Prem',
    role: 'COO',
    image: '/team/prem.jpg',
    description: 'Operations specialist ensuring seamless customer experience'
  },
  {
    name: 'Shakhib Akthar',
    role: 'Head of Risk and Operations',
    image: '/team/shakhib.jpg',
    description: 'Risk management expert ensuring responsible lending practices'
  }
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gold-500/20 text-gold-400 border-gold-400/30">
              <Award className="h-4 w-4 mr-2" />
              RBI Licensed NBFC
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Transforming Lives Through
              <span className="text-gold-400"> Smart Lending</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              We're revolutionizing the lending industry with AI-powered solutions, 
              making loans accessible, transparent, and lightning-fast for millions of Indians.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                asChild 
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900"
              >
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-navy-900"
                onClick={() => {
                  alert('Our Story:\n\nFounded in 2022, Loanify emerged from a vision to democratize lending in India. Starting with a small team of passionate technologists, we\'ve grown to serve thousands of customers across the country. Our journey is driven by innovation, transparency, and a commitment to financial inclusion for all.');
                }}
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-navy-600" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Driving financial inclusion through innovative technology and responsible lending practices
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed">
                    To democratize access to credit by leveraging cutting-edge AI technology, 
                    ensuring every deserving individual and business gets the financial support 
                    they need to achieve their dreams and contribute to India's growth story.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed">
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Loanify?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We combine the best of technology and human expertise to deliver exceptional lending experiences
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experienced professionals dedicated to revolutionizing the lending industry
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-navy-500 to-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-navy-600 font-medium mb-3">{member.role}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-navy-800 to-navy-900">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience the Future of Lending?</h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of satisfied customers who trust Loanify for their financial needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900">
                <Link href="/login" className="gap-2">
                  Get Started Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-navy-900">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}