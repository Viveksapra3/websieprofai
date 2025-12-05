import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// IndiaAI Mission Logo - for minimized state
const INDIA_AI_LOGO = "https://storageprdv2inwink.blob.core.windows.net/420a82bb-9653-422b-8f56-70bfebb4e75e/527ca2de-8828-4650-b19b-225d74fc778a";
// IndiaAI Mission Logo - for expanded/hover state
const INDIA_AI_LOGO_EXTENDED = "https://indiaai.gov.in/indiaAi-2021/build/images/logo-white.png";

// Pages where the popup should be visible
const ALLOWED_PAGES = ["/", "/courses"];

export function IndiaAIPopup() {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if current page is allowed
  const isAllowedPage = ALLOWED_PAGES.includes(location);

  useEffect(() => {
    // Only show on allowed pages
    if (!isAllowedPage) {
      setIsVisible(false);
      return;
    }

    // Check if popup was dismissed in this session
    const dismissed = sessionStorage.getItem('indiaAIPopupDismissed');
    if (!dismissed) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [location, isAllowedPage]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('indiaAIPopupDismissed', 'true');
  };

  const handleMinimize = () => {
    setIsVisible(false);
  };

  // Don't render anything if not on allowed page or dismissed
  if (isDismissed || !isAllowedPage) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* Minimized floating button */}
      {!isVisible && !isDismissed && isAllowedPage && (
        <div className="transition-all duration-1500 hover:scale-110 bg-white rounded-2xl p-3 shadow-lg animate-bounce cursor-pointer">
          <img 
            src={INDIA_AI_LOGO} 
            alt="IndiaAI Mission" 
            className="h-42 w-60 object-contain"
          />
        </div>
      )}

      {/* Full popup */}
      {isVisible && isAllowedPage && (
        <div className="w-80 animate-in slide-in-from-bottom-5 duration-300">
          <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
            {/* Tricolor accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-white to-green-500" />
            
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Minimize button */}
            <button
              onClick={handleMinimize}
              className="absolute top-3 right-10 text-gray-400 hover:text-white transition-colors z-10"
              aria-label="Minimize popup"
            >
              <span className="text-lg font-bold">−</span>
            </button>

            {/* Content */}
            <div className="p-5 pt-6">
              {/* Header with Logo */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img 
                    src={INDIA_AI_LOGO_EXTENDED} 
                    alt="IndiaAI Mission" 
                    className="w-16 h-16 object-contain"
                  />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">IndiaAI Mission</h3>
                  <p className="text-xs text-gray-400">Government of India Initiative</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                Join India's flagship AI education program. Learn cutting-edge AI skills and become part of the digital transformation journey.
              </p>

              {/* Features */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span>6 Comprehensive Modules</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  <span>Industry-Ready Curriculum</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Government Certified</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link href="/india-ai-mission">
                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold group"
                  onClick={handleMinimize}
                >
                  Explore Course
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500 mt-3">
                Powered by ProfAI Academy
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
