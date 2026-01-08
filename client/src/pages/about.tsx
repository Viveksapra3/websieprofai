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
      name: "Rohit Verma",
      role: "CEO",
      vectorImage: "assets-ghibli/rohit-sir-ghibli.png",
      image: "rohit-verma-image.jpeg",
      bio: "CEO of Aalgorix, leading innovation at the intersection of Artificial Intelligence, immersive technologies, and future-ready skill development.",
      linkedin: "https://www.linkedin.com/in/rohitverma6789/"
    },
    {
      name: "Ganga Tikkoo",
      role: "Director-BD & Alliances",
      vectorImage: "assets-ghibli/ganga-cartoon.png",
      image: "ganga-image.jpeg",
      bio: "Director of Business Development and Alliances at Aalgorix, driving Web 3.0 adoption through strategic partnerships with focus on growth, execution, scalability.",
      linkedin: "https://www.linkedin.com/in/ganga-tikkoo-68b12258/"
    },
    {
      name: "Mansi Singh",
      role: "Head of Market Development",
      vectorImage: "assets-ghibli/mansi-cartoon.png",
      image: "mansi-image.jpeg",
      bio: "Head of Market Development at Aalgorix, advancing XR/VR adoption through strategic partnerships, research, and value-driven engagement.",
      linkedin: "https://www.linkedin.com/in/mansi-singh12/"
    },
    {
      name: "Amar Singh",
      role: "Technology Lead",
      vectorImage: "assets-ghibli/amar-ghibli.png",
      image: "amar-image.jpeg",
      bio: "Tech Lead at Aalgorix, architecting scalable systems with expertise in AI-integrated platforms and immersive technology solutions.",
      linkedin: "https://www.linkedin.com/in/mansi-singh12/"
    },
    {
      name: "Vivek Sapra",
      role: "Frontend Developer",
      vectorImage: "assets-ghibli/vivek-cartoon.png",
      image: "vivek-image.jpeg",
      bio: "Frontend Developer at Aalgorix, building high-performance interfaces using modern React and Next.js with focus on responsiveness and clean architecture.",
      linkedin: "https://www.linkedin.com/in/viveksapracse/"
    },
    {
      name: "Shivang Kanaujia",
      role: "Junior Engineer",
      vectorImage: "assets-ghibli/shivang-cartoon.png",
      image: "shivang-image.jpg",
      bio: "Junior Engineer at Aalgorix, supporting deployment, development workflows, and production systems with focus on learning-driven execution and reliability.",
      linkedin: "https://www.linkedin.com/in/shivang-kanaujia-973a6a175/"
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
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-8 shadow-sm">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">About ProfessorsAI</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Building AI that runs on a system of
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-normal">
                Judgements & Reasons
              </span>
            </h1>
            <p className="text-l md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              ProfessorsAI uses artificial intelligence to deliver personalized learning experiences for every Student/Learner. Here AI is not a smart Chatbot but an entire organisation which is based on fine judgement in a precise way.with its advanced core design principles.
            </p>
            <Link href="/courses">
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
                  <div className="flex flex-col lg:flex-row items-center text-center lg:text-left gap-6 lg:gap-8 p-8 lg:p-8">
                    {/* Circular Image */}
                    <div className="relative flex-shrink-0 lg:mx-0">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 blur-sm transition-all duration-500"></div>
                      <img 
                        src="rohit-verma-image.jpeg"
                        alt="Founder"
                        className="relative w-40 h-40 lg:w-56 lg:h-56 rounded-full object-cover shadow-lg border-4 border-white"
                      />
                    </div>
                    
                    {/* Info */}
                    <div className="flex flex-col lg:justify-center">
                      <div className="mb-5">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Rohit Verma</h3>
                        <p className="text-sm lg:text-base font-semibold text-purple-600 uppercase tracking-wide mb-4">CEO, Aalgorix</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Story Content */}
            <div>
              <div className="mb-6 text-center lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  <span className="block mt-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Our Story
                  </span>
                </h2>
              </div>
              
              <div className="space-y-5 text-base text-gray-700 leading-relaxed">
                <p>
                  This is our 11th year into business. As we reflect on the years gone by, I am proud of the progress Aalgorix has made in advancing intelligent, immersive, and future-ready learning solutions. This year marked an important phase in our journey as we continued to strengthen our capabilities at the intersection of Artificial Intelligence, immersive technologies, and skill development.
                </p>
                <p>
                  The rapid evolution of AI and emerging technologies is reshaping how people learn, work, and adapt. At Aalgorix, our focus has remained clear — to build responsible, scalable, and outcome-driven platforms that empower learners, educators, and enterprises to stay relevant in a fast-changing AI Led economy. Through continuous innovation, strategic collaborations, and a strong emphasis on practical application, we have worked to bridge the gap between education and industry readiness.
                </p>
                <p>
                  Our progress would not have been possible without the trust of our mentors,  partners, institutions, and the dedication of our team. Their commitment and belief in our vision continue to inspire us to raise the bar in everything we do.
                </p>
                <p>
                  As we look ahead, Aalgorix remains committed to driving meaningful impact by enabling future-ready skills, immersive learning experiences, and intelligent AI- powered systems. We are confident that the foundation we have built will allow us to contribute significantly to India’s digital and innovation-led growth while creating long-term value for all our stakeholders.
                </p>
              </div>

              {/* Founder Quote */}
              <div className="mt-8 flex gap-4">
                <div className="flex-shrink-0 text-purple-200">
                  <Quote className="w-10 h-10" />
                </div>
                <div className="border-l-4 border-purple-600 pl-6">
                  <blockquote className="italic text-gray-600 text-sm md:text-md leading-relaxed">
                    "Theory can best be learnt with Digital Twins of Instructors and Practicals at Labs. Learning will see a fundamental shift from Industrial era teaching methods."
                  </blockquote>
                  <p className="mt-3 text-base font-semibold text-gray-900">— Rohit Verma</p>
                </div>
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
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced innovators driving the future of AI-powered education
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
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
                    <div className="relative overflow-hidden aspect-square flex-shrink-0 max-h-[200px] md:max-h-none">
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
                      <div className="absolute inset-x-0 bottom-0 p-3 md:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-10">
                        <h3 className="text-sm md:text-xl font-bold text-white mb-1 drop-shadow-lg">
                          {member.name}
                        </h3>
                        <p className="text-xs md:text-sm font-medium text-purple-200">
                          {member.role}
                        </p>
                      </div>
                      
                      {/* LinkedIn Icon - Top Right Corner */}
                      <a 
                        href={member.linkedin}
                        className="absolute top-2 right-2 md:top-4 md:right-4 p-1.5 md:p-2.5 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 hover:scale-110 shadow-lg z-10"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                      </a>
                    </div>

                    {/* Content - Minimalist Design */}
                    <div className="p-3 md:p-5 bg-gradient-to-br from-gray-50 to-white">
                      <div className="flex items-start justify-between mb-2 md:mb-3">
                        <div className="flex-1">
                          <h3 className="text-s md:text-lg font-bold text-gray-900 mb-0.5 group-hover:text-purple-600 transition-colors line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-[13px] md:text-xs font-semibold text-purple-600 uppercase tracking-wide">
                            {member.role}
                          </p>
                        </div>
                      </div>
                      <p className="text-[12px]  md:text-sm text-gray-600 leading-relaxed line-clamp-2 md:line-clamp-3">
                        {member.bio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            </div>
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
            <Link href="/courses">
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
