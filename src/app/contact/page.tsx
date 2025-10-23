'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  HeadphonesIcon,
  Building
} from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
  };

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
                <p className="text-xs font-medium" style={{ color: '#C9D1D9' }}>Contact Us</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Home</Link>
              <Link href="/about" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>About</Link>
              <Link href="/eligibility" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Eligibility</Link>
              <Link href="/contact" className="font-semibold text-lg transition-all duration-300 hover:scale-105" style={{ color: '#0047AB' }}>Contact</Link>
            </nav>

            <Link href="/login">
              <Button className="text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-black mb-6" style={{ color: '#1E1E1E' }}>Get in Touch</h1>
            <p className="text-2xl font-medium" style={{ color: '#C9D1D9' }}>
              We're here to help with all your financial needs
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <Card className="shadow-2xl border-0 rounded-3xl bg-white">
              <CardContent className="p-10">
                <h2 className="text-3xl font-bold mb-8" style={{ color: '#1E1E1E' }}>Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: '#1E1E1E' }}>Full Name</label>
                      <Input className="h-12 border-2" style={{ borderColor: '#C9D1D9' }} placeholder="Your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2" style={{ color: '#1E1E1E' }}>Phone Number</label>
                      <Input className="h-12 border-2" style={{ borderColor: '#C9D1D9' }} placeholder="Your phone number" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#1E1E1E' }}>Email Address</label>
                    <Input type="email" className="h-12 border-2" style={{ borderColor: '#C9D1D9' }} placeholder="Your email address" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#1E1E1E' }}>Subject</label>
                    <Input className="h-12 border-2" style={{ borderColor: '#C9D1D9' }} placeholder="What can we help you with?" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2" style={{ color: '#1E1E1E' }}>Message</label>
                    <Textarea className="border-2 min-h-32" style={{ borderColor: '#C9D1D9' }} placeholder="Tell us more about your inquiry..." required />
                  </div>
                  <Button type="submit" className="w-full py-4 text-lg font-bold text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="shadow-2xl border-0 rounded-3xl bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                      <Phone className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>Call Us</h3>
                      <p style={{ color: '#C9D1D9' }}>Speak with our experts</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold" style={{ color: '#0047AB' }}>1800-123-LOAN (5626)</p>
                    <p style={{ color: '#C9D1D9' }}>Toll-free customer support</p>
                    <p className="text-sm" style={{ color: '#C9D1D9' }}>Available 24/7 for your convenience</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-2xl border-0 rounded-3xl bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>Email Us</h3>
                      <p style={{ color: '#C9D1D9' }}>Send us your queries</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold" style={{ color: '#2ECC71' }}>support@loanify.com</p>
                    <p style={{ color: '#C9D1D9' }}>General inquiries and support</p>
                    <p className="text-sm" style={{ color: '#C9D1D9' }}>We respond within 24 hours</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-2xl border-0 rounded-3xl bg-white">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)' }}>
                      <Building className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#1E1E1E' }}>Visit Us</h3>
                      <p style={{ color: '#C9D1D9' }}>Our head office</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-semibold" style={{ color: '#F39C12' }}>Loanify NBFC Limited</p>
                    <p style={{ color: '#C9D1D9' }}>
                      123 Business District,<br />
                      Bandra Kurla Complex,<br />
                      Mumbai - 400051, Maharashtra
                    </p>
                    <p className="text-sm" style={{ color: '#C9D1D9' }}>Monday - Saturday: 9:00 AM - 6:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}