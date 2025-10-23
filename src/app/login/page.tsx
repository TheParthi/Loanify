'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Shield, 
  Building, 
  CheckCircle,
  ArrowLeft,
  Globe,
  Phone,
  Mail
} from 'lucide-react';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple admin credentials check
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        name: 'Admin User',
        email: 'admin@loanify.com',
        role: 'Super Admin',
        lastLogin: new Date().toISOString()
      }));
      router.push('/dashboard/admin');
    } else {
      setError('Invalid credentials. Please check your username and password.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="https://i.postimg.cc/jjf05QN2/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png"
                alt="Loanify Logo"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#1E1E1E' }}>Loanify NBFC</h1>
                <p className="text-xs" style={{ color: '#C9D1D9' }}>Admin Portal</p>
              </div>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-2" style={{ borderColor: '#C9D1D9', color: '#1E1E1E' }}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Website
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="text-center pb-8 pt-12">
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#0047AB' }}>
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#1E1E1E' }}>
                  Admin Login
                </h2>
                <p className="text-lg" style={{ color: '#C9D1D9' }}>
                  Secure access to management portal
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-12">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#C9D1D9' }} />
                      <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="pl-10 h-12 border-2 focus:ring-2 bg-white"
                        style={{ 
                          borderColor: '#C9D1D9',
                          color: '#1E1E1E'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold" style={{ color: '#1E1E1E' }}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#C9D1D9' }} />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 h-12 border-2 focus:ring-2 bg-white"
                        style={{ 
                          borderColor: '#C9D1D9',
                          color: '#1E1E1E'
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" style={{ color: '#C9D1D9' }} />
                        ) : (
                          <Eye className="h-5 w-5" style={{ color: '#C9D1D9' }} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm" style={{ color: '#C9D1D9' }}>Remember me</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm hover:underline" style={{ color: '#0047AB' }}>
                      Forgot Password?
                    </Link>
                  </div>

                  {error && (
                    <div className="p-4 rounded-lg border-2" style={{ backgroundColor: '#FEF2F2', borderColor: '#E74C3C', color: '#E74C3C' }}>
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
                    style={{ 
                      backgroundColor: '#0047AB',
                      borderColor: '#0047AB'
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In to Dashboard'}
                  </Button>
                </form>


              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Info Panel */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8" style={{ backgroundColor: '#0047AB' }}>
          <div className="text-white max-w-md">
            <div className="mb-8">
              <Building className="h-16 w-16 mb-6" />
              <h3 className="text-3xl font-bold mb-4">
                Welcome to Loanify Admin Portal
              </h3>
              <p className="text-xl opacity-90 mb-8">
                Manage your NBFC operations with our comprehensive admin dashboard
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Real-time Dashboard</h4>
                  <p className="text-sm opacity-80">Monitor loan applications and approvals in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Document Management</h4>
                  <p className="text-sm opacity-80">Upload, verify and manage customer documents</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Analytics & Reports</h4>
                  <p className="text-sm opacity-80">Generate comprehensive business reports</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Customer Support</h4>
                  <p className="text-sm opacity-80">Handle customer queries and complaints</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-white border-opacity-20">
              <p className="text-sm opacity-80 mb-4">Need help? Contact our support team:</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+91-1800-123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">admin-support@loanify.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
