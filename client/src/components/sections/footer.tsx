import { Brain, Twitter, Facebook, Linkedin, Youtube } from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'API', 'Integrations'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Help Center', 'Blog', 'Community'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Contact'],
  },
];

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div data-testid="footer-brand">
            <div className="flex items-center mb-6">
              <Brain className="text-accent text-2xl w-8 h-8 mr-3" />
              <span className="text-2xl font-bold">Professor AI</span>
            </div>
            <p className="text-gray-300 mb-6">
              Transforming education through intelligent, conversational AI that adapts to every learner's unique needs.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={index}
                    href={social.href} 
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.label}
                    data-testid={`social-link-${social.label.toLowerCase()}`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index} data-testid={`footer-section-${section.title.toLowerCase().replace(' ', '-')}`}>
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors"
                      data-testid={`footer-link-${link.toLowerCase().replace(' ', '-')}`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center" data-testid="footer-bottom">
          <p className="text-gray-400">
            © 2024 Professor AI. All rights reserved. | {' '}
            <a href="#" className="hover:text-white transition-colors" data-testid="link-privacy">
              Privacy Policy
            </a>{' '}
            | {' '}
            <a href="#" className="hover:text-white transition-colors" data-testid="link-terms">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
