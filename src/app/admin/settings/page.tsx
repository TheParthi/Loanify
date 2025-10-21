'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft,
  User,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Database,
  Key,
  Mail
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { LanguageSelector } from '@/components/ui/language-selector';

export default function SettingsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsAlerts: false,
    autoApproval: true,
    riskThreshold: 70,
    sessionTimeout: 30
  });

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account and system preferences</p>
          </div>
        </div>

        <div className="grid gap-6">
          
          {/* Profile Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@loanify.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+91 98765 43210" />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add extra security to your account</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <p className="text-sm text-gray-600">Auto logout after inactivity</p>
                </div>
                <Input 
                  type="number" 
                  className="w-20" 
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Alerts</Label>
                  <p className="text-sm text-gray-600">Critical alerts via SMS</p>
                </div>
                <Switch 
                  checked={settings.smsAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, smsAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto Approval</Label>
                  <p className="text-sm text-gray-600">Enable AI auto-approval for qualified applications</p>
                </div>
                <Switch 
                  checked={settings.autoApproval}
                  onCheckedChange={(checked) => setSettings({...settings, autoApproval: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Risk Threshold (%)</Label>
                  <p className="text-sm text-gray-600">Minimum score for auto-approval</p>
                </div>
                <Input 
                  type="number" 
                  className="w-20" 
                  value={settings.riskThreshold}
                  onChange={(e) => setSettings({...settings, riskThreshold: parseInt(e.target.value)})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Language & Region
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Interface Language</Label>
                  <p className="text-sm text-gray-600">Choose your preferred language</p>
                </div>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
          </div>

        </div>
      </div>
    </div>
  );
}