import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'wouter';
import logoPath from "@assets/prof-ai-logo_1755775207766-DKA28TFR.avif";
// import { useNavigate } from "react-router-dom";

type LearnMenuItem = {
  label: string;
  href: string;
  children?: LearnMenuItem[];
};

const buildCoursesHref = (opts?: {
  country?: string;
  category?: string;
  subcategory?: string;
  item?: string;
}) => {
  const params = new URLSearchParams();
  if (opts?.country) params.set('country', opts.country);
  if (opts?.category) params.set('category', opts.category);
  if (opts?.subcategory) params.set('subcategory', opts.subcategory);
  if (opts?.item) params.set('item', opts.item);
  const qs = params.toString();
  return `/courses${qs ? `?${qs}` : ''}`;
};

const makeCountryMenu = (label: string, country: string, includeCompetitiveExams: boolean): LearnMenuItem => {
  const base: LearnMenuItem = {
    label,
    href: buildCoursesHref({ country }),
    children: [
      {
        label: 'Schools',
        href: buildCoursesHref({ country, category: 'schools' }),
        children: [
          { label: 'Primary', href: buildCoursesHref({ country, category: 'schools', subcategory: 'primary' }) },
          { label: 'Secondary', href: buildCoursesHref({ country, category: 'schools', subcategory: 'secondary' }) },
          { label: 'Senior Education', href: buildCoursesHref({ country, category: 'schools', subcategory: 'senior' }) },
        ],
      },
      { label: 'Colleges', href: buildCoursesHref({ country, category: 'colleges' }) },
      {
        label: 'Skills',
        href: buildCoursesHref({ country, category: 'skills' }),
        children: [
          {
            label: 'Internship Projects',
            href: buildCoursesHref({ country, category: 'skills', subcategory: 'internship-projects' }),
          },
        ],
      },
      { label: 'Language', href: buildCoursesHref({ country, category: 'language' }) },
    ],
  };

  if (includeCompetitiveExams) {
    base.children?.splice(2, 0, {
      label: 'Competitive Exams',
      href: buildCoursesHref({ country, category: 'competitive-exams' }),
      children: [
        { label: 'NEET UG', href: buildCoursesHref({ country, category: 'competitive-exams', item: 'neet-ug' }) },
        { label: 'JEE', href: buildCoursesHref({ country, category: 'competitive-exams', item: 'jee' }) },
        { label: 'UGC NET', href: buildCoursesHref({ country, category: 'competitive-exams', item: 'ugc-net' }) },
        { label: 'CAT', href: buildCoursesHref({ country, category: 'competitive-exams', item: 'cat' }) },
        { label: 'UPSC', href: buildCoursesHref({ country, category: 'competitive-exams', item: 'upsc' }) },
      ],
    });
  }

  return base;
};

const learnMenuItems: LearnMenuItem[] = [
  makeCountryMenu('India', 'INDIA', true),
  makeCountryMenu('USA', 'America', false),
  makeCountryMenu('UAE', 'UAE', false),
  makeCountryMenu('Indonesia', 'Indonesia', false),
  makeCountryMenu('Saudi', 'Saudi', false),
  makeCountryMenu('Nigeria', 'Nigeria', false),
  { label: 'All Courses', href: buildCoursesHref() },
];

export default function Navigation() {
  // const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [isSignInDropdownOpen, setIsSignInDropdownOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<null | { username?: string; email?: string }>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'courses', 'avatar-teaching', 'features', 'how-it-works', 'partners', 'about', 'pricing', 'contact'];
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

  const renderDesktopLearnItems = (items: LearnMenuItem[]) =>
    items.map((item, idx) => {
      const isLast = idx === items.length - 1;
      const hasChildren = !!item.children?.length;

      return (
        <div key={item.label} className={hasChildren ? 'relative group/country' : 'relative'}>
          <a href={item.href}>
            <div
              className={`px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${
                isLast ? '' : 'border-b border-white/10'
              }`}
            >
              <div className="text-white font-semibold">{item.label}</div>
              {hasChildren && <ChevronRight className="w-4 h-4 text-white/70" />}
            </div>
          </a>

          {hasChildren && (
            <div
              className="absolute top-0 left-full ml-1 w-64 bg-black/90 backdrop-blur-md 
                rounded-lg shadow-2xl border border-white/20 overflow-visible z-50 
                opacity-0 invisible group-hover/country:opacity-100 group-hover/country:visible 
                transition-all duration-200"
            >
              {item.children!.map((child, childIdx) => {
                const childIsLast = childIdx === item.children!.length - 1;
                const childHasChildren = !!child.children?.length;

                return (
                  <div
                    key={`${item.label}-${child.label}`}
                    className={childHasChildren ? 'relative group/category' : 'relative'}
                  >
                    <a href={child.href}>
                      <div
                        className={`px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between ${
                          childIsLast ? '' : 'border-b border-white/10'
                        }`}
                      >
                        <div className="text-white font-semibold">{child.label}</div>
                        {childHasChildren && <ChevronRight className="w-4 h-4 text-white/70" />}
                      </div>
                    </a>

                    {childHasChildren && (
                      <div
                        className="absolute top-0 left-full ml-1 w-64 bg-black/90 backdrop-blur-md 
                          rounded-lg shadow-2xl border border-white/20 overflow-visible z-50 
                          opacity-0 invisible group-hover/category:opacity-100 group-hover/category:visible 
                          transition-all duration-200"
                      >
                        {child.children!.map((grandChild, grandIdx) => {
                          const grandIsLast = grandIdx === child.children!.length - 1;
                          return (
                            <a href={grandChild.href} key={`${item.label}-${child.label}-${grandChild.label}`}>
                              <div
                                className={`px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer ${
                                  grandIsLast ? '' : 'border-b border-white/10'
                                }`}
                              >
                                <div className="text-white font-semibold">{grandChild.label}</div>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );
    });

  const renderMobileLearnItems = (items: LearnMenuItem[], depth = 0): JSX.Element[] => {
    const pad = depth === 0 ? 'pl-0' : depth === 1 ? 'pl-4' : depth === 2 ? 'pl-8' : 'pl-12';

    return items.flatMap((item) => {
      const key = `m-${depth}-${item.label}`;

      const thisRow = (
        <a href={item.href} key={key}>
          <button
            className={`block py-2 ${pad} ${textColor} ${hoverColor} transition-colors w-full text-left text-sm`}
          >
            {item.label}
          </button>
        </a>
      );

      if (!item.children?.length) return [thisRow];

      return [thisRow, ...renderMobileLearnItems(item.children, depth + 1)];
    });
  };

  return (
    <nav className={`fixed top-2 left-0 right-0 z-50 transition-all duration-300 bg-transparent`} data-testid="main-navigation">
      <div className="max-w-10xl mx-auto  px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center py-1.5 px-4 sm:py-1.5 bg-black/90 rounded-full">
          <div className="flex items-center" data-testid="logo-brand">
            <Link href="/">
              <img 
                src={logoPath} 
                alt="ProfessorsAI Logo" 
                className="h-12 sm:h-14 w-auto cursor-pointer hover:scale-105 transition-transform duration-200"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {/* Teach Link */}
            <Link href="/teach">
              <button 
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
                data-testid="nav-teach"
              >
                Teach
              </button>
            </Link>

            {/* Learn Dropdown */}
            <div className="relative group">
              <button
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110 flex items-center`}
                data-testid="nav-learn"
              >
                Learn
                <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
              </button>

              {/* Learn Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-56 bg-black/90 backdrop-blur-md 
                rounded-lg shadow-2xl border border-white/20 overflow-visible z-50 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300">

                {renderDesktopLearnItems(learnMenuItems)}
              </div>
            </div>

            {/* How it works Button */}
            <Link href="/how-it-works">
              <button 
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
                data-testid="nav-how-it-works"
              >
                How it works
              </button>
            </Link>

            {/* AI Suite Dropdown */}
            <div className="relative group">
              <button
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110 flex items-center`}
                data-testid="nav-ai-suite"
              >
                AI Suite
                <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180" />
              </button>
              
              {/* AI Suite Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-64 bg-black/90 backdrop-blur-md 
                rounded-lg shadow-2xl border border-white/20 overflow-hidden z-50 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300">
                
                <Link href="/education-suite/api">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10">
                    <div className="text-white font-semibold">Education & Institutes</div>
                  </div>
                </Link>
                <Link href="/education-suite/product">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="text-white font-semibold">Enterprise & Corporate</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Career GPT Link */}
            {/* <Link href="/career-gpt">
              <button 
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
                data-testid="nav-career-gpt"
              >
                Career GPT
              </button>
            </Link> */}

            {/* About Link */}
            <Link href="/about">
              <button 
                className={`${textColor} ${hoverColor} transition-colors hover:scale-110`}
                data-testid="nav-about"
              >
                About us
              </button>
            </Link>

            {/* Why ProfAI? Link - Highlighted */}
            <Link href="/comparison">
              <button 
                className="relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:shadow-amber-500/50 border border-amber-400"
                data-testid="nav-comparison"
              >
                Why ProfAI?
              </button>
            </Link>
            
          </div>
          
          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* TRY IT OUT Button - only show when not logged in */}
            {!sessionUser && (
              <Link href="/courses">
                <Button
                  className="relative px-4 py-1.5 border rounded-full font-medium text-xs 
                    transition-all duration-300 transform hover:scale-105
                    bg-gradient-to-r from-purple-600 to-blue-600 
                    text-white shadow-md hover:shadow-purple-500/50 
                    border-transparent hover:from-purple-700 hover:to-blue-700"
                  data-testid="button-try-it-out"
                >
                  TRY IT OUT
                </Button>
              </Link>
            )}
            
            {/* Account (if signed in) or Sign In */}
            {sessionUser ? (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <button
                    className="relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg"
                    data-testid="button-account"
                  >
                    {sessionUser.username ? sessionUser.username.charAt(0).toUpperCase() : 'U'}
                  </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-64 bg-black/90 text-white border border-white/20">
                  <div className="space-y-1 text-sm">
                    <div className="mt-1">
                      <Link href="/courses">
                        <Button size="sm" className="w-full">Go to Courses</Button>
                      </Link>
                    </div>
                    <div className="mt-1">
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
                className="relative px-4 py-1.5 border rounded-full font-medium text-xs 
                  transition-all duration-500 transform 
                  hover:scale-105 hover:shadow-lg 
                  bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 
                  text-white shadow-md hover:shadow-purple-500/50 
                  overflow-hidden flex items-center"
                data-testid="button-sign-in"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <Sparkles className="w-3 h-3 mr-1 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Sign In</span>
                <ChevronDown className="w-3 h-3 ml-1 relative z-10 transition-transform duration-200 group-hover:rotate-180" />
              </Button>

              {/* Dropdown Menu */}
              <div className="absolute top-full -left-2 mt-2 w-52 bg-black/90 backdrop-blur-md 
                rounded-lg shadow-2xl border border-white/20 overflow-hidden z-50 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300"> 
                
                <Link href="/signin/teacher">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10">
                    <div className="text-white font-semibold">Teacher</div>
                    {/* <div className="text-white/70 text-sm mt-1">Access teaching tools and student management</div> */}
                  </div>
                </Link>
                <Link href="/signin/student">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer border-b border-white/10">
                    <div className="text-white font-semibold">Student</div>
                    {/* <div className="text-white/70 text-sm mt-1">Access your personalized learning dashboard</div> */}
                  </div>
                </Link>
                <Link href="/organization-contact">
                  <div className="px-6 py-4 hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="text-white font-semibold">Organization</div>
                    {/* <div className="text-white/70 text-sm mt-1">Enterprise training solutions</div> */}
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
            {/* Mobile Teach Link */}
            <Link href="/teach">
              <button className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left border-b border-white/20 pb-2 mb-2`}>
                Teach
              </button>
            </Link>

            {/* Mobile Learn Section */}
            <div className="border-b border-white/20 pb-2 mb-2">
              <div className="text-white font-semibold mb-2">Learn</div>
              {renderMobileLearnItems(learnMenuItems)}
            </div>

            {/* Mobile How it works Link */}
            <Link href="/how-it-works">
              <button className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left border-b border-white/20 pb-2 mb-2`}>
                How it works
              </button>
            </Link>

            {/* Mobile About Link */}
            <Link href="/about">
              <button className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left border-b border-white/20 pb-2 mb-2`}>
                About
              </button>
            </Link>

            {/* Mobile AI Suite Section */}
            <div className="border-b border-white/20 pb-2 mb-2">
              <div className="text-white font-semibold mb-2">AI Suite</div>
              <Link href="/education-suite/api">
                <button className={`block py-2 pl-4 ${textColor} ${hoverColor} transition-colors w-full text-left text-sm`}>
                  Education & Institutes
                </button>
              </Link>
              <Link href="/education-suite/product">
                <button className={`block py-2 pl-4 ${textColor} ${hoverColor} transition-colors w-full text-left text-sm`}>
                  Enterprise & Corporate
                </button>
              </Link>
            </div>

            {/* Mobile Career GPT Link */}
            <Link href="/career-gpt">
              <button className={`block py-2 ${textColor} ${hoverColor} transition-colors w-full text-left border-b border-white/20 pb-2 mb-2`}>
                Career GPT
              </button>
            </Link>

            {/* Mobile Why ProfAI? Link */}
            <Link href="/comparison">
              <Button className="w-full mb-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 border border-amber-400">
                Why ProfAI?
              </Button>
            </Link>
            
            {/* TRY IT OUT Button - only show when not logged in */}
            {!sessionUser && (
              <Link href="/courses">
                <Button
                  className="w-full mt-2 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                >
                  TRY IT OUT
                </Button>
              </Link>
            )}
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
                      Academia
                    </Button>
                  </Link>
                  <Link href="/signin/student">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                    >
                      Student
                    </Button>
                  </Link>
                  <Link href="/organization-contact">
                    <Button 
                      variant="outline"
                      className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                    >
                      Organization
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
