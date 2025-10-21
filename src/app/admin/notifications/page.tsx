'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Clock,
  ArrowLeft,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';

const notifications = [
  {
    id: 1,
    type: 'application',
    title: 'New Loan Application',
    message: 'Rajesh Kumar has submitted a new personal loan application for ₹5,00,000',
    time: '2 minutes ago',
    read: false,
    priority: 'high'
  },
  {
    id: 2,
    type: 'approval',
    title: 'Loan Approved',
    message: 'Application LA001 has been automatically approved by AI system',
    time: '15 minutes ago',
    read: false,
    priority: 'medium'
  }
];

export default function NotificationsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [notificationList, setNotificationList] = useState(notifications);

  const getIcon = (type: string) => {
    switch (type) {
      case 'application': return <Bell className="h-5 w-5 text-blue-600" />;
      case 'approval': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        <div className="space-y-4">
          {notificationList.map((notification) => (
            <Card key={notification.id} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {getIcon(notification.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 mb-2">{notification.message}</p>
                    <span className="text-sm text-gray-500">{notification.time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}