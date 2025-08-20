import { Button } from '@/components/ui/button';
import { Play, Video, ChevronDown } from 'lucide-react';
import ThreeBackground from '../three-background';

export default function HeroSection() {
  const scrollToNext = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen hero-gradient overflow-hidden" data-testid="hero-section">
      <ThreeBackground />
      
      <div className="relative min-h-screen flex items-center" style={{ zIndex: 2 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
                Meet Your
                <span className="text-gradient block">AI Teaching</span>
                Companion
              </h1>
              <p className="text-xl text-white text-opacity-90 mb-8 leading-relaxed" data-testid="hero-description">
                Transform your educational experience with Professor AI - the intelligent teaching assistant that adapts to your learning style and provides personalized guidance 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button 
                  size="lg"
                  className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition-all"
                  data-testid="button-start-learning"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all"
                  data-testid="button-watch-demo"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="mt-12 flex items-center justify-center lg:justify-start space-x-6 text-white text-opacity-80">
                <div className="text-center" data-testid="stat-students">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm">Active Students</div>
                </div>
                <div className="w-px h-8 bg-white bg-opacity-30"></div>
                <div className="text-center" data-testid="stat-questions">
                  <div className="text-2xl font-bold">1M+</div>
                  <div className="text-sm">Questions Answered</div>
                </div>
                <div className="w-px h-8 bg-white bg-opacity-30"></div>
                <div className="text-center" data-testid="stat-rating">
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-sm">User Rating</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="AI teaching assistant interface" 
                className="rounded-2xl shadow-2xl animate-float"
                data-testid="hero-image"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white rounded-full opacity-10 animate-float"></div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <button 
              onClick={scrollToNext}
              className="animate-bounce-slow text-white text-opacity-60"
              data-testid="scroll-indicator"
            >
              <ChevronDown className="w-8 h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
