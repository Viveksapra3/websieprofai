import { Button } from '@/components/ui/button';
import { Play, Video, ChevronDown ,Sparkles} from 'lucide-react';
import courseVideo from '@assets/video (2).mp4';

export default function HeroSection() {
  const scrollToNext = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden rounded-b-sm" data-testid="hero-section">
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
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      
      <div className="relative min-h-screen flex items-center z-20">
        <div className="max-w-7xl ml-20 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-left max-w-4xl">
            <h1 className="mb-6" data-testid="hero-title">
              {/* Gradient "STUDY SMART" */}
              <div className="text-6xl sm:text-7xl md:text-7xl text-shadow-lg/30 font-extrabold leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #ff4b5c, #ff915c)', // same red color across
                  // textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                STUDY SMART
              </div>


              {/* Subheading */}
              <div className="text-4xl sm:text-4xl md:text-4xl font-semibold mt-2 text-white">
                with AI Assistant
              </div>

              <div className="text-3xl sm:text-4xl md:text-4xl font-medium mt-2 text-white">
                As Your
              </div>

              <div className="text-3xl sm:text-4xl md:text-4xl font-medium text-white">
                Learning Companion
              </div>
            </h1>

            <p className="text-lg sm:text-xl md:text-1.5xl text-white text-opacity-90 mb-8 leading-relaxed" data-testid="hero-description">
              Transform your educational experience with Professor AI - an intelligent learning companion that personalizes your training, and becomes your guide, mentor, and coach anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="border relative px-8 py-3 rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-zinc-900 and via-stone-950 to to-stone-900 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white shadow-lg hover:shadow-purple-500/50 overflow-hidden group"
                data-testid="button-sign-up"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Start Learning</span>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-black bg-white px-8 py-4 rounded-full font-semibold hover:scale-110 hover:bg-white transition-all"
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