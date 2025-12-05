import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'wouter';
import { ArrowLeft, Check, CreditCard, Shield, Zap, Users, Crown, Star } from 'lucide-react';
import logoPath from "@assets/ProfAI-Updated.svg";

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    basic: {
      name: 'Basic',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        'Upload up to 5 PDFs per month',
        'Generate basic courses',
        'Access to community support',
        'Basic analytics',
        'Standard AI processing'
      ],
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    pro: {
      name: 'Pro',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      features: [
        'Upload unlimited PDFs',
        'Advanced course generation',
        'Priority support',
        'Advanced analytics & insights',
        'Enhanced AI processing',
        'Custom branding',
        'Export capabilities'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      features: [
        'Everything in Pro',
        'Team collaboration tools',
        'White-label solution',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security features',
        'Bulk user management'
      ],
      icon: <Users className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500'
    }
  };

  const currentPlan = plans[selectedPlan as keyof typeof plans];
  const price = billingCycle === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice;
  const savings = billingCycle === 'yearly' ? Math.round(((currentPlan.monthlyPrice * 12) - currentPlan.yearlyPrice) / (currentPlan.monthlyPrice * 12) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <img 
                  src={logoPath} 
                  alt="ProfessorsAI Logo" 
                  className="h-8 w-auto"
                />
              </Link>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-gray-900">Choose Your Plan</h1>
              </div>
            </div>
            <Link href="/teacher-upload">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Billing Toggle */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Unlock the Full Power of ProfessorsAI
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan to transform your educational content with AI
          </p>
          
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Save up to 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              className={`relative cursor-pointer transition-all duration-300 hover:shadow-xl ${
                selectedPlan === key
                  ? 'ring-2 ring-purple-500 shadow-lg transform scale-105'
                  : 'hover:shadow-lg'
              } ${'popular' in plan && plan.popular ? 'border-purple-200' : ''}`}
              onClick={() => setSelectedPlan(key)}
            >
              {'popular' in plan && plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center text-white mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                  </span>
                  <span className="text-gray-600 ml-1">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save ${Math.round((plan.monthlyPrice * 12) - plan.yearlyPrice)}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Complete Your Purchase
              </CardTitle>
              <div className="text-center">
                <div className="inline-flex items-center bg-gray-50 rounded-lg px-4 py-2">
                  <span className="text-lg font-semibold text-gray-900">
                    {currentPlan.name} Plan - ${price}/{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                  {savings > 0 && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {savings}% off
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Payment Method */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Payment Method
                </Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                </div>
              </div>

              {/* Card Details */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                  Complete Purchase - ${price}
                </Button>
                
                <div className="text-center">
                  <Link href="/teacher-upload">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Cancel and go back
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Terms */}
              <div className="text-xs text-gray-500 text-center">
                By completing this purchase, you agree to our{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </Link>
                . You can cancel anytime.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
