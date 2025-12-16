import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Sparkles, ArrowRight, BookOpen, Award, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

// IndiaAI Mission Logo - for minimized state
const INDIA_AI_LOGO = "https://storageprdv2inwink.blob.core.windows.net/420a82bb-9653-422b-8f56-70bfebb4e75e/527ca2de-8828-4650-b19b-225d74fc778a";
// IndiaAI Mission Logo - for expanded/hover state
const INDIA_AI_LOGO_EXTENDED = "https://indiaai.gov.in/indiaAi-2021/build/images/logo-white.png";

// Pages where the popup should be visible
const ALLOWED_PAGES = ["/", "/courses"];

export function IndiaAIPopup() {
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Check if current page is allowed
  const isAllowedPage = ALLOWED_PAGES.includes(location);

  // Hide/show body overflow and navbar when modal opens/closes
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = 'none';
      }
    } else {
      document.body.style.overflow = '';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = '';
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      const navbar = document.querySelector('nav');
      if (navbar) {
        (navbar as HTMLElement).style.display = '';
      }
    };
  }, [isExpanded]);

  const handleMinimize = () => {
    setIsExpanded(false);
  };

  const handleExpand = () => {
    setIsExpanded(true);
  };

  // Don't render anything if not on allowed page
  if (!isAllowedPage) return null;

  return (
    <>
      {/* Minimized floating button */}
      {!isExpanded && (
        <div 
          className="fixed bottom-6 right-6 z-50 transition-all duration-300 hover:scale-110 bg-white rounded-2xl p-3 shadow-lg cursor-pointer"
          onClick={handleExpand}
          style={{
            animation: 'gentle-bounce 3s ease-in-out infinite'
          }}
        >
          <img 
            src={INDIA_AI_LOGO} 
            alt="IndiaAI Mission" 
            className="h-42 w-60 object-contain"
          />
        </div>
      )}

      {/* Expanded Modal */}
      {isExpanded && (
        <>
          {/* Backdrop with blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            onClick={handleMinimize}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div 
              className="w-full max-w-5xl pointer-events-auto animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden backdrop-blur-xl max-h-[70vh]">
                {/* Tricolor accent */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-white to-green-500" />
                
                {/* Close/Minimize button */}
                <button
                  onClick={handleMinimize}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10 bg-gray-800/50 rounded-full p-2 hover:bg-gray-700/50"
                  aria-label="Minimize popup"
                >
                  <X className="h-5 w-5" />
                </button>

                {/* Content - Landscape Layout */}
                <div className="flex flex-col md:flex-row h-full overflow-y-auto">
                  {/* Left Side - Logo and Title */}
                  <div className="md:w-2/5 bg-gradient-to-br from-orange-600/20 to-green-600/20 p-6 flex flex-col justify-center items-center border-r border-gray-700">
                    <div className="relative mb-4">
                      <img 
                        src={INDIA_AI_LOGO_EXTENDED} 
                        alt="IndiaAI Mission" 
                        className="w-32 h-32 object-contain"
                      />
                      <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-pulse" />
                    </div>
                    <h3 className="text-3xl font-bold text-white text-center mb-2">IndiaAI Mission</h3>
                    <p className="text-sm text-gray-300 text-center mb-4">Government of India Initiative</p>
                    <h4 className="text-xl font-semibold text-white text-center">YuvAI for All</h4>
                  </div>

                  {/* Right Side - Content */}
                  <div className="md:w-3/5 p-6">
                    {/* Main Description */}
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      Join India's flagship AI education program designed to democratize AI literacy across the nation. 
                      This comprehensive course empowers every learner to understand, use, and benefit from artificial 
                      intelligence responsibly, contributing to India's digital transformation journey.
                    </p>

                    {/* Key Features Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <BookOpen className="h-5 w-5 text-orange-500 mb-1" />
                        <h5 className="text-xs font-semibold text-white mb-0.5">6 Modules</h5>
                        <p className="text-xs text-gray-400">AI basics to advanced</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <Target className="h-5 w-5 text-white mb-1" />
                        <h5 className="text-xs font-semibold text-white mb-0.5">Industry Skills</h5>
                        <p className="text-xs text-gray-400">Practical tools</p>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <Award className="h-5 w-5 text-green-500 mb-1" />
                        <h5 className="text-xs font-semibold text-white mb-0.5">Certified</h5>
                        <p className="text-xs text-gray-400">Official certificate</p>
                      </div>
                    </div>

                    {/* Course Highlights */}
                    <div className="bg-gray-800/30 rounded-lg p-3 mb-4 border border-gray-700">
                      <h5 className="text-xs font-semibold text-white mb-2">What You'll Learn:</h5>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="flex items-start gap-1.5 text-xs text-gray-300">
                          <div className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                          <span>AI fundamentals & ML concepts</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-gray-300">
                          <div className="w-1 h-1 rounded-full bg-white mt-1.5 flex-shrink-0" />
                          <span>Generative AI & prompting</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-gray-300">
                          <div className="w-1 h-1 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <span>Practical AI tools</span>
                        </div>
                        <div className="flex items-start gap-1.5 text-xs text-gray-300">
                          <div className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                          <span>AI ethics & responsible use</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/india-ai-mission">
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold group py-5 text-sm"
                        onClick={handleMinimize}
                      >
                        Start Your AI Journey
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-500 mt-3">
                      Powered by ProfAI Academy • Free for All Indian Citizens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
