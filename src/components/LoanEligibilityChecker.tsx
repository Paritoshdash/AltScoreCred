import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Clock, User, Book, IndianRupee } from "lucide-react";

interface LoanApplication {
  gender: string;
  married: string;
  dependents: string;
  education: string;
  loanAmount: string;
  loanAmountTerm: string;
  creditHistory: string;
  totalIncome: string;
}

interface LoanEligibilityResult {
  approved: boolean;
  probability: number;
  reasons: string[];
  suggestedLoanAmount?: number;
  suggestedTerm?: number;
}

const LoanEligibilityChecker = () => {
  const [application, setApplication] = useState<LoanApplication>({
    gender: '',
    married: '',
    dependents: '',
    education: '',
    loanAmount: '',
    loanAmountTerm: '',
    creditHistory: '',
    totalIncome: ''
  });
  const [result, setResult] = useState<LoanEligibilityResult | null>(null);

  const calculateEligibility = () => {
    const {
      gender,
      married,
      dependents,
      education,
      loanAmount,
      loanAmountTerm,
      creditHistory,
      totalIncome
    } = application;

    // Convert all inputs to numbers where needed
    const numLoanAmount = parseFloat(loanAmount) || 0;
    const numLoanTerm = parseFloat(loanAmountTerm) || 0;
    const numTotalIncome = parseFloat(totalIncome) || 0;
    const numCreditHistory = parseFloat(creditHistory) || 0;
    const numDependents = parseInt(dependents) || 0;

    // Initialize probability and reasons
    let probability = 0.5; // Base probability
    const reasons: string[] = [];

    // 1. Credit History (Most important factor)
    if (numCreditHistory === 1) {
      probability += 0.3;
      reasons.push("Excellent credit history");
    } else {
      probability -= 0.4;
      reasons.push("No credit history or poor credit history");
    }

    // 2. Loan Amount to Income Ratio
    const loanToIncomeRatio = numTotalIncome > 0 ? numLoanAmount / numTotalIncome : 0;
    if (loanToIncomeRatio < 0.3) {
      probability += 0.15;
      reasons.push("Loan amount is conservative relative to income");
    } else if (loanToIncomeRatio < 0.5) {
      probability += 0.05;
      reasons.push("Loan amount is moderate relative to income");
    } else {
      probability -= 0.2;
      reasons.push("Loan amount is high relative to income");
    }

    // 3. Education Level
    if (education === 'Graduate') {
      probability += 0.05;
      reasons.push("Graduate education improves chances");
    }

    // 4. Marital Status
    if (married === 'Yes') {
      probability += 0.03;
      reasons.push("Married applicants have slightly better chances");
    }

    // 5. Dependents
    if (numDependents === 0) {
      probability += 0.05;
      reasons.push("No dependents improves repayment capacity");
    } else if (numDependents > 2) {
      probability -= 0.05;
      reasons.push("More than 2 dependents reduces repayment capacity");
    }

    // 6. Loan Term
    if (numLoanTerm >= 180 && numLoanTerm <= 360) {
      probability += 0.02;
      reasons.push("Loan term is within standard range");
    } else if (numLoanTerm < 180) {
      probability -= 0.05;
      reasons.push("Short loan term increases EMI burden");
    }

    // 7. Gender (small bias based on historical data)
    if (gender === 'Female') {
      probability += 0.02;
      reasons.push("Female applicants have slightly better repayment history");
    }

    // Cap probability between 0 and 1
    probability = Math.max(0, Math.min(1, probability));

    // Determine approval
    const approved = probability >= 0.7;

    // Calculate suggested loan amount if not approved
    let suggestedLoanAmount: number | undefined;
    let suggestedTerm: number | undefined;
    
    if (!approved && numTotalIncome > 0) {
      // Suggest 4x annual income as max loan amount (standard banking practice)
      suggestedLoanAmount = Math.min(numTotalIncome * 4, numLoanAmount);
      
      // Suggest term that keeps EMI below 40% of monthly income
      const monthlyIncome = numTotalIncome / 12;
      const maxEMI = monthlyIncome * 0.4;
      if (numLoanAmount > 0) {
        const interestRate = 0.1; // 10% annual interest
        const monthlyRate = interestRate / 12;
        
        // Calculate minimum term to keep EMI below maxEMI
        const calculatedTerm = Math.ceil(
          Math.log(maxEMI / (maxEMI - numLoanAmount * monthlyRate)) / 
          Math.log(1 + monthlyRate)
        );
        
        suggestedTerm = Math.max(12, Math.min(360, calculatedTerm));
      }
    }

    setResult({
      approved,
      probability,
      reasons,
      suggestedLoanAmount,
      suggestedTerm
    });
  };

  const getProbabilityVariant = (probability: number) => {
    if (probability >= 0.8) return 'success';
    if (probability >= 0.6) return 'info';
    if (probability >= 0.4) return 'warning';
    return 'destructive';
  };

  if (result) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Card className="bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Loan Application Result</CardTitle>
            <CardDescription>Detailed analysis of your loan application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="flex justify-center items-center gap-4 mb-4">
                {result.approved ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-500" />
                )}
                <div>
                  <div className="text-2xl font-bold">
                    {result.approved ? 'Loan Approved' : 'Loan Not Approved'}
                  </div>
                  <Badge variant={getProbabilityVariant(result.probability)} className="mt-2 text-lg px-4 py-1">
                    Approval Probability: {(result.probability * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="grid gap-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Book className="h-6 w-6" />
                Decision Factors
              </h3>
              
              <Card className="p-4 bg-secondary">
                <ul className="space-y-2">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-muted-foreground">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {!result.approved && result.suggestedLoanAmount && (
                <>
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                    Suggestions to Improve Approval
                  </h3>
                  
                  <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 font-semibold">
                          <IndianRupee className="h-5 w-5" />
                          <span>Consider reducing loan amount to:</span>
                        </div>
                        <p className="text-2xl font-bold ml-7">
                          ₹{result.suggestedLoanAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                      
                      {result.suggestedTerm && (
                        <div>
                          <div className="flex items-center gap-2 font-semibold">
                            <Clock className="h-5 w-5" />
                            <span>Consider increasing loan term to:</span>
                          </div>
                          <p className="text-2xl font-bold ml-7">
                            {result.suggestedTerm} months ({Math.round(result.suggestedTerm/12)} years)
                          </p>
                        </div>
                      )}
                      
                      <p className="text-sm text-muted-foreground mt-2">
                        These adjustments would make your EMI more affordable based on your income.
                      </p>
                    </div>
                  </Card>
                </>
              )}
            </div>
            
            <Button 
              onClick={() => setResult(null)} 
              variant="outline" 
              className="w-full"
            >
              Start New Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Loan Eligibility Checker</CardTitle>
        <CardDescription>
          Complete this form to check your eligibility for a personal loan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="gender">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Gender</span>
              </div>
            </Label>
            <Select 
              value={application.gender} 
              onValueChange={(value) => setApplication({...application, gender: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="married">Marital Status</Label>
            <Select 
              value={application.married} 
              onValueChange={(value) => setApplication({...application, married: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Are you married?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Married</SelectItem>
                <SelectItem value="No">Single</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dependents">Number of Dependents</Label>
            <Select 
              value={application.dependents} 
              onValueChange={(value) => setApplication({...application, dependents: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="How many dependents?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3+">3+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Select 
              value={application.education} 
              onValueChange={(value) => setApplication({...application, education: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select education level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Graduate">Graduate</SelectItem>
                <SelectItem value="Not Graduate">Not Graduate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
            <Input 
              id="loanAmount" 
              type="number" 
              placeholder="e.g., 500000" 
              value={application.loanAmount}
              onChange={(e) => setApplication({...application, loanAmount: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanAmountTerm">Loan Term (months)</Label>
            <Input 
              id="loanAmountTerm" 
              type="number" 
              placeholder="e.g., 360 (30 years)" 
              value={application.loanAmountTerm}
              onChange={(e) => setApplication({...application, loanAmountTerm: e.target.value})}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="creditHistory">Credit History</Label>
            <Select 
              value={application.creditHistory} 
              onValueChange={(value) => setApplication({...application, creditHistory: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Do you have credit history?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Good credit history</SelectItem>
                <SelectItem value="0">No credit history or issues</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalIncome">Total Annual Income (₹)</Label>
            <Input 
              id="totalIncome" 
              type="number" 
              placeholder="e.g., 1200000" 
              value={application.totalIncome}
              onChange={(e) => setApplication({...application, totalIncome: e.target.value})}
            />
          </div>
        </div>

        <Button 
          onClick={calculateEligibility} 
          className="w-full mt-6"
          disabled={Object.values(application).some(value => value === '')}
        >
          Check Eligibility
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoanEligibilityChecker;