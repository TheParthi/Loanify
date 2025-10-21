'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageCircle,
  HeadphonesIcon,
  Globe,
  Shield,
  CheckCircle,
  ArrowRight,
  Building,
  Users,
  Award
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { useToast } from '@/hooks/use-toast';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Speak with our loan experts',
    value: '+91 1800-123-4567',
    action: 'Call Now',
    color: 'bg-green-500'
  },
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Get detailed responses',
    value: 'support@loanify.com',
    action: 'Send Email',
    color: 'bg-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Instant support available',
    value: 'Chat with us now',
    action: 'Start Chat',
    color: 'bg-purple-500'
  },
  {
    icon: HeadphonesIcon,
    title: 'WhatsApp',
    description: 'Quick queries & updates',
    value: '+91 98765-43210',
    action: 'Message Us',
    color: 'bg-green-600'
  }
];

const offices = [
  {
    city: 'Coimbatore',
    address: 'RS Puram, Coimbatore - 641002',
    phone: '+91 422-1234-5678',
    type: 'Head Office'
  },
  {
    city: 'Peelamedu',
    address: 'Avinashi Road, Peelamedu, Coimbatore - 641004',
    phone: '+91 422-2345-6789',
    type: 'Branch Office'
  },
  {
    city: 'Gandhipuram',
    address: 'Cross Cut Road, Gandhipuram, Coimbatore - 641012',
    phone: '+91 422-3456-7890',
    type: 'Branch Office'
  },
  {
    city: 'Saibaba Colony',
    address: 'Mettupalayam Road, Saibaba Colony, Coimbatore - 641011',
    phone: '+91 422-4567-8901',
    type: 'Branch Office'
  }
];

const faqs = [
  {
    question: 'How quickly can I get loan approval?',
    answer: 'With our AI-powered system, you can get instant pre-approval in under 2 minutes. Final approval typically takes 24-48 hours after document verification.'
  },
  {
    question: 'What documents do I need?',
    answer: 'Basic documents include Aadhar Card, PAN Card, income proof, and bank statements. Our team will guide you through the complete list based on your loan type.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely! We use bank-grade encryption and are fully RBI compliant. Your personal and financial data is protected with the highest security standards.'
  },
  {
    question: 'What are the interest rates?',
    answer: 'Interest rates start from 10.5% per annum and vary based on your credit profile, loan amount, and tenure. Our AI system ensures you get the best possible rate.'
  }
];

export default function ContactPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    loanType: 'personal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create mailto link with form data
    const emailBody = `Name: ${formData.name}\nPhone: ${formData.phone}\nLoan Type: ${formData.loanType}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:Loanifycustomer@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Simulate form submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: 'Email Client Opened!',
      description: 'Please send the email from your email client.',
    });
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      loanType: 'personal'
    });
    
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gold-500/20 text-gold-400 border-gold-400/30">
              <Shield className="h-4 w-4 mr-2" />
              24/7 Support Available
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Get in Touch with
              <span className="text-gold-400"> Our Experts</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Have questions about loans? Need assistance with your application? 
              Our dedicated team is here to help you every step of the way.
            </p>
            <div className="flex items-center justify-center gap-8 text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Expert Guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Personalized Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Multiple Ways to Reach Us</h2>
              <p className="text-lg text-gray-600">Choose the most convenient way to connect with our team</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <method.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <p className="font-medium text-gray-900 mb-4">{method.value}</p>
                    <Button className="w-full" variant="outline">
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="loanType">Loan Type</Label>
                      <select
                        id="loanType"
                        name="loanType"
                        value={formData.loanType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500"
                      >
                        <option value="personal">Personal Loan</option>
                        <option value="home">Home Loan</option>
                        <option value="business">Business Loan</option>
                        <option value="vehicle">Vehicle Loan</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What can we help you with?"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your requirements..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-navy-600 hover:bg-navy-700 gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations & FAQs */}
            <div className="space-y-8">
              
              {/* Office Locations */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Our Offices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{office.city}</h3>
                        <Badge variant="outline">{office.type}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                      <p className="text-sm font-medium text-navy-600">{office.phone}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 text-green-600">
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">24/7 Online Support Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Quick answers to common questions</p>
            </div>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}