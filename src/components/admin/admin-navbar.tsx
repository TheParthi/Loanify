'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Upload, 
  Users, 
  BarChart3, 
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import Image from 'next/image';

const getNavItems = (t: (key: string) => string) => [
  { href: '/admin', icon: Home, label: t('dashboard') || 'Dashboard', badge: null },
  { href: '/admin/upload', icon: Upload, label: t('uploadDocuments') || 'Upload Documents', badge: null },
  { href: '/admin/applicants', icon: Users, label: t('applicants') || 'Applicants', badge: '23' },
  { href: '/admin/reports', icon: BarChart3, label: t('reports') || 'Reports', badge: null },
  { href: '/admin/system-health', icon: Activity, label: t('systemHealth') || 'System Health', badge: null },
];

export function AdminNavbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = getNavItems(t);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-3">
              <Image 
                src="https://i.postimg.cc/MGyDGd6p/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png" 
                alt="Loanify Logo" 
                width={40} 
                height={40} 
                className="w-10 h-10 object-contain" 
              />
              <div>
                <span className="text-xl font-bold text-slate-900">Loanify NBFC</span>
                <span className="block text-xs text-amber-600 font-medium">Admin Portal</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 px-4 py-2 h-9 rounded-lg transition-all ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-1 text-xs bg-slate-100 text-slate-700">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            
            {/* Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden xl:flex gap-2 h-9 px-3"
              onClick={() => {
                const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                } else {
                  router.push('/admin/applicants');
                }
              }}
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search</span>
            </Button>

            {/* Notifications */}
            <Button 
              asChild
              variant="ghost" 
              size="sm" 
              className="relative h-9 w-9 p-0"
            >
              <Link href="/admin/notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </Button>

            {/* Language & Theme */}
            <div className="hidden md:flex items-center gap-1">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            {/* Settings */}
            <Button asChild variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Link href="/admin/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>

            {/* Logout */}
            <Button 
              onClick={handleLogout}
              variant="outline" 
              size="sm" 
              className="gap-2 h-9 px-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{t('logout') || 'Logout'}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden h-9 w-9 p-0"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 h-10 px-4 ${
                        isActive 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              <div className="md:hidden pt-2 mt-2 border-t border-slate-200">
                <div className="flex items-center gap-2 px-4">
                  <LanguageSelector />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}