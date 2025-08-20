import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, CheckCircle, GraduationCap } from 'lucide-react';

const stats = [
  { value: '99.7%', label: 'Accuracy Rate', color: 'text-primary' },
  { value: '150+', label: 'Languages', color: 'text-accent' },
  { value: '24/7', label: 'Availability', color: 'text-green-500' },
  { value: '5M+', label: 'Interactions', color: 'text-orange-500' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-professor-background to-white" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-secondary mb-6" data-testid="about-title">
              The Future of <span className="text-gradient">AI Education</span>
            </h2>
            <p className="text-lg text-muted mb-8 leading-relaxed" data-testid="about-description">
              Professor AI represents a breakthrough in educational technology, combining advanced natural language processing with deep learning algorithms to create an intelligent teaching companion that understands and adapts to each student's unique needs.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6 bg-white shadow-lg" data-testid={`stat-card-${index}`}>
                  <CardContent className="p-0">
                    <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-sm text-muted">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Button 
              size="lg"
              className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
              data-testid="button-explore-technology"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Explore Technology
            </Button>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
              alt="Modern education technology" 
              className="rounded-2xl shadow-2xl"
              data-testid="about-image"
            />
            
            {/* Overlay Cards */}
            <Card className="absolute -top-8 -left-8 bg-white p-6 shadow-xl" data-testid="overlay-card-ai">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">AI Powered</div>
                    <div className="text-sm text-muted">Smart Learning</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="absolute -bottom-8 -right-8 bg-white p-6 shadow-xl" data-testid="overlay-card-adaptive">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <GraduationCap className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary">Adaptive</div>
                    <div className="text-sm text-muted">Personalized</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
