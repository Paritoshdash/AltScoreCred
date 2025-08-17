import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CreditScoreChecker from "@/components/CreditScoreChecker";
import LoanEligibilityChecker from "@/components/LoanEligibilityChecker";
import { Shield, TrendingUp, Clock, Users, CheckCircle } from "lucide-react";
import heroVideo from "@/assets/Custom dimensions 1200x600 px.mp4";
import logoGif from "@/assets/credit card.gif";

const Index = () => {
  const [activeView, setActiveView] = useState("home");

  // Render Credit Score Checker View
  if (activeView === "creditScore") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <Button
              variant="outline"
              onClick={() => setActiveView("home")}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">Credit Score Checker</h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <CreditScoreChecker />
          </div>
        </div>
      </div>
    );
  }

  // Render Loan Eligibility Checker View
  if (activeView === "loanEligibility") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <Button
              variant="outline"
              onClick={() => setActiveView("home")}
              className="mb-4"
            >
              ← Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">Loan Eligibility Checker</h1>
          </div>
          <div className="max-w-4xl mx-auto">
            <LoanEligibilityChecker />
          </div>
        </div>
      </div>
    );
  }

  // Render Home Page View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={logoGif} alt="AltScore Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold text-white">AltScore</span>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                onClick={() => setActiveView("creditScore")}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Check Credit Score
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setActiveView("loanEligibility")}
                className="text-white border-gray-500 hover:bg-gray-800 hover:text-white"
              >
                Check Loan Eligibility
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit bg-gray-800 text-blue-400">
                Trusted by 10,000+ users
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-white">
                Check Your
                <span className="text-blue-500"> Credit Score</span> &
                <span className="text-blue-400"> Loan Eligibility</span>
              </h1>
              <p className="text-xl text-gray-400 leading-relaxed">
                Get instant access to your CIBIL score and discover loan opportunities
                tailored to your financial profile. Make informed decisions for your future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => setActiveView("creditScore")}
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Free Credit Report
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveView("loanEligibility")}
                  className="text-lg px-8 py-6 text-white border-gray-500 hover:bg-gray-800 hover:text-white"
                >
                  Check Loan Eligibility
                </Button>
              </div>
            </div>
            <div className="relative">
              <video
                src={heroVideo}
                className="rounded-2xl shadow-2xl"
                autoPlay
                loop
                muted
                playsInline
              >
                Your browser does not support the video tag.
              </video>
              <div className="absolute -bottom-6 -left-6 bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-white">100% Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Why Choose AltScore?</h2>
            <p className="text-xl text-gray-400">
              The most trusted platform for credit score checking and loan eligibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="mx-auto bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-blue-500" />
                </div>
                <CardTitle className="text-white">100% Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Bank-level security with 256-bit SSL encryption to protect your data
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="mx-auto bg-blue-400/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Instant Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Get your credit score and loan eligibility in under 2 minutes
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="mx-auto bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-500" />
                </div>
                <CardTitle className="text-white">Credit Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  Detailed analysis and tips to improve your credit score
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-500" />
                </div>
                <CardTitle className="text-white">Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">
                  24/7 customer support from financial experts
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Check Your Financial Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of users who have improved their financial standing
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setActiveView("creditScore")}
              className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
            >
              Check Score for Free
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setActiveView("loanEligibility")}
              className="text-lg px-8 py-6 bg-blue-400 text-white hover:bg-blue-500"
            >
              Check Loan Eligibility
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logoGif} alt="AltScore Logo" className="h-6 w-6" />
                <span className="text-xl font-bold text-white">AltScore</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for credit score monitoring and loan eligibility checking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Credit Score Check</li>
                <li>Loan Eligibility</li>
                <li>Credit Report</li>
                <li>Financial Planning</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Live Chat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
                <li>Compliance</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AltScore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;