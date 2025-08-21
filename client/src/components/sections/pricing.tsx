import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: 'Free',
    description: 'Perfect for getting started',
    features: [
      { name: '10 questions per day', included: true },
      { name: 'Basic subjects', included: true },
      { name: 'Community support', included: true },
      { name: 'Advanced analytics', included: false },
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    priceUnit: '/month',
    description: 'Ideal for serious learners',
    features: [
      { name: 'Unlimited questions', included: true },
      { name: 'All subjects', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Custom learning paths', included: true },
    ],
    buttonText: 'Start Pro Trial',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For schools & organizations',
    features: [
      { name: 'Everything in Pro', included: true },
      { name: 'Multiple user management', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-professor-background to-white" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="pricing-title">
            Choose Your <span className="text-gradient">Learning Plan</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted px-4" data-testid="pricing-description">
            Flexible pricing options designed for learners of all levels
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative ${
                plan.popular 
                  ? 'bg-primary text-white transform sm:scale-105 shadow-2xl border-primary' 
                  : 'bg-white border-gray-100 hover:border-primary/30'
              } transition-all`}
              data-testid={`pricing-card-${index}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <CardHeader className="text-center p-6 sm:p-8">
                <h3 className={`text-xl sm:text-2xl font-bold mb-4 ${plan.popular ? 'text-white' : 'text-secondary'}`}>
                  {plan.name}
                </h3>
                <div className={`text-3xl sm:text-4xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-secondary'}`}>
                  {plan.price}
                  {plan.priceUnit && <span className="text-lg sm:text-xl">{plan.priceUnit}</span>}
                </div>
                <p className={plan.popular ? 'text-blue-100' : 'text-muted'}>
                  {plan.description}
                </p>
              </CardHeader>
              
              <CardContent className="p-6 sm:p-8 pt-0">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3" data-testid={`feature-${index}-${featureIndex}`}>
                      {feature.included ? (
                        <Check className={`w-5 h-5 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                      <span className={feature.included ? '' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full px-6 py-3 rounded-full font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-white text-primary hover:bg-opacity-90' 
                      : plan.buttonVariant === 'outline'
                        ? 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
                        : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                  data-testid={`button-${plan.name.toLowerCase()}-plan`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
