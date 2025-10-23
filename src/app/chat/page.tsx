'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Send,
  Bot,
  User,
  ArrowDown,
  Sparkles,
  TrendingUp,
  Shield,
  Clock,
  FileCheck,
  Building2,
  CheckCircle2,
  Info
} from 'lucide-react';
import Image from 'next/image';

// NBFC RBI Compliance Data
const NBFC_RBI_DATA = {
  loanProducts: {
    personal: {
      rate: '10.99% - 24.99%',
      maxAmount: '₹25,00,000',
      tenure: '12-84 months',
      processing: '0.5% - 2%',
      eligibility: 'Salaried/Self-employed, Age 21-65, Min income ₹25,000'
    },
    business: {
      rate: '12.50% - 22.99%',
      maxAmount: '₹1,00,00,000',
      tenure: '12-120 months',
      processing: '1% - 3%',
      eligibility: 'Business vintage 2+ years, ITR filing, GST registration'
    },
    msme: {
      rate: '11.99% - 20.99%',
      maxAmount: '₹50,00,000',
      tenure: '12-96 months',
      processing: '1% - 2.5%',
      eligibility: 'MSME certificate, Business vintage 1+ year'
    }
  },
  rbiCompliance: {
    registration: 'RBI Registration No: N-14.03268',
    fairPractices: 'Adherence to Fair Practices Code as per RBI Master Direction',
    interestRates: 'Interest rates disclosed upfront, no hidden charges',
    grievance: 'Nodal Officer appointed for complaint resolution',
    recovery: 'Recovery agents follow RBI guidelines, no harassment',
    dataProtection: 'Customer data protection as per RBI cybersecurity framework'
  },
  applicationProcess: {
    step1: 'Online application with basic details',
    step2: 'Document upload and verification',
    step3: 'Credit assessment and underwriting',
    step4: 'Loan approval and sanction letter',
    step5: 'Agreement execution and disbursal'
  },
  eligibilityMatrix: {
    salaried: {
      minAge: 21, maxAge: 65,
      minIncome: 25000,
      minCreditScore: 650,
      workExperience: '6 months current job'
    },
    selfEmployed: {
      minAge: 25, maxAge: 65,
      minIncome: 40000,
      minCreditScore: 700,
      businessVintage: '2 years minimum'
    }
  }
};

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Welcome to Loanify NBFC! I\'m your dedicated AI assistant specializing in RBI-compliant loan solutions. I can help you with:\n\n• Loan eligibility assessment\n• Interest rates & EMI calculations\n• Document requirements\n• Application process guidance\n• RBI compliance information\n\nWhat specific loan assistance do you need today?',
      time: new Date().toLocaleTimeString(),
      category: 'welcome'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const quickQuestions = [
    { text: 'Personal Loan Eligibility & Rates', category: 'personal' },
    { text: 'Business Loan Requirements', category: 'business' },
    { text: 'MSME Loan Guidelines', category: 'msme' },
    { text: 'Document Checklist', category: 'documents' },
    { text: 'Application Process Steps', category: 'process' },
    { text: 'RBI Compliance & Fair Practices', category: 'compliance' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
      setShowScrollButton(!isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      message: inputMessage,
      time: new Date().toLocaleTimeString(),
      category: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    const currentInput = inputMessage;
    setInputMessage('');

    setTimeout(async () => {
      const aiResponse = await getAdvancedAIResponse(currentInput);
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot' as const,
        message: aiResponse.message,
        time: new Date().toLocaleTimeString(),
        category: aiResponse.category
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const getAdvancedAIResponse = async (question: string): Promise<{ message: string; category: string }> => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('personal') || (lowerQuestion.includes('loan') && lowerQuestion.includes('salary'))) {
      return {
        message: `**Personal Loan - Complete Information**\n\n` +
          `**Interest Rate:** ${NBFC_RBI_DATA.loanProducts.personal.rate} per annum\n` +
          `**Maximum Amount:** ${NBFC_RBI_DATA.loanProducts.personal.maxAmount}\n` +
          `**Tenure:** ${NBFC_RBI_DATA.loanProducts.personal.tenure}\n` +
          `**Processing Fee:** ${NBFC_RBI_DATA.loanProducts.personal.processing} of loan amount\n\n` +
          `**Eligibility Requirements:**\n` +
          `• ${NBFC_RBI_DATA.loanProducts.personal.eligibility}\n\n` +
          `**For Salaried Individuals:**\n` +
          `• Age: ${NBFC_RBI_DATA.eligibilityMatrix.salaried.minAge}-${NBFC_RBI_DATA.eligibilityMatrix.salaried.maxAge} years\n` +
          `• Monthly Income: ₹${NBFC_RBI_DATA.eligibilityMatrix.salaried.minIncome.toLocaleString()}+\n` +
          `• Credit Score: ${NBFC_RBI_DATA.eligibilityMatrix.salaried.minCreditScore}+\n` +
          `• Work Experience: ${NBFC_RBI_DATA.eligibilityMatrix.salaried.workExperience}\n\n` +
          `Ready to check your eligibility or calculate EMI?`,
        category: 'personal'
      };
    }
    
    else if (lowerQuestion.includes('business') || lowerQuestion.includes('commercial')) {
      return {
        message: `**Business Loan - Complete Information**\n\n` +
          `**Interest Rate:** ${NBFC_RBI_DATA.loanProducts.business.rate} per annum\n` +
          `**Maximum Amount:** ${NBFC_RBI_DATA.loanProducts.business.maxAmount}\n` +
          `**Tenure:** ${NBFC_RBI_DATA.loanProducts.business.tenure}\n` +
          `**Processing Fee:** ${NBFC_RBI_DATA.loanProducts.business.processing} of loan amount\n\n` +
          `**Eligibility Requirements:**\n` +
          `• ${NBFC_RBI_DATA.loanProducts.business.eligibility}\n\n` +
          `**For Self-Employed:**\n` +
          `• Age: ${NBFC_RBI_DATA.eligibilityMatrix.selfEmployed.minAge}-${NBFC_RBI_DATA.eligibilityMatrix.selfEmployed.maxAge} years\n` +
          `• Monthly Income: ₹${NBFC_RBI_DATA.eligibilityMatrix.selfEmployed.minIncome.toLocaleString()}+\n` +
          `• Credit Score: ${NBFC_RBI_DATA.eligibilityMatrix.selfEmployed.minCreditScore}+\n` +
          `• Business Vintage: ${NBFC_RBI_DATA.eligibilityMatrix.selfEmployed.businessVintage}\n\n` +
          `Would you like to know about required documents or application process?`,
        category: 'business'
      };
    }
    
    else if (lowerQuestion.includes('msme') || lowerQuestion.includes('small business')) {
      return {
        message: `**MSME Loan - Government Backed Scheme**\n\n` +
          `**Interest Rate:** ${NBFC_RBI_DATA.loanProducts.msme.rate} per annum\n` +
          `**Maximum Amount:** ${NBFC_RBI_DATA.loanProducts.msme.maxAmount}\n` +
          `**Tenure:** ${NBFC_RBI_DATA.loanProducts.msme.tenure}\n` +
          `**Processing Fee:** ${NBFC_RBI_DATA.loanProducts.msme.processing} of loan amount\n\n` +
          `**Special Benefits:**\n` +
          `• Lower interest rates for MSME registered businesses\n` +
          `• Collateral-free loans up to ₹10 lakhs\n` +
          `• Quick processing under government scheme\n\n` +
          `**Eligibility:** ${NBFC_RBI_DATA.loanProducts.msme.eligibility}\n\n` +
          `**Required:** Valid MSME/Udyam registration certificate\n\n` +
          `Need help with MSME registration or want to apply?`,
        category: 'msme'
      };
    }
    
    else if (lowerQuestion.includes('document') || lowerQuestion.includes('papers') || lowerQuestion.includes('required')) {
      return {
        message: `**Document Checklist - RBI Compliant**\n\n` +
          `**Identity Documents (Any One):**\n` +
          `• Aadhaar Card with OTP verification\n` +
          `• PAN Card (mandatory for all loans)\n` +
          `• Passport or Voter ID\n\n` +
          `**Address Proof (Any One):**\n` +
          `• Aadhaar Card\n` +
          `• Utility bills (last 3 months)\n` +
          `• Rent agreement with owner's documents\n\n` +
          `**Income Documents:**\n` +
          `**For Salaried:** Salary slips (3 months) + Bank statements (6 months) + Form 16\n` +
          `**For Self-Employed:** ITR (2 years) + P&L statements + Bank statements (12 months)\n\n` +
          `**Additional for Business Loans:**\n` +
          `• GST registration certificate\n` +
          `• Business license/registration\n` +
          `• Partnership deed (if applicable)\n\n` +
          `All documents can be uploaded digitally. Need help with any specific document?`,
        category: 'documents'
      };
    }
    
    else if (lowerQuestion.includes('process') || lowerQuestion.includes('apply') || lowerQuestion.includes('steps')) {
      return {
        message: `**Loan Application Process - 5 Simple Steps**\n\n` +
          `**Step 1:** ${NBFC_RBI_DATA.applicationProcess.step1}\n` +
          `**Step 2:** ${NBFC_RBI_DATA.applicationProcess.step2}\n` +
          `**Step 3:** ${NBFC_RBI_DATA.applicationProcess.step3}\n` +
          `**Step 4:** ${NBFC_RBI_DATA.applicationProcess.step4}\n` +
          `**Step 5:** ${NBFC_RBI_DATA.applicationProcess.step5}\n\n` +
          `**Timeline:**\n` +
          `• Application submission: 5 minutes\n` +
          `• Initial approval: 2 minutes (AI-powered)\n` +
          `• Document verification: 2-4 hours\n` +
          `• Final approval: 24-48 hours\n` +
          `• Disbursal: Same day after agreement\n\n` +
          `**Digital Process:** 100% paperless with e-signature and video KYC\n\n` +
          `Ready to start your application now?`,
        category: 'process'
      };
    }
    
    else if (lowerQuestion.includes('rbi') || lowerQuestion.includes('compliance') || lowerQuestion.includes('regulation')) {
      return {
        message: `**RBI Compliance & Fair Practices**\n\n` +
          `**Our RBI Registration:** ${NBFC_RBI_DATA.rbiCompliance.registration}\n\n` +
          `**Compliance Standards:**\n` +
          `• ${NBFC_RBI_DATA.rbiCompliance.fairPractices}\n` +
          `• ${NBFC_RBI_DATA.rbiCompliance.interestRates}\n` +
          `• ${NBFC_RBI_DATA.rbiCompliance.recovery}\n` +
          `• ${NBFC_RBI_DATA.rbiCompliance.dataProtection}\n\n` +
          `**Customer Protection:**\n` +
          `• ${NBFC_RBI_DATA.rbiCompliance.grievance}\n` +
          `• Cooling-off period for loan cancellation\n` +
          `• No prepayment penalty after 6 months\n` +
          `• Transparent loan pricing with APR disclosure\n\n` +
          `**Regulatory Oversight:** Regular RBI inspections and compliance audits\n\n` +
          `Any specific RBI guideline you'd like to know about?`,
        category: 'compliance'
      };
    }
    
    else {
      return {
        message: `I'm here to help you with NBFC loan solutions. I can provide specific information about:\n\n` +
          `• **Personal Loans** - For salaried individuals\n` +
          `• **Business Loans** - For entrepreneurs and companies\n` +
          `• **MSME Loans** - Government-backed schemes\n` +
          `• **Documentation** - Complete checklist and requirements\n` +
          `• **Application Process** - Step-by-step guidance\n` +
          `• **RBI Compliance** - Regulations and fair practices\n\n` +
          `Please select a topic from above or ask me a specific question about loan requirements, eligibility, or application process.`,
        category: 'general'
      };
    }
  };

  const handleQuickQuestion = (question: { text: string; category: string }) => {
    setInputMessage(question.text);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F4F6F8 0%, #E8F4FD 100%)' }}>
      <header className="bg-white shadow-xl sticky top-0 z-50 border-b-4" style={{ borderColor: '#0047AB' }}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-4">
              <Image 
                src="https://i.postimg.cc/jjf05QN2/Create-a-modern-minimalist-logo-icon-for-a-fintech-AI-platform-focused-on-smart-loan-approvals-and.png"
                alt="Loanify Logo"
                width={56}
                height={56}
                className="w-14 h-14 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Loanify NBFC</h1>
                <p className="text-xs font-medium" style={{ color: '#C9D1D9' }}>AI Assistant</p>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Home</Link>
              <Link href="/about" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>About</Link>
              <Link href="/eligibility" className="font-medium transition-all duration-300 hover:scale-105 hover:text-blue-600" style={{ color: '#1E1E1E' }}>Eligibility</Link>
              <Link href="/chat" className="font-semibold text-lg transition-all duration-300 hover:scale-105" style={{ color: '#0047AB' }}>AI Chat</Link>
            </nav>

            <Link href="/login">
              <Button className="text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                Admin Portal
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-4" style={{ color: '#1E1E1E' }}>NBFC Loan Assistant</h1>
            <p className="text-lg font-medium" style={{ color: '#C9D1D9' }}>
              RBI-Compliant Loan Solutions with AI-Powered Guidance
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="shadow-2xl border-0 rounded-3xl bg-white h-[700px] flex flex-col relative">
                <CardContent className="p-0 flex-1 flex flex-col h-full">
                <div className="p-6 border-b-2" style={{ borderColor: '#C9D1D9', background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">NBFC Loan Specialist</h3>
                      <p className="text-blue-100 text-sm">RBI Registered • AI-Powered • Instant Responses</p>
                    </div>
                    <div className="ml-auto">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        Online
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  ref={chatContainerRef}
                  onScroll={handleScroll}
                  className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth relative"
                  style={{ 
                    scrollbarWidth: 'thin', 
                    scrollbarColor: '#0047AB #F4F6F8',
                    maxHeight: 'calc(100% - 160px)'
                  }}
                >
                  {messages.map((msg) => {
                    const getCategoryIcon = (category: string) => {
                      switch(category) {
                        case 'personal': return <User className="h-4 w-4" />;
                        case 'business': return <Building2 className="h-4 w-4" />;
                        case 'msme': return <TrendingUp className="h-4 w-4" />;
                        case 'documents': return <FileCheck className="h-4 w-4" />;
                        case 'compliance': return <Shield className="h-4 w-4" />;
                        case 'process': return <CheckCircle2 className="h-4 w-4" />;
                        default: return <Info className="h-4 w-4" />;
                      }
                    };

                    return (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}>
                        <div className={`flex items-start gap-4 max-w-3xl ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                            msg.type === 'user' 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                              : 'bg-gradient-to-br from-green-500 to-green-700'
                          }`}>
                            {msg.type === 'user' ? (
                              <User className="h-6 w-6 text-white" />
                            ) : (
                              <Bot className="h-6 w-6 text-white" />
                            )}
                          </div>
                          <div className={`rounded-3xl p-6 shadow-lg max-w-full ${
                            msg.type === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                              : 'bg-white border-2 border-gray-100 text-gray-800'
                          }`}>
                            {msg.type === 'bot' && msg.category !== 'welcome' && (
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                                <div className="text-blue-600">{getCategoryIcon(msg.category)}</div>
                                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                                  {msg.category === 'personal' ? 'Personal Loan' :
                                   msg.category === 'business' ? 'Business Loan' :
                                   msg.category === 'msme' ? 'MSME Loan' :
                                   msg.category === 'documents' ? 'Documentation' :
                                   msg.category === 'compliance' ? 'RBI Compliance' :
                                   msg.category === 'process' ? 'Application Process' : 'Information'}
                                </span>
                              </div>
                            )}
                            <div className="text-sm leading-relaxed whitespace-pre-line">
                              {msg.message}
                            </div>
                            <p className={`text-xs mt-4 flex items-center gap-1 ${
                              msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}>
                              <Clock className="h-3 w-3" />
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-green-500 to-green-700">
                          <Bot className="h-6 w-6 text-white animate-pulse" />
                        </div>
                        <div className="rounded-3xl p-6 bg-white border-2 border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">Analyzing your query...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {showScrollButton && (
                    <div className="absolute bottom-4 right-4 z-10">
                      <Button
                        onClick={scrollToBottom}
                        className="w-10 h-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-600 hover:bg-blue-700"
                      >
                        <ArrowDown className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-6 border-t-2" style={{ borderColor: '#C9D1D9' }}>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about loan eligibility, rates, documents, or RBI guidelines..."
                        className="h-14 border-2 text-base px-4 rounded-2xl shadow-sm focus:shadow-lg transition-all duration-300"
                        style={{ borderColor: '#0047AB' }}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        disabled={isTyping}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      className="h-14 px-6 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: 'linear-gradient(135deg, #0047AB 0%, #00B4D8 100%)' }}
                    >
                      {isTyping ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs mt-2 text-center" style={{ color: '#C9D1D9' }}>
                    🔒 Secure • RBI Compliant • AI-Powered Responses
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 rounded-3xl bg-white mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5" style={{ color: '#0047AB' }} />
                  <h3 className="font-bold" style={{ color: '#1E1E1E' }}>Quick Topics</h3>
                </div>
                <div className="space-y-3">
                  {quickQuestions.map((question, index) => {
                    const getQuestionIcon = (category: string) => {
                      switch(category) {
                        case 'personal': return <User className="h-4 w-4" />;
                        case 'business': return <Building2 className="h-4 w-4" />;
                        case 'msme': return <TrendingUp className="h-4 w-4" />;
                        case 'documents': return <FileCheck className="h-4 w-4" />;
                        case 'compliance': return <Shield className="h-4 w-4" />;
                        case 'process': return <CheckCircle2 className="h-4 w-4" />;
                        default: return <Info className="h-4 w-4" />;
                      }
                    };

                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full text-left justify-start h-auto p-4 border-2 hover:shadow-lg hover:scale-105 transition-all duration-300 bg-white"
                        style={{ borderColor: '#0047AB', color: '#0047AB' }}
                      >
                        <div className="flex items-center gap-3">
                          {getQuestionIcon(question.category)}
                          <span className="text-sm font-medium">{question.text}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 rounded-3xl bg-gradient-to-br from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="font-bold text-green-800">RBI Registered</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Registration: N-14.03268</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Fair Practices Code</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Customer Protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-green-700">Transparent Pricing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
