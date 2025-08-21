import { Button } from '@/components/ui/button';
import { Play, Video, ChevronDown } from 'lucide-react';
import courseVideo from '@assets/course-video_1755775851742.mp4';

export default function HeroSection() {
  const scrollToNext = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden" data-testid="hero-section">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        data-testid="hero-background-video"
      >
        <source src={courseVideo} type="video/mp4" />
      </video>
      
      {/* Video Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>
      
      <div className="relative min-h-screen flex items-center z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-left max-w-4xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight" data-testid="hero-title">
              <span className="text-white block">AI Assistant</span>
              Driving
              <span className="block">Effective Learning</span>
            </h1>
            <p className="text-lg sm:text-xl text-white text-opacity-90 mb-6 sm:mb-8 leading-relaxed" data-testid="hero-description">
              Transform your educational experience with Professor AI - the intelligent teaching assistant that adapts to your learning style and provides personalized guidance 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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