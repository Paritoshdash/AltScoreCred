import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, TrendingUp, Calculator } from "lucide-react";

// New interface based on sophisticated financial metrics
interface FinancialInfo {
  name: string;
  income: string;       // Annual Income
  savings: string;      // Total Savings
  debt: string;         // Total Debt (excluding mortgage)
  clothingSpend: string; // Monthly spend on clothing
  educationLevel: string; // 'T_EDUCATION_12' (High School), 'T_EDUCATION_6' (Graduate)
}

// Derived ratios will be calculated within the component
interface FinancialRatios {
  rSavingsIncome: number;
  rClothingIncome: number;
}

interface CreditResult {
  score: number;
  rating: string;
  loanEligibility: {
    approved: boolean;
    maxAmount: number;
    reason: string;
  };
}

const CreditScoreChecker = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo>({
    name: '',
    income: '',
    savings: '',
    debt: '',
    clothingSpend: '',
    educationLevel: ''
  });
  const [ratios, setRatios] = useState<FinancialRatios>({
    rSavingsIncome: 0,
    rClothingIncome: 0,
  });
  const [creditResult, setCreditResult] = useState<CreditResult | null>(null);

  // Effect to calculate ratios in real-time as user types
  useEffect(() => {
    const income = parseFloat(financialInfo.income) || 0;
    const savings = parseFloat(financialInfo.savings) || 0;
    const clothingSpend = parseFloat(financialInfo.clothingSpend) || 0;

    const rSavingsIncome = income > 0 ? savings / income : 0;
    const rClothingIncome = income > 0 ? (clothingSpend * 12) / income : 0;

    setRatios({ rSavingsIncome, rClothingIncome });
  }, [financialInfo.income, financialInfo.savings, financialInfo.clothingSpend]);

  // Accurate calculation based on financial health ratios
  const calculateCreditScore = () => {
    const { income, savings, debt, educationLevel } = financialInfo;
    const { rSavingsIncome, rClothingIncome } = ratios;

    const numIncome = parseFloat(income) || 0;
    const numDebt = parseFloat(debt) || 0;

    let baseScore = 300;

    // Core Factor: Savings-to-Income Ratio (R_SAVINGS_INCOME)
    // This is a strong indicator of financial stability.
    if (rSavingsIncome > 0.5) baseScore += 200;      // Excellent saver
    else if (rSavingsIncome > 0.25) baseScore += 150; // Good saver
    else if (rSavingsIncome > 0.1) baseScore += 75;  // Average saver
    else baseScore += 10;

    // Core Factor: Debt-to-Income Ratio (DTI)
    const dti = numIncome > 0 ? numDebt / numIncome : 1;
    if (dti < 0.2) baseScore += 150;      // Very low debt
    else if (dti < 0.36) baseScore += 100; // Healthy debt level
    else if (dti < 0.43) baseScore += 40;  // Acceptable debt
    else baseScore -= 100;                // High risk

    // Behavioral Factor: Clothing Spend Ratio (R_CLOTHING_INCOME)
    // Indicates discretionary spending habits.
    if (rClothingIncome < 0.05) baseScore += 50; // Frugal
    else if (rClothingIncome < 0.1) baseScore += 20; // Moderate
    else baseScore -= 30; // High discretionary spending

    // Stability Factor: Education Level
    if (educationLevel === 'T_EDUCATION_6') baseScore += 50; // Graduate
    else if (educationLevel === 'T_EDUCATION_12') baseScore += 20; // High School

    // Absolute Income Factor
    if (numIncome > 1500000) baseScore += 50; // High income provides a buffer
    else if (numIncome > 800000) baseScore += 25;

    const score = Math.min(Math.max(baseScore, 300), 850);

    let rating = 'Poor';
    if (score >= 750) rating = 'Excellent';
    else if (score >= 700) rating = 'Good';
    else if (score >= 650) rating = 'Fair';

    // Loan Approval Logic
    let approved = false;
    let reason = "";
    if (score < 640) {
        reason = "Credit score is below the minimum threshold.";
    } else if (dti > 0.43) {
        reason = "Debt-to-income ratio is too high.";
    } else if (rSavingsIncome < 0.1) {
        reason = "Savings are low relative to income.";
    } else {
        approved = true;
        reason = "Profile meets lending criteria.";
    }

    const maxLoanAmount = approved ? Math.floor(Math.max(0, (numIncome * 0.36 - numDebt) * 2) / 10000) * 10000 : 0;

    setCreditResult({
      score,
      rating,
      loanEligibility: {
        approved,
        maxAmount: maxLoanAmount,
        reason
      }
    });
    
    setStep('results');
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return 'green-500';
    if (score >= 700) return 'blue-500';
    if (score >= 650) return 'yellow-500';
    return 'red-500';
  };
  
  const getBadgeVariant = (score: number) => {
    if (score >= 750) return 'success';
    if (score >= 700) return 'info';
    if (score >= 650) return 'warning';
    return 'destructive';
  }

  if (step === 'results' && creditResult) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card className="bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Financial Health Report</CardTitle>
            <CardDescription>Analysis for {financialInfo.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-7xl font-bold mb-2 text-${getScoreColor(creditResult.score)}`}>
                {creditResult.score}
              </div>
              <Badge variant={getBadgeVariant(creditResult.score)} className="text-lg px-4 py-1">
                {creditResult.rating}
              </Badge>
              <Progress 
                value={(creditResult.score - 300) / (850 - 300) * 100} 
                className="mt-4 h-3"
              />
              <p className="text-sm text-muted-foreground mt-2">Financial Score Range: 300-850</p>
            </div>
            
            <div className="grid gap-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Loan Eligibility Analysis
              </h3>
              
              <Card className={`p-4 ${creditResult.loanEligibility.approved ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
                <div className="flex items-center gap-2 mb-2">
                    {creditResult.loanEligibility.approved ? <CheckCircle className="h-6 w-6 text-green-600"/> : <AlertCircle className="h-6 w-6 text-red-600"/>}
                    <span className="font-bold text-lg">{creditResult.loanEligibility.approved ? 'Loan Approved' : 'Loan Declined'}</span>
                </div>
                <p className="text-muted-foreground">{creditResult.loanEligibility.reason}</p>
              </Card>

              <Card className="p-4 bg-secondary">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Estimated Maximum Loan Amount</span>
                </div>
                <p className="text-3xl font-bold text-primary">
                  ₹{creditResult.loanEligibility.maxAmount.toLocaleString('en-IN')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on a healthy debt-to-income ratio.
                </p>
              </Card>
            </div>
            
            <Button 
              onClick={() => setStep('form')} 
              variant="outline" 
              className="w-full"
            >
              Run Another Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Financial Health & Credit Checker</CardTitle>
        <CardDescription>
          Enter your financial details for an accurate, data-driven analysis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Enter your full name" value={financialInfo.name} onChange={(e) => setFinancialInfo({...financialInfo, name: e.target.value})} />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="income">Annual Income (₹)</Label>
                <Input id="income" type="number" placeholder="e.g., 1200000" value={financialInfo.income} onChange={(e) => setFinancialInfo({...financialInfo, income: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="savings">Total Savings (₹)</Label>
                <Input id="savings" type="number" placeholder="e.g., 500000" value={financialInfo.savings} onChange={(e) => setFinancialInfo({...financialInfo, savings: e.target.value})} />
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="debt">Total Debt (₹)</Label>
                <Input id="debt" type="number" placeholder="All loans except home loan" value={financialInfo.debt} onChange={(e) => setFinancialInfo({...financialInfo, debt: e.target.value})} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="clothingSpend">Monthly Clothing Spend (₹)</Label>
                <Input id="clothingSpend" type="number" placeholder="e.g., 4000" value={financialInfo.clothingSpend} onChange={(e) => setFinancialInfo({...financialInfo, clothingSpend: e.target.value})} />
            </div>
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="education">Highest Education</Label>
            <Select value={financialInfo.educationLevel} onValueChange={(value) => setFinancialInfo({...financialInfo, educationLevel: value})}>
                <SelectTrigger><SelectValue placeholder="Select education level" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="T_EDUCATION_6">Graduate or Higher</SelectItem>
                    <SelectItem value="T_EDUCATION_12">High School / Below</SelectItem>
                </SelectContent>
            </Select>
        </div>

        {/* Real-time calculated ratios display */}
        <Card className="p-4 bg-muted">
            <h4 className="font-semibold mb-2">Calculated Ratios</h4>
            <div className="flex justify-between text-sm">
                <span>Savings / Income Ratio:</span>
                <span className="font-mono">{(ratios.rSavingsIncome * 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
                <span>Clothing Spend / Income Ratio:</span>
                <span className="font-mono">{(ratios.rClothingIncome * 100).toFixed(2)}%</span>
            </div>
        </Card>
        
        <Button 
          onClick={calculateCreditScore} 
          className="w-full mt-6"
          disabled={Object.values(financialInfo).some(value => value === '')}
        >
          Analyze Financial Health
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreditScoreChecker;
