import { useState, useEffect } from 'react';
import Navigation from '@/components/navigation';
import Footer from '@/components/sections/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Linkedin, 
  Users,
  Sparkles,
  Target,
  Heart,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Quote
} from 'lucide-react';

export default function AboutPage() {
  // Animated counter hook
  const useCounter = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (!hasAnimated) return;
      
      const increment = end / (duration / 16);
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 16);

      return () => clearInterval(timer);
    }, [hasAnimated, end, duration]);

    return { count, setHasAnimated };
  };

  const leadershipTeam = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Founder & CEO",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Rajesh&backgroundColor=dfe6f5",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "Former IIT professor with 20+ years in AI research, passionate about democratizing education.",
      linkedin: "#"
    },
    {
      name: "Priya Sharma",
      role: "Chief Technology Officer",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=ffe5f0",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      bio: "Ex-Google AI engineer specializing in NLP and adaptive learning systems.",
      linkedin: "#"
    },
    {
      name: "Arjun Mehta",
      role: "Head of Product",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Arjun&backgroundColor=d9f0fc",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      bio: "Product visionary focused on creating intuitive learning experiences that scale.",
      linkedin: "#"
    },
    {
      name: "Dr. Meera Patel",
      role: "Director of Education",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Meera&backgroundColor=fff0d9",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
      bio: "Curriculum expert with PhD in Educational Psychology, designing effective learning paths.",
      linkedin: "#"
    }
  ];

  const coreValues = [
    {
      icon: <Sparkles className="w-10 h-10 text-purple-500" />,
      title: "Innovation First",
      description: "Pushing boundaries of AI-powered learning to create breakthrough experiences"
    },
    {
      icon: <Heart className="w-10 h-10 text-pink-500" />,
      title: "Accessibility",
      description: "Quality education available to everyone, everywhere, regardless of background"
    },
    {
      icon: <Users className="w-10 h-10 text-blue-500" />,
      title: "Student-Centric",
      description: "Every decision focused on improving learning outcomes and student success"
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-green-500" />,
      title: "Continuous Growth",
      description: "Evolving through feedback, research, and commitment to excellence"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" data-testid="about-page">
      <Navigation />
      
      {/* Section 1: Mission Statement Hero */}
      <section className="pt-48 pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8 shadow-sm">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">About ProfessorsAI</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Transforming Education with
              <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Intelligent AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              ProfessorsAI uses artificial intelligence to deliver personalized learning experiences 
              for every student. We believe every learner deserves adaptive, intelligent tutoring that 
              understands their unique needs, pace, and learning style.
            </p>
            <Link href="/signup">
              <Button className="px-10 py-7 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                Start Learning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Origin Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Founder Image */}
            <div className="relative group">
              <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-purple-50 to-blue-50">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-8 p-8">
                    {/* Circular Image */}
                    <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 blur-sm transition-all duration-500"></div>
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
                        alt="Founder"
                        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full object-cover shadow-lg border-4 border-white"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col justify-center">
                      <div className="mb-5">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Rohit Verma</h3>
                        <p className="text-base font-semibold text-purple-600 uppercase tracking-wide mb-4">Founder & CEO</p>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-4 py-1.5 bg-white/80 rounded-full text-sm font-medium text-gray-700">IIT Professor</div>
                          <div className="px-4 py-1.5 bg-white/80 rounded-full text-sm font-medium text-gray-700">AI Researcher</div>
                        </div>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed">
                        20+ years in AI research and education, passionate about democratizing learning through technology.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Story Content */}
            <div>
              <div className="mb-6">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Why We Built
                  <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ProfessorsAI
                  </span>
                </h2>
              </div>
              
              <div className="space-y-5 text-base text-gray-700 leading-relaxed">
                <p>
                  During my years as a professor at IIT, I witnessed brilliant students struggle—not from lack of potential, but because traditional education couldn't adapt to individual learning styles.
                </p>
                <p>
                  That sparked our mission: give every student a personal AI tutor that understands exactly how they learn, adapts in real-time, and provides personalized guidance 24/7.
                </p>
                <p>
                  Today, ProfessorsAI combines cutting-edge AI with proven pedagogical methods to democratize world-class education for millions.
                </p>
              </div>

              {/* Founder Quote */}
              <div className="mt-8 relative">
                <div className="absolute -left-2 top-0 text-purple-200">
                  <Quote className="w-10 h-10" />
                </div>
                <blockquote className="pl-10 border-l-4 border-purple-600 italic text-gray-600">
                  "Every student deserves a teacher who truly understands them. AI makes that possible at scale."
                </blockquote>
                <p className="pl-10 mt-2 text-sm font-semibold text-gray-900">— Dr. Rajesh Kumar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Leadership Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced innovators driving the future of AI-powered education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member, index) => (
              <div 
                key={index} 
                className="group relative"
              >
                {/* Subtle Glow Effect on Border Only */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-75 transition-all duration-500"></div>
                
                <Card className="relative bg-white rounded-2xl overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Image Container with Vector to Photo Transition */}
                    <div className="relative overflow-hidden aspect-square flex-shrink-0">
                      {/* Animated gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 animate-pulse-slow"></div>
                      
                      {/* Vector Avatar - Default State */}
                      <img 
                        src={member.vectorImage} 
                        alt={`${member.name} avatar`}
                        className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 group-hover:scale-95"
                      />
                      
                      {/* Real Photo - Appears on Hover */}
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700"
                      />
                      
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Name & Role Overlay - Appears on Hover */}
                      <div className="absolute inset-x-0 bottom-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                        <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {member.name}
                        </h3>
                        <p className="text-sm font-medium text-purple-200">
                          {member.role}
                        </p>
                      </div>
                      
                      {/* LinkedIn Icon - Top Right Corner */}
                      <a 
                        href={member.linkedin}
                        className="absolute top-4 right-4 p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 hover:scale-110 shadow-lg z-10"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4 text-blue-600" />
                      </a>
                    </div>

                    {/* Content - Minimalist Design */}
                    <div className="p-5 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-0.5 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The core principles that guide everything we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <Card 
                key={index} 
                className="group bg-white border border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 text-center overflow-hidden"
              >
                <CardContent className="p-8 relative">
                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Join CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="about-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#about-grid)" />
          </svg>
          {/* Floating Shapes */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <Award className="w-20 h-20 text-yellow-300 mx-auto mb-6 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Learn Smarter?
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join over 15,000 students using AI to achieve their learning goals. 
            Start your personalized learning journey today—completely free.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/signup">
              <Button className="px-10 py-7 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/organization-contact">
              <Button variant="outline" className="px-10 py-7 text-lg font-semibold border-2 border-white/40 text-white hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Metric Card Component with Animation
function MetricCard({ 
  end, 
  suffix, 
  label, 
  icon, 
  gradient 
}: { 
  end: number; 
  suffix: string; 
  label: string; 
  icon: React.ReactNode; 
  gradient: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCount();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById(`metric-${label}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible, label]);

  const animateCount = () => {
    const duration = 2000;
    const increment = end / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div 
      id={`metric-${label}`}
      className="relative group"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all duration-500`}></div>
      
      <Card className="relative bg-white rounded-2xl border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10`}>
              {icon}
            </div>
          </div>
          <div className={`text-5xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-2`}>
            {formatNumber(count)}{suffix}
          </div>
          <div className="text-gray-600 font-semibold text-lg">{label}</div>
        </CardContent>
      </Card>
    </div>
  );
}
