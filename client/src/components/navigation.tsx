import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logoPath from "@assets/prof-ai-logo_1755775207766.avif";

export default function Navigation() {
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

  const textColor = 'text-white';
  const hoverColor = 'hover:text-accent';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md shadow-lg transition-all duration-300" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center" data-testid="logo-brand">
            <img 
              src={logoPath} 
              alt="Professor AI Logo" 
              className="h-8 sm:h-10 w-auto"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`${textColor} ${hoverColor} transition-colors ${currentSection === 'home' ? 'font-semibold' : ''}`}
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              className={`${textColor} ${hoverColor} transition-colors`}
              data-testid="nav-demo"
            >
              Demo
            </button>
            <Button 
              className="px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 hover:shadow-primary/30"
              data-testid="button-sign-up"
            >
              Sign up
            </Button>
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
            <Button 
              className="w-full mt-4 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg bg-gradient-to-r from-accent to-primary text-white hover:from-accent/90 hover:to-primary/90 hover:shadow-primary/30"
              data-testid="button-mobile-sign-up"
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
