'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTranslation } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (email === 'admin@loanify.gov' && password === 'admin123') {
      toast({
        title: 'Login Successful',
        description: 'Welcome to Loanify Admin Portal',
      });
      router.push('/admin');
    } else {
      toast({
        title: 'Authentication Failed',
        description: 'Invalid credentials. Please contact your bank admin.',
        variant: 'destructive',
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-violet-900">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-violet-600/20 animate-pulse"></div>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <Shield className="w-96 h-96 text-white" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-6 animate-pulse">
              <div className="relative">
                <Shield className="h-12 w-12 text-gold-400 animate-bounce" />
                <div className="absolute inset-0 h-12 w-12 border-2 border-gold-400/30 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t('secureAccess')}</h1>
                <p className="text-sm text-blue-200">{t('adminLogin')}</p>
              </div>
            </div>
          </div>

          <Card className="border-0 backdrop-blur-xl bg-white/10 shadow-2xl rounded-2xl border border-white/20">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image src="/logo.png" alt="Loanify" width={40} height={40} className="h-10 w-10" />
                <div>
                  <CardTitle className="text-xl font-bold text-white">Loanify</CardTitle>
                  <p className="text-xs text-gold-400">NBFC Secure Portal</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-blue-200">
                <Lock className="h-4 w-4" />
                <span className="text-sm font-medium">Authorized Access Only</span>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    {t('email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 rounded-xl focus:border-gold-400 focus:ring-gold-400/20"
                      placeholder="admin@loanify.gov"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    {t('password')}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 rounded-xl focus:border-gold-400 focus:ring-gold-400/20"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-blue-300 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {t('verifyingCredentials')}
                    </div>
                  ) : (
                    t('secureLogin')
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    {t('forgotPassword')}
                  </Link>
                  <Link href="/" className="text-blue-200 hover:text-white transition-colors flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    {t('backToPortal')}
                  </Link>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-blue-200/80">
                    Demo: admin@loanify.gov / admin123
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <p className="text-xs text-blue-200/60 max-w-sm mx-auto leading-relaxed">
              {t('securePortal')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}