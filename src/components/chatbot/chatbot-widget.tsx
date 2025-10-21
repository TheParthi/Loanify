'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Bot, User, ChevronDown } from 'lucide-react';
// Loan-focused AI responses
const getLoanResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Personal Loan queries
  if (lowerMessage.includes('personal loan') || lowerMessage.includes('personal') && lowerMessage.includes('loan')) {
    return `💰 **Personal Loan Information**\n\n✅ **Loan Amount:** ₹50,000 to ₹50,00,000\n✅ **Interest Rate:** Starting from 10.5% p.a.\n✅ **Tenure:** 12 to 60 months\n✅ **Processing Time:** 2 minutes approval\n\n**Required Documents:**\n• Aadhar Card & PAN Card\n• Salary slips (3 months)\n• Bank statements (6 months)\n\n**Apply now for instant approval!** 🚀`;
  }
  
  // Home Loan queries
  if (lowerMessage.includes('home loan') || lowerMessage.includes('house loan') || lowerMessage.includes('property loan')) {
    return `🏠 **Home Loan Information**\n\n✅ **Loan Amount:** Up to ₹5 Crores\n✅ **Interest Rate:** Starting from 8.5% p.a.\n✅ **Tenure:** Up to 30 years\n✅ **LTV Ratio:** Up to 90%\n\n**Features:**\n• No prepayment charges\n• Flexible EMI options\n• Quick property valuation\n\n**Ready to buy your dream home?** 🏡`;
  }
  
  // Business Loan queries
  if (lowerMessage.includes('business loan') || lowerMessage.includes('msme') || lowerMessage.includes('working capital')) {
    return `🏢 **Business Loan Information**\n\n✅ **Loan Amount:** ₹1 Lakh to ₹50 Lakhs\n✅ **Interest Rate:** Starting from 12% p.a.\n✅ **Tenure:** 12 to 84 months\n✅ **Collateral:** Not required\n\n**Perfect for:**\n• Working capital needs\n• Equipment purchase\n• Business expansion\n\n**Grow your business with us!** 📈`;
  }
  
  // EMI Calculator
  if (lowerMessage.includes('emi') || lowerMessage.includes('calculate') || lowerMessage.includes('calculator')) {
    return `🧮 **EMI Calculator**\n\n**Quick EMI Examples:**\n• ₹5 Lakhs @ 10.5% for 3 years = ₹16,134/month\n• ₹10 Lakhs @ 10.5% for 5 years = ₹21,494/month\n• ₹25 Lakhs @ 8.5% for 20 years = ₹21,455/month\n\n**Want exact calculation?**\nShare your loan amount, interest rate, and tenure!\n\n**Formula:** EMI = P × r × (1+r)^n / ((1+r)^n-1)`;
  }
  
  // Eligibility queries
  if (lowerMessage.includes('eligibility') || lowerMessage.includes('eligible') || lowerMessage.includes('qualify')) {
    return `✅ **Loan Eligibility Criteria**\n\n**Personal Loan:**\n• Age: 21-65 years\n• Income: ₹25,000+ per month\n• Credit Score: 650+\n• Employment: 2+ years\n\n**Home Loan:**\n• Age: 21-65 years\n• Income: ₹35,000+ per month\n• Credit Score: 700+\n\n**Check your eligibility in 2 minutes!**\nJust provide your basic details. 🚀`;
  }
  
  // Interest rate queries
  if (lowerMessage.includes('interest') || lowerMessage.includes('rate') || lowerMessage.includes('roi')) {
    return `📊 **Current Interest Rates**\n\n💰 **Personal Loan:** 10.5% - 18% p.a.\n🏠 **Home Loan:** 8.5% - 12% p.a.\n🚗 **Vehicle Loan:** 9% - 15% p.a.\n🏢 **Business Loan:** 12% - 20% p.a.\n\n**Factors affecting rates:**\n• Credit score\n• Income level\n• Loan amount & tenure\n• Employment type\n\n**Get personalized rates now!** ⭐`;
  }
  
  // Document queries
  if (lowerMessage.includes('document') || lowerMessage.includes('papers') || lowerMessage.includes('required')) {
    return `📄 **Required Documents**\n\n**Common Documents:**\n• Aadhar Card (Identity proof)\n• PAN Card (Tax proof)\n• Passport size photos\n\n**Income Proof:**\n• Salary slips (3 months)\n• Bank statements (6 months)\n• ITR (for self-employed)\n\n**Additional (if applicable):**\n• Property documents\n• Business registration\n\n**Upload documents instantly!** 📤`;
  }
  
  // Application process
  if (lowerMessage.includes('apply') || lowerMessage.includes('application') || lowerMessage.includes('process')) {
    return `🚀 **Loan Application Process**\n\n**Step 1:** Fill basic details (2 mins)\n**Step 2:** Upload documents\n**Step 3:** AI verification & approval\n**Step 4:** E-sign loan agreement\n**Step 5:** Instant fund transfer\n\n**Why choose us?**\n✅ 2-minute approval\n✅ Minimal documentation\n✅ Competitive rates\n✅ 24/7 support\n\n**Start your application now!** 🎯`;
  }
  
  // Credit score queries
  if (lowerMessage.includes('credit score') || lowerMessage.includes('cibil') || lowerMessage.includes('credit rating')) {
    return `📈 **Credit Score Information**\n\n**Score Ranges:**\n• 750-900: Excellent (Best rates)\n• 700-749: Good (Standard rates)\n• 650-699: Fair (Higher rates)\n• Below 650: Needs improvement\n\n**Improve your score:**\n• Pay bills on time\n• Keep credit utilization low\n• Don't close old accounts\n• Check report regularly\n\n**We accept scores from 650+!** ✅`;
  }
  
  // Repayment queries
  if (lowerMessage.includes('repay') || lowerMessage.includes('payment') || lowerMessage.includes('tenure')) {
    return `💳 **Repayment Options**\n\n**Flexible Tenures:**\n• Personal Loan: 12-60 months\n• Home Loan: Up to 30 years\n• Business Loan: 12-84 months\n\n**Payment Methods:**\n• Auto-debit (ECS/NACH)\n• Online payment\n• Mobile app\n• Branch payment\n\n**Benefits:**\n• No prepayment penalty\n• EMI holiday options\n• Part payment allowed\n\n**Choose what works for you!** 🎯`;
  }
  
  // Contact and support
  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('call')) {
    return `📞 **Contact Our Experts**\n\n**Phone:** 1800-123-LOAN (5626)\n**Email:** support@loanify.com\n**WhatsApp:** +91 98765-43210\n\n**Office Hours:**\n• Mon-Fri: 9 AM - 7 PM\n• Saturday: 9 AM - 5 PM\n• 24/7 online support\n\n**Coimbatore Offices:**\n• RS Puram (Head Office)\n• Peelamedu, Gandhipuram\n\n**We're here to help!** 🤝`;
  }
  
  // Default response for loan-related queries
  if (lowerMessage.includes('loan') || lowerMessage.includes('money') || lowerMessage.includes('finance') || lowerMessage.includes('credit')) {
    return `🏦 **Welcome to Loanify!**\n\nI can help you with:\n\n💰 **Personal Loans** - Quick & easy\n🏠 **Home Loans** - Dream home awaits\n🚗 **Vehicle Loans** - Drive your choice\n🏢 **Business Loans** - Grow your business\n\n**Quick Actions:**\n• Check eligibility\n• Calculate EMI\n• Apply online\n• Track application\n\n**What interests you most?** 🎯`;
  }
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good')) {
    return `👋 **Hello! Welcome to Loanify!**\n\nI'm your AI loan assistant, ready to help you with:\n\n🚀 **Instant loan approvals**\n💰 **Best interest rates**\n📊 **EMI calculations**\n✅ **Eligibility checks**\n\n**Popular services:**\n• Personal Loans from 10.5%\n• Home Loans from 8.5%\n• Business Loans available\n\n**How can I assist you today?** 😊`;
  }
  
  // Default fallback
  return `🤖 **I'm here to help with loans!**\n\nI can assist you with:\n\n💰 **Loan Information** - Types, rates, eligibility\n🧮 **EMI Calculator** - Calculate monthly payments\n📄 **Documentation** - Required papers\n🚀 **Quick Apply** - Start your application\n\n**Popular questions:**\n• "What's the interest rate for personal loans?"\n• "How to check loan eligibility?"\n• "Calculate EMI for ₹5 lakhs"\n\n**Ask me anything about loans!** 💬`;
};

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! 👋 Welcome to Loanify!\n\n**I can help you with:**\n🚀 **Instant loan application**\n💰 **Check eligibility in 2 minutes**\n📊 **Calculate EMI**\n📞 **Connect with loan expert**\n\nWhat would you like to do today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = getLoanResponse(inputMessage);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: '🔧 **Technical Issue**\n\nSorry, I encountered an error. Please try again or contact our support team at 1800-123-LOAN.\n\n**Alternative ways to reach us:**\n• Email: support@loanify.com\n• WhatsApp: +91 98765-43210\n\nWe\'re here to help! 🤝',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[400px] h-[600px] shadow-2xl z-50 flex flex-col border-0 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Loanify AI Assistant</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-sm text-green-200 font-medium">Online • Ready to help</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-4 space-y-4 relative bg-gradient-to-b from-slate-50 to-white"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white text-slate-900 border border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-3 w-3 text-blue-600" />
                        </div>
                      )}
                      {message.type === 'user' && (
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-3 w-3 text-white" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-line leading-relaxed">{message.content}</div>
                        <p className={`text-xs mt-1 ${
                          message.type === 'user' ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <Bot className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-slate-600">AI is thinking</span>
                        <div className="flex space-x-1 ml-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
              
              {/* Scroll to Bottom Button */}
              {showScrollButton && (
                <button
                  onClick={scrollToBottom}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4 bg-white">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about loans, EMI, eligibility..."
                  className="flex-1 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl h-12 w-12 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">Powered by Loanify AI • Instant loan assistance</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}