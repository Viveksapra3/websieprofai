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

  const isLightSection = currentSection !== 'home';
  const textColor = isLightSection ? 'text-gray-900' : 'text-white';
  const hoverColor = isLightSection ? 'hover:text-primary' : 'hover:text-accent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLightSection ? 'bg-white/95 backdrop-blur-md shadow-md' : 'glass-effect'
    }`} data-testid="main-navigation">
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
              onClick={() => scrollToSection('features')} 
              className={`${textColor} ${hoverColor} transition-colors ${currentSection === 'features' ? 'font-semibold' : ''}`}
              data-testid="nav-features"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`${textColor} ${hoverColor} transition-colors ${currentSection === 'about' ? 'font-semibold' : ''}`}
              data-testid="nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className={`${textColor} ${hoverColor} transition-colors ${currentSection === 'pricing' ? 'font-semibold' : ''}`}
              data-testid="nav-pricing"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`${textColor} ${hoverColor} transition-colors ${currentSection === 'contact' ? 'font-semibold' : ''}`}
              data-testid="nav-contact"
            >
              Contact
            </button>
            <Button 
              className={`px-6 py-2 rounded-full transition-all ${
                isLightSection 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
              data-testid="button-get-started"
            >
              Get Started
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
          <div className={`md:hidden rounded-lg mt-2 p-4 transition-all ${
            isLightSection ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'glass-effect'
          }`} data-testid="mobile-menu">
            <button 
              onClick={() => scrollToSection('home')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'home' ? 'font-semibold' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'features' ? 'font-semibold' : ''}`}
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'about' ? 'font-semibold' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'pricing' ? 'font-semibold' : ''}`}
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left ${currentSection === 'contact' ? 'font-semibold' : ''}`}
            >
              Contact
            </button>
            <Button 
              className={`w-full mt-4 px-6 py-2 rounded-full transition-all ${
                isLightSection 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-accent text-white hover:bg-accent/90'
              }`}
              data-testid="button-mobile-get-started"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
