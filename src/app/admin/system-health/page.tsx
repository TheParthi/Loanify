'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  CheckCircle,
  RefreshCw,
  Zap,
  HardDrive,
  Cpu,
  MemoryStick,
  AlertTriangle
} from 'lucide-react';

export default function SystemHealthPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const metrics = [
    { name: 'CPU Usage', value: 45, status: 'healthy', unit: '%', icon: Cpu },
    { name: 'Memory Usage', value: 67, status: 'warning', unit: '%', icon: MemoryStick },
    { name: 'Disk Usage', value: 23, status: 'healthy', unit: '%', icon: HardDrive },
    { name: 'API Response Time', value: 120, status: 'healthy', unit: 'ms', icon: Zap }
  ];

  const services = [
    { name: 'Authentication Service', status: 'healthy', uptime: '99.9%', responseTime: '45ms' },
    { name: 'Document Processing', status: 'healthy', uptime: '99.7%', responseTime: '230ms' },
    { name: 'AI Evaluation Engine', status: 'warning', uptime: '98.5%', responseTime: '1.2s' },
    { name: 'PDF Generation', status: 'healthy', uptime: '99.8%', responseTime: '180ms' }
  ];

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Health</h1>
            <p className="text-gray-600 mt-1">Monitor system performance and service status</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            <Button 
              onClick={refreshMetrics}
              disabled={isRefreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <metric.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {metric.status}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{metric.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span className="font-medium">{metric.value}{metric.unit}</span>
                  </div>
                  <Progress value={metric.value} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {services.map((service, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <Badge className={getStatusColor(service.status)}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {service.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="font-medium">{service.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time:</span>
                      <span className="font-medium">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">API Requests/min</span>
                <span className="text-sm text-gray-600">1,247</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Database Connections</span>
                <span className="text-sm text-gray-600">23/100</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Active Sessions</span>
                <span className="text-sm text-gray-600">156</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}