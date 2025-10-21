'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Calculator,
  Shield,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface EligibilityData {
  monthlyIncome: number;
  existingEmi: number;
  creditScore: number;
  loanAmount: number;
  employmentType: string;
}

interface EligibilityResult {
  eligible: boolean;
  score: number;
  maxLoanAmount: number;
  recommendedEmi: number;
  interestRate: number;
  reasons: string[];
  rbiCompliance: boolean;
}

export function CustomerEligibilityChecker() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EligibilityData>({
    monthlyIncome: 0,
    existingEmi: 0,
    creditScore: 0,
    loanAmount: 0,
    employmentType: 'salaried'
  });
  const [result, setResult] = useState<EligibilityResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateEligibility = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // RBI-compliant eligibility calculation
    const { monthlyIncome, existingEmi, creditScore, loanAmount, employmentType } = formData;
    
    // Calculate EMI-to-Income ratio (RBI guideline: max 50-60%)
    const proposedEmi = loanAmount / 60; // Assuming 5-year tenure
    const totalEmi = existingEmi + proposedEmi;
    const emiRatio = (totalEmi / monthlyIncome) * 100;
    
    // Calculate maximum eligible loan amount
    const maxEmiAllowed = monthlyIncome * 0.5; // 50% of income
    const availableEmi = maxEmiAllowed - existingEmi;
    const maxLoanAmount = Math.max(0, availableEmi * 60);
    
    // Determine eligibility based on RBI guidelines
    let eligible = true;
    let score = 100;
    const reasons: string[] = [];
    
    // Credit score check (RBI minimum: 650-700)
    if (creditScore < 650) {
      eligible = false;
      score -= 40;
      reasons.push('Credit score below minimum requirement (650)');
    } else if (creditScore < 700) {
      score -= 20;
      reasons.push('Credit score could be improved for better rates');
    }
    
    // EMI ratio check
    if (emiRatio > 60) {
      eligible = false;
      score -= 30;
      reasons.push('EMI-to-income ratio exceeds RBI limit (60%)');
    } else if (emiRatio > 50) {
      score -= 15;
      reasons.push('High EMI-to-income ratio may affect approval');
    }
    
    // Income stability check
    if (monthlyIncome < 25000) {
      eligible = false;
      score -= 20;
      reasons.push('Minimum income requirement not met (₹25,000)');
    }
    
    // Loan amount vs income check
    const loanToIncomeRatio = loanAmount / (monthlyIncome * 12);
    if (loanToIncomeRatio > 10) {
      eligible = false;
      score -= 25;
      reasons.push('Loan amount too high relative to annual income');
    }
    
    // Interest rate calculation based on credit score
    let interestRate = 24; // Base rate
    if (creditScore >= 800) interestRate = 10.5;
    else if (creditScore >= 750) interestRate = 12.5;
    else if (creditScore >= 700) interestRate = 15.5;
    else if (creditScore >= 650) interestRate = 18.5;
    
    // Add positive factors
    if (employmentType === 'salaried') {
      score += 10;
      reasons.push('Salaried employment provides stability');
    }
    
    if (emiRatio < 30) {
      score += 15;
      reasons.push('Excellent EMI-to-income ratio');
    }
    
    if (creditScore >= 750) {
      reasons.push('Excellent credit score qualifies for best rates');
    }
    
    score = Math.max(0, Math.min(100, score));
    
    setResult({
      eligible,
      score,
      maxLoanAmount,
      recommendedEmi: Math.round(proposedEmi),
      interestRate,
      reasons,
      rbiCompliance: emiRatio <= 60 && creditScore >= 650 && monthlyIncome >= 25000
    });
    
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof EligibilityData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
    }));
  };

  const resetForm = () => {
    setResult(null);
    setFormData({
      monthlyIncome: 0,
      existingEmi: 0,
      creditScore: 0,
      loanAmount: 0,
      employmentType: 'salaried'
    });
  };

  if (result) {
    return (
      <div className="space-y-6">
        {/* Result Header */}
        <div className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            result.eligible ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {result.eligible ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h3 className={`text-2xl font-bold mb-2 ${
            result.eligible ? 'text-green-700' : 'text-red-700'
          }`}>
            {result.eligible ? 'Congratulations! You\'re Eligible' : 'Not Eligible'}
          </h3>
          <p className="text-gray-600">
            {result.eligible 
              ? 'Your loan application meets RBI compliance requirements'
              : 'Your application doesn\'t meet current RBI guidelines'
            }
          </p>
        </div>

        {/* Eligibility Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Eligibility Score</h4>
              <Badge variant={result.rbiCompliance ? 'default' : 'destructive'}>
                <Shield className="h-3 w-3 mr-1" />
                {result.rbiCompliance ? 'RBI Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Score</span>
                <span className="font-medium">{result.score}/100</span>
              </div>
              <Progress value={result.score} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Loan Details */}
        {result.eligible && (
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold">Maximum Loan Amount</h4>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₹{result.maxLoanAmount.toLocaleString()}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold">Interest Rate</h4>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {result.interestRate}% p.a.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assessment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={resetForm} variant="outline" className="flex-1">
            Check Again
          </Button>
          {result.eligible && (
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Apply Now
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calculator className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">RBI-Compliant Eligibility Check</h3>
        <p className="text-gray-600">Get instant loan eligibility assessment based on RBI guidelines</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome">Monthly Income (₹) *</Label>
          <Input
            id="monthlyIncome"
            type="number"
            placeholder="e.g., 50000"
            value={formData.monthlyIncome || ''}
            onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="existingEmi">Existing Monthly EMI (₹)</Label>
          <Input
            id="existingEmi"
            type="number"
            placeholder="e.g., 5000"
            value={formData.existingEmi || ''}
            onChange={(e) => handleInputChange('existingEmi', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="creditScore">Credit Score *</Label>
          <Input
            id="creditScore"
            type="number"
            placeholder="e.g., 750"
            min="300"
            max="900"
            value={formData.creditScore || ''}
            onChange={(e) => handleInputChange('creditScore', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="loanAmount">Desired Loan Amount (₹) *</Label>
          <Input
            id="loanAmount"
            type="number"
            placeholder="e.g., 500000"
            value={formData.loanAmount || ''}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employmentType">Employment Type</Label>
        <select
          id="employmentType"
          value={formData.employmentType}
          onChange={(e) => handleInputChange('employmentType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="salaried">Salaried</option>
          <option value="self-employed">Self Employed</option>
          <option value="business">Business Owner</option>
        </select>
      </div>

      <Button 
        onClick={calculateEligibility}
        disabled={isLoading || !formData.monthlyIncome || !formData.creditScore || !formData.loanAmount}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Calculating Eligibility...
          </div>
        ) : (
          <>
            <Calculator className="h-4 w-4 mr-2" />
            Check Eligibility
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        <Shield className="h-3 w-3 inline mr-1" />
        Assessment based on RBI guidelines for responsible lending
      </div>
    </div>
  );
}