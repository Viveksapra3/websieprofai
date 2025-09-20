import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'wouter';
import logoPath from "@assets/prof-ai-logo_1755775207766-DKA28TFR.avif";
// import { useNavigate } from "react-router-dom";

export default function Navigation() {
  // const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<null | { username?: string; email?: string }>(null);

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

  // Fetch session to determine if an Account button should be shown globally
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/session', { credentials: 'include' });
        const data = await res.json();
        if (!cancelled && res.ok && data?.authenticated) {
          setSessionUser({ username: data.user?.username, email: data.user?.email });
        }
      } catch {
        // ignore errors
      }
    })();
    return () => { cancelled = true; };
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
            {/* <Link href ="/signup"> */}
            <button 
              className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
              data-testid="nav-demo"
              >
              Demo
            </button>
            {/* </Link> */}
            
            {/* Account (if signed in) or Sign In */}
            {sessionUser ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    className="relative px-6 py-2 border rounded-full font-semibold text-sm transition-all bg-white/10 text-white hover:bg-white/20"
                    data-testid="button-account"
                  >
                    {sessionUser.username ? ` ${sessionUser.username}` : ''}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-black/90 text-white border border-white/20">
                  <div className="space-y-1 text-sm">
                    {/* <div className="opacity-70">Signed in as</div>
                    <div className="font-medium">{sessionUser.username}</div>
                    {sessionUser.email && (
                      <div className="mt-1 text-white/80">{sessionUser.email}</div>
                    )} */}
                    <div className="mt-3">
                      <Link href="/courses">
                        <Button size="sm" className="w-full">Go to Courses</Button>
                      </Link>
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-full"
                        onClick={async () => {
                          try {
                            await fetch('/api/logout', { method: 'POST', credentials: 'include' });
                          } finally {
                            window.location.href = '/';
                          }
                        }}
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            ) : (
            <div className="relative group">
              <Button
                className="relative px-8 py-3 border rounded-full font-bold text-lg 
                  transition-all duration-500 transform 
                  hover:scale-110 hover:shadow-2xl 
                  bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 
                  text-white shadow-lg hover:shadow-purple-500/50 
                  overflow-hidden flex items-center"
                data-testid="button-sign-in"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Sign In</span>
                <ChevronDown className="w-4 h-4 ml-2 relative z-10 transition-transform duration-200 group-hover:rotate-180" />
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute top-full -left-2 mt-2 w-52 bg-black/90 backdrop-blur-md 
                rounded-lg shadow-2xl border border-white/20 overflow-hidden z-50 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300"> 
                
                <Link href="/signin/teacher">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10">
                    <div className="text-white font-semibold"> Academia </div>
                    {/* <div className="text-white/70 text-sm mt-1">Access teaching tools and student management</div> */}
                  </div>
                </Link>
                <Link href="/signin/student">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="text-white font-semibold">Student</div>
                    {/* <div className="text-white/70 text-sm mt-1">Access your personalized learning dashboard</div> */}
                  </div>
                </Link>
              </div>
              </div>
            )}
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
            {sessionUser ? (
              <Link href="/post-auth">
                <Button 
                  variant="outline"
                  className="w-full mt-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  Account{sessionUser.username ? ` (${sessionUser.username})` : ''}
                </Button>
              </Link>
            ) : (
              <>
                {/* Mobile Sign In Options */}
                <div className="space-y-2 mt-4 pt-4 border-t border-white/20">
                  <Link href="/signin/teacher">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                    >
                      As Institute
                    </Button>
                  </Link>
                  <Link href="/signin/student">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                    >
                      As a Student
                    </Button>
                  </Link>
                </div>
                
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
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
