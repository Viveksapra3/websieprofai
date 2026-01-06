import Navigation from '@/components/navigation';
import Footer from '@/components/sections/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  Github,
  Award,
  Users,
  Sparkles,
  Target,
  Heart,
  Zap
} from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Executive Officer",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=dfe6f5",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      bio: "Former Stanford AI researcher with 15+ years in EdTech innovation.",
      linkedin: "#",
      twitter: "#",
      email: "sarah@professorsai.com"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Michael&backgroundColor=e5dff5",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      bio: "Ex-Google engineer specializing in machine learning and scalable systems.",
      linkedin: "#",
      twitter: "#",
      email: "michael@professorsai.com"
    },
    {
      name: "Dr. Priya Sharma",
      role: "Head of AI Research",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Priya&backgroundColor=ffe5f0",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      bio: "PhD in Natural Language Processing, published 50+ research papers.",
      linkedin: "#",
      twitter: "#",
      email: "priya@professorsai.com"
    },
    {
      name: "James Anderson",
      role: "VP of Product",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=James&backgroundColor=d9f0fc",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      bio: "Product visionary with experience at leading education platforms.",
      linkedin: "#",
      twitter: "#",
      email: "james@professorsai.com"
    },
    {
      name: "Emily Watson",
      role: "Head of Design",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Emily&backgroundColor=fff4e5",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Award-winning UX designer passionate about accessible education.",
      linkedin: "#",
      twitter: "#",
      email: "emily@professorsai.com"
    },
    {
      name: "David Kim",
      role: "Lead Backend Engineer",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=David&backgroundColor=e0f5e9",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Full-stack expert building robust, scalable educational infrastructure.",
      linkedin: "#",
      twitter: "#",
      email: "david@professorsai.com"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Director of Curriculum",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Aisha&backgroundColor=fff0d9",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
      bio: "Former university professor with expertise in pedagogical design.",
      linkedin: "#",
      twitter: "#",
      email: "aisha@professorsai.com"
    },
    {
      name: "Marcus Johnson",
      role: "Head of Growth",
      vectorImage: "https://api.dicebear.com/7.x/notionists/svg?seed=Marcus&backgroundColor=e8e5ff",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      bio: "Growth strategist helping millions discover transformative learning.",
      linkedin: "#",
      twitter: "#",
      email: "marcus@professorsai.com"
    }
  ];

  const values = [
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Innovation First",
      description: "We push boundaries to create cutting-edge learning experiences"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Student-Centric",
      description: "Every decision is made with learners' success in mind"
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Passion for Education",
      description: "We believe education transforms lives and communities"
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Excellence Driven",
      description: "We strive for the highest quality in everything we do"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" data-testid="team-page">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-48 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full mb-6">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-600">Meet Our Team</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Minds Behind
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> ProfessorsAI</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We're a diverse team of educators, engineers, and innovators united by a single mission: 
              to revolutionize education through the power of artificial intelligence.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced leaders driving innovation in AI-powered education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
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

      {/* Our Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white hover:shadow-xl transition-all duration-300 text-center group"
              >
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 group-hover:scale-110 transition-transform duration-300">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Numbers that showcase our commitment to educational excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-5xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-700 font-semibold">Active Students</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-700 font-semibold">Partner Schools</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-5xl font-bold text-green-600 mb-2">24,000+</div>
              <div className="text-gray-700 font-semibold">Hours of Teaching</div>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl">
              <div className="text-5xl font-bold text-pink-600 mb-2">25+</div>
              <div className="text-gray-700 font-semibold">Countries</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Join Our Team CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="team-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#team-grid)" />
          </svg>
          {/* Floating Shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <Zap className="w-16 h-16 text-yellow-300 mx-auto mb-4 animate-pulse" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Want to Join Our Mission?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals who are passionate about transforming 
            education through technology. Join us in shaping the future of learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/organization-contact">
              <Button className="px-8 py-6 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                View Open Positions
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="px-8 py-6 text-lg font-semibold border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300">
                Learn More About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
