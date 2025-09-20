import { Button } from '@/components/ui/button';
import { Play, Video, ChevronDown ,Sparkles} from 'lucide-react';
import courseVideo from '@assets/video (2).mp4';
import { useTypingAnimation } from '@/hooks/useTypingAnimation';

export default function HeroSection() {
  const { displayText} = useTypingAnimation({
    text: 'STUDY SMART',
    speed: 90,
    delay: 1500,
    repeat: true
  });

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
        className="absolute top-0 left-0 w-full h-full object-cover z-0 scale-100 sm:scale-110"
        data-testid="hero-background-video"
      >
        <source src={courseVideo} type="video/mp4" />
      </video>
      
      {/* Video Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>
      
      <div className="relative min-h-screen flex items-center justify-center lg:justify-start z-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:ml-20 py-8 sm:py-12 lg:py-20">
          <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <h1 className="mb-6" data-testid="hero-title">
              {/* Gradient "STUDY SMART" */}
              <div className="text-6xl xs:text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-7xl font-extrabold leading-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #ff4b5c,rgb(255, 92, 92))', // same red color across
                }}
              >
                {displayText}
                <span
                  className="ml-1 w-[3px] h-[1em] bg-gradient-to-r from-[#ff4b5c] to-[rgb(255,92,92)] animate-blink"
                />
              </div>


              {/* Subheading */}
              <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold mt-2 sm:mt-4 text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                with AI Assistant
              </div>

              <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium mt-1 sm:mt-2 text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                As Your
              </div>

              <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-white drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                Learning Companion
              </div>
            </h1>

            <p className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white text-opacity-90 mb-6 sm:mb-8 drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] leading-relaxed max-w-3xl mx-auto lg:mx-0" data-testid="hero-description">
              Transform your educational experience with Professor AI - an intelligent learning companion that personalizes your training, and becomes your guide, mentor, and coach anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start justify-center lg:justify-start">
              <Button 
                className="border relative px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base lg:text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 text-white shadow-lg hover:shadow-purple-500/50 overflow-hidden group w-full sm:w-auto"
                data-testid="button-sign-up"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Start Learning</span>
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white text-black bg-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold hover:scale-110 hover:bg-white transition-all text-sm sm:text-base lg:text-lg w-full sm:w-auto"
                data-testid="button-watch-demo"
              >
                <Video className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 text-center">
            <button 
              onClick={scrollToNext}
              className="animate-bounce-slow text-white text-opacity-60 hover:text-opacity-80 transition-all"
              data-testid="scroll-indicator"
            >
              <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}