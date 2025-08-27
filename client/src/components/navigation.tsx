import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import logoPath from "@assets/prof-ai-logo_1755775207766.avif";
// import { useNavigate } from "react-router-dom";

export default function Navigation() {
  // const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'about', 'pricing', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const isOnLandingPage = currentSection === 'home';
  const textColor = 'text-white';
  const hoverColor = 'hover:text-white';

  return (
    <nav className={`fixed top-2 left-0 right-0 z-50 transition-all duration-300 ${
      isOnLandingPage ? 'bg-transparent' : 'bg-black/80 backdrop-blur-md shadow-lg'
    }`} data-testid="main-navigation">
      <div className="max-w-10xl mx-auto  px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center py-3 px-6 sm:py-3 bg-black/90 rounded-full">
          <div className="flex items-center" data-testid="logo-brand">
            <img 
              src={logoPath} 
              alt="Professor AI Logo" 
              className="h-6 sm:h-10 w-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`${textColor} ${hoverColor} hover:scale-110 transition-colors ${currentSection === 'home' ? 'font-semibold' : ''}`}
              data-testid="nav-home"
            >
              Home
            </button>
            <Link href ="/dashboard">
            <button 
              className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
              data-testid="nav-demo"
              >
              Demo
            </button>
            </Link>
            <Link href="/signup">
              <Button 
                className="relative px-8 py-3 border rounded-full font-bold text-lg 
                          transition-all duration-500 transform 
                          hover:scale-110 hover:shadow-2xl 
                          bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 
                          text-white shadow-lg hover:shadow-purple-500/50 
                          overflow-hidden group"
                data-testid="button-sign-up"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Sign up</span>
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${textColor} ${hoverColor} transition-colors`}
              data-testid="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden rounded-lg mt-2 p-4 bg-black/90 backdrop-blur-md shadow-lg transition-all" data-testid="mobile-menu">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'home' ? 'font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left`}
            >
              Demo
            </button>
            <Link href="/signup">
              <Button 
                className="relative px-8 py-3 border rounded-full font-bold text-lg 
                          transition-all duration-500 transform 
                          hover:scale-110 hover:shadow-2xl 
                          bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 
                          text-white shadow-lg hover:shadow-purple-500/50 
                          overflow-hidden group"
                data-testid="button-sign-up"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Sign up</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
