'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  MessageCircle, 
  Send, 
  X, 
  Calculator,
  CheckCircle,
  FileText,
  Phone,
  Minimize2
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon?: React.ReactNode;
}

export function LoanifyChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          `🏦 Welcome to Loanify AI!\nI can help you with:\n💰 Personal Loans – Quick & easy\n🏠 Home Loans – Your dream home awaits\n🚗 Vehicle Loans – Drive your choice\n🏢 Business Loans – Grow your business\n\nHow can I assist you today? 🎯`,
          [
            { label: 'Check Eligibility', action: 'eligibility', icon: <CheckCircle className="h-4 w-4" /> },
            { label: 'Calculate EMI', action: 'emi', icon: <Calculator className="h-4 w-4" /> },
            { label: 'RBI Criteria', action: 'rbi', icon: <FileText className="h-4 w-4" /> },
            { label: 'Connect Officer', action: 'officer', icon: <Phone className="h-4 w-4" /> }
          ]
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, quickActions?: QuickAction[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date(),
      quickActions
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    addUserMessage(inputValue);
    const userQuery = inputValue.toLowerCase();
    setInputValue('');
    
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(userQuery);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      handleBotResponse(action);
    }, 1000);
  };

  const handleBotResponse = (query: string) => {
    let response = '';
    let quickActions: QuickAction[] = [];

    if (query.includes('eligibility') || query === 'eligibility') {
      response = `📋 **Loan Eligibility Check**\n\nTo check your eligibility, I need:\n• Monthly Income\n• Credit Score\n• Existing EMIs\n• Employment Type\n\nWould you like me to guide you through the eligibility calculator? 🎯`;
      quickActions = [
        { label: 'Start Calculator', action: 'start_calc', icon: <Calculator className="h-4 w-4" /> },
        { label: 'View Requirements', action: 'requirements', icon: <FileText className="h-4 w-4" /> }
      ];
    } else if (query.includes('emi') || query === 'emi') {
      response = `🧮 **EMI Calculator**\n\nI can help calculate your EMI for:\n• Personal Loans (10.5% - 24%)\n• Home Loans (8.5% - 12%)\n• Vehicle Loans (9% - 15%)\n• Business Loans (12% - 20%)\n\nWhich loan type interests you? 💡`;
      quickActions = [
        { label: 'Personal Loan EMI', action: 'personal_emi', icon: <Calculator className="h-4 w-4" /> },
        { label: 'Home Loan EMI', action: 'home_emi', icon: <Calculator className="h-4 w-4" /> }
      ];
    } else if (query.includes('rbi') || query === 'rbi') {
      response = `🏛️ **RBI Loan Guidelines**\n\n**Key Criteria:**\n• Credit Score: 750+ (Preferred)\n• Income Proof: Last 3 months\n• Debt-to-Income: <40%\n• Age: 21-65 years\n• Employment: 2+ years\n\n**Required Documents:**\n• Aadhar & PAN Card\n• Salary Slips\n• Bank Statements\n• Employment Certificate`;
      quickActions = [
        { label: 'Document Checklist', action: 'documents', icon: <FileText className="h-4 w-4" /> },
        { label: 'Apply Now', action: 'apply', icon: <CheckCircle className="h-4 w-4" /> }
      ];
    } else if (query.includes('officer') || query === 'officer') {
      response = `📞 **Connect with Loan Officer**\n\n**Available Options:**\n• Call: +91-9876543210\n• WhatsApp: +91-9876543210\n• Email: loans@loanify.com\n• Branch Visit: Book Appointment\n\n**Business Hours:**\nMon-Sat: 9:00 AM - 6:00 PM\nSun: 10:00 AM - 4:00 PM\n\nWould you like me to schedule a callback? 📅`;
      quickActions = [
        { label: 'Schedule Callback', action: 'callback', icon: <Phone className="h-4 w-4" /> },
        { label: 'Find Branch', action: 'branch', icon: <FileText className="h-4 w-4" /> }
      ];
    } else if (query.includes('personal') || query.includes('home') || query.includes('vehicle') || query.includes('business')) {
      const loanType = query.includes('personal') ? 'Personal' : 
                     query.includes('home') ? 'Home' : 
                     query.includes('vehicle') ? 'Vehicle' : 'Business';
      
      response = `💰 **${loanType} Loan Details**\n\n**Features:**\n• Quick approval in 24-48 hours\n• Minimal documentation\n• Competitive interest rates\n• Flexible repayment options\n\n**Next Steps:**\n1. Check eligibility\n2. Upload documents\n3. Get instant approval\n\nReady to proceed? 🚀`;
      quickActions = [
        { label: 'Check Eligibility', action: 'eligibility', icon: <CheckCircle className="h-4 w-4" /> },
        { label: 'Apply Online', action: 'apply', icon: <FileText className="h-4 w-4" /> }
      ];
    } else if (query.includes('apply') || query === 'apply') {
      response = `🎯 **Online Application**\n\nGreat choice! Here's what you need:\n\n**Step 1:** Personal Details\n**Step 2:** Income Information\n**Step 3:** Document Upload\n**Step 4:** Verification\n**Step 5:** Approval & Disbursal\n\nThe entire process takes 2-3 business days. Ready to start? 📝`;
      quickActions = [
        { label: 'Start Application', action: 'start_app', icon: <FileText className="h-4 w-4" /> },
        { label: 'Document List', action: 'documents', icon: <FileText className="h-4 w-4" /> }
      ];
    } else {
      response = `🤔 I understand you're asking about "${query}". \n\nI'm here to help with:\n• Loan eligibility & applications\n• EMI calculations\n• Document requirements\n• Interest rates & terms\n• RBI guidelines\n\nCould you please be more specific about what you'd like to know? 💡`;
      quickActions = [
        { label: 'Check Eligibility', action: 'eligibility', icon: <CheckCircle className="h-4 w-4" /> },
        { label: 'Calculate EMI', action: 'emi', icon: <Calculator className="h-4 w-4" /> }
      ];
    }

    addBotMessage(response, quickActions);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Chat Widget Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <div className="relative">
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <MessageCircle className="h-6 w-6 text-white" />
            </Button>
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">!</span>
            </div>
            {/* Floating Tooltip */}
            <div className="absolute bottom-16 right-0 bg-slate-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              Need help with loans? Chat with AI! 💬
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] animate-in slide-in-from-bottom-4 slide-in-from-right-4 duration-300">
          <Card className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white shadow-2xl border-0 rounded-2xl overflow-hidden backdrop-blur-sm">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold">L</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Loanify AI Assistant</h3>
                    <p className="text-xs text-blue-100 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Online • Ready to help
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 p-0 text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
              {messages.map((message, index) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`max-w-[80%] ${message.isBot ? 'order-2' : ''}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-2 order-1 shadow-sm">
                        <span className="text-xs font-bold text-blue-600">AI</span>
                      </div>
                    )}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                        message.isBot
                          ? 'bg-white border border-slate-200 text-slate-800 hover:border-blue-200'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    </div>
                    
                    {/* Quick Actions */}
                    {message.quickActions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.quickActions.map((action, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickAction(action.action)}
                            className="h-8 text-xs bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800"
                          >
                            {action.icon}
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-slate-400 mt-2">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      <span className="text-xs font-bold text-blue-600">AI</span>
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <span className="ml-2 text-xs text-slate-500">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 bg-white">
              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-500 mb-2">Quick questions:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'What is EMI?',
                      'Loan interest rates?',
                      'How to apply?',
                      'Required documents?'
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setInputValue(suggestion);
                          setTimeout(() => handleSend(), 100);
                        }}
                        className="text-xs px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-full transition-colors duration-200"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                    placeholder="Ask about loans, EMI, eligibility…"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
                    disabled={isTyping}
                  />
                  {inputValue && (
                    <button
                      onClick={() => setInputValue('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-400 mt-2 text-center">
                Powered by Loanify AI • Always here to help 🤖
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
