import { Button } from '@/components/ui/button';
import { Play, Video, ChevronDown ,Sparkles} from 'lucide-react';
import courseVideo from '@assets/video (3).mp4';

export default function HeroSection() {
  const scrollToNext = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-black" data-testid="hero-section">
  <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-between gap-20 px-8 lg:px-20 py-12 sm:py-16 lg:py-20">
    
    {/* LEFT TEXT SECTION */}
    <div className="max-w-xl text-left z-20 flex-1">
      <h1 className="mb-6" data-testid="hero-title">
        <div className="text-6xl sm:text-7xl md:text-7xl font-extrabold leading-tight bg-clip-text text-transparent"
          style={{
            backgroundImage: 'linear-gradient(to right, #ff4b5c, #ff915c)',
          }}
        >
          STUDY SMART
        </div>
        <div className="text-4xl font-semibold mt-2 text-white">with AI Assistant</div>
        <div className="text-3xl font-medium mt-2 text-white">As Your</div>
        <div className="text-3xl font-medium text-white">Learning Companion</div>
      </h1>
      <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
        Transform your educational experience with Professor AI - an intelligent learning companion that personalizes your training, and becomes your guide, mentor, and coach anytime, anywhere.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="relative px-8 py-3 rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 text-white shadow-lg hover:shadow-purple-500/50 group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">Start Learning</span>
        </Button>
        <Button variant="outline" size="lg" className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all">
          <Video className="w-5 h-5 mr-2" />
          Watch Demo
        </Button>
      </div>
    </div>

    {/* RIGHT VIDEO SECTION */}
    <div className="relative flex-1 w-full lg:max-w-2xl xl:max-w-3xl z-20">
      <div className="relative rounded-2xl overflow-hidden border-4 border-pink-500 ">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-auto object-cover"
        >
          <source src={courseVideo} type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
</section>
  );
}