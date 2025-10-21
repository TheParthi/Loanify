'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type = 'info', duration = 4000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Search className="h-5 w-5 text-blue-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg ${getStyles()}`}>
        {getIcon()}
        <p className="flex-1 text-sm font-medium">{message}</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className="h-6 w-6 p-0 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Toast manager
let toastId = 0;
const toasts = new Map();

export function showToast(message: string, type: ToastProps['type'] = 'info', duration = 4000) {
  const id = ++toastId;
  
  const toastElement = document.createElement('div');
  document.body.appendChild(toastElement);
  
  const { createRoot } = require('react-dom/client');
  const root = createRoot(toastElement);
  
  const handleClose = () => {
    root.unmount();
    document.body.removeChild(toastElement);
    toasts.delete(id);
  };
  
  root.render(
    <Toast 
      message={message} 
      type={type} 
      duration={duration} 
      onClose={handleClose} 
    />
  );
  
  toasts.set(id, { root, element: toastElement });
  
  return id;
}