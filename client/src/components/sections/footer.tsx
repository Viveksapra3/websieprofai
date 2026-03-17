import { Brain, Twitter, Facebook, Linkedin, Youtube, Globe } from 'lucide-react';
import { Link } from 'wouter';

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
    <footer className="bg-black text-white py-8 rounded-t-sm" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Section - Full Width on Mobile */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
          <div data-testid="footer-brand" className="text-center md:text-left">
            <div className="flex items-center mb-4 justify-center md:justify-start">
              <Brain className="text-accent text-2xl w-8 h-8 mr-3" />
              <span className="text-2xl font-bold">ProfessorsAI</span>
            </div>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Transforming education through intelligent, conversational AI that adapts to every learner's unique needs.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start">
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
          
          {/* ElevenLabs Grant Badge
          <a 
            href="https://elevenlabs.io/startup-grants" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center md:items-end gap-2 flex-shrink-0"
          >
            <span className="text-gray-400 text-xs md:text-sm font-medium">Powered by</span>
            <img 
              src="https://eleven-public-cdn.elevenlabs.io/payloadcms/cy7rxce8uki-IIElevenLabsGrants%201.webp" 
              alt="ElevenLabs" 
              className="w-[180px] md:w-[280px] hover:opacity-80 transition-opacity"
            />
          </a> */}
          </div>
        </div>

        {/* Footer Sections - 2 Columns on Mobile, 3 Columns on Desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} data-testid={`footer-section-${section.title.toLowerCase().replace(' ', '-')}`} className="text-center md:text-left">
              <h4 className="text-base md:text-lg font-semibold mb-3 md:mb-4">{section.title}</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm">
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
        
        {/* Suggestion Link */}
        <div className="border-t border-gray-700 py-6 mb-4">
          <Link href="/suggestions">
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer group px-4">
              <Globe className="h-5 w-5 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
              <span className="text-xs md:text-sm text-center md:text-left">
                Can't find your country or syllabus or want to suggest improvements? <span className="text-purple-400 group-hover:text-purple-300 font-medium underline underline-offset-2">Drop us a line.</span>
              </span>
            </div>
          </Link>
        </div>

        <div className="border-t border-gray-700 text-center pt-6" data-testid="footer-bottom">
          <p className="text-gray-400 text-xs md:text-sm px-4" >
            © 2026 ProfessorsAI. All rights reserved @iPredictt Data Labs Pvt. Ltd.{' '}
            <span className="block md:inline mt-2 md:mt-0">| {' '}
            <a href="#" className="hover:text-white transition-colors" data-testid="link-privacy">
              Privacy Policy
            </a>{' '}
            | {' '}
            <a href="#" className="hover:text-white transition-colors" data-testid="link-terms">
              Terms of Service
            </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
