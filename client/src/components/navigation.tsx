import { useState } from 'react';
import { Brain, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect" data-testid="main-navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center" data-testid="logo-brand">
            <Brain className="w-8 h-8 text-accent mr-2" />
            <span className="text-xl sm:text-2xl font-bold text-white">Professor AI</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')} 
              className="text-white hover:text-accent transition-colors"
              data-testid="nav-home"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-white hover:text-accent transition-colors"
              data-testid="nav-features"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-white hover:text-accent transition-colors"
              data-testid="nav-about"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-white hover:text-accent transition-colors"
              data-testid="nav-pricing"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-white hover:text-accent transition-colors"
              data-testid="nav-contact"
            >
              Contact
            </button>
            <Button 
              className="bg-accent text-white px-6 py-2 rounded-full hover:bg-accent/90 transition-all"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-accent transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden glass-effect rounded-lg mt-2 p-4" data-testid="mobile-menu">
            <button 
              onClick={() => scrollToSection('home')} 
              className="block py-2 text-white hover:text-accent transition-colors w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="block py-2 text-white hover:text-accent transition-colors w-full text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="block py-2 text-white hover:text-accent transition-colors w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="block py-2 text-white hover:text-accent transition-colors w-full text-left"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block py-2 text-white hover:text-accent transition-colors w-full text-left"
            >
              Contact
            </button>
            <Button 
              className="w-full mt-4 bg-accent text-white px-6 py-2 rounded-full hover:bg-accent/90 transition-all"
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
