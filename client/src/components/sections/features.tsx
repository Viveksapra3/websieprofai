import { MessageSquare, TrendingUp, Clock, Users, Brain, Smartphone, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: MessageSquare,
    title: 'Conversational Learning',
    description: 'Engage in natural conversations with AI that understands context and adapts to your learning pace.',
    gradient: 'from-primary/5 to-accent/5',
    border: 'border-primary/10 hover:border-primary/30',
    iconBg: 'bg-primary',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Monitor your learning journey with detailed analytics and personalized recommendations.',
    gradient: 'from-accent/5 to-primary/5',
    border: 'border-accent/10 hover:border-accent/30',
    iconBg: 'bg-accent',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Get instant help and support whenever you need it, from anywhere in the world.',
    gradient: 'from-green-500/5 to-blue-500/5',
    border: 'border-green-500/10 hover:border-green-500/30',
    iconBg: 'bg-green-500',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Connect with peers and participate in group discussions facilitated by AI.',
    gradient: 'from-orange-500/5 to-red-500/5',
    border: 'border-orange-500/10 hover:border-orange-500/30',
    iconBg: 'bg-orange-500',
  },
  {
    icon: Brain,
    title: 'Adaptive Intelligence',
    description: 'AI that learns from your interactions and customizes content to your learning style.',
    gradient: 'from-purple-500/5 to-pink-500/5',
    border: 'border-purple-500/10 hover:border-purple-500/30',
    iconBg: 'bg-purple-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Access your AI teaching companion on any device, anywhere, anytime.',
    gradient: 'from-indigo-500/5 to-blue-500/5',
    border: 'border-indigo-500/10 hover:border-indigo-500/30',
    iconBg: 'bg-indigo-500',
  },
];

const benefits = [
  'Personalized Learning Paths - Customized curriculum based on your goals and learning style.',
  'Instant Feedback - Get immediate responses and corrections to accelerate learning.',
  'Multi-Subject Support - From mathematics to literature, get help across all subjects.',
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-4" data-testid="features-title">
            Powerful Features for <span className="text-gradient">Modern Learning</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted max-w-3xl mx-auto px-4" data-testid="features-description">
            Discover how Professor AI revolutionizes education with cutting-edge artificial intelligence and intuitive design.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                className={`feature-card bg-gradient-to-br ${feature.gradient} p-6 sm:p-8 border ${feature.border} transition-all`}
                data-testid={`feature-card-${index}`}
              >
                <CardContent className="p-0">
                  <div className={`w-16 h-16 ${feature.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white text-2xl w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-4">{feature.title}</h3>
                  <p className="text-muted leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Feature Showcase with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
              alt="Students learning with technology" 
              className="rounded-2xl shadow-xl"
              data-testid="features-showcase-image"
            />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-secondary mb-4 sm:mb-6" data-testid="features-showcase-title">
              Transform Your Learning Experience
            </h3>
            <p className="text-base sm:text-lg text-muted mb-6 sm:mb-8 leading-relaxed" data-testid="features-showcase-description">
              Professor AI combines the best of artificial intelligence with proven educational methodologies to create a learning experience that's both effective and engaging.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => {
                const [title, description] = benefit.split(' - ');
                return (
                  <div key={index} className="flex items-start space-x-4" data-testid={`benefit-${index}`}>
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                      <CheckCircle className="text-white text-sm w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-secondary">{title}</h4>
                      <p className="text-muted">{description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
