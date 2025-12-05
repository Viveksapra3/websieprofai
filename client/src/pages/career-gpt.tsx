import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Sparkles, Rocket, Code } from "lucide-react";
import Navigation from "@/components/navigation";
import { Link } from "wouter";

export default function CareerGPTPage() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
      <Navigation />
      
      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Development Icon */}
          <div className="relative mb-8 sm:mb-10 md:mb-12">
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            </div>
            
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {/* Rotating gears effect */}
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <Wrench className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-purple-500 opacity-30" />
                </div>
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: `rotate(${-rotation}deg)` }}
                >
                  <Code className="w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 text-blue-500 opacity-40" />
                </div>
                
                {/* Center icon */}
                <div className="relative z-10 bg-gradient-to-br from-purple-600 to-blue-600 p-6 sm:p-7 md:p-8 rounded-full">
                  <Rocket className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Career GPT
              </h1>
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
            </div>
            
            <div className="inline-block px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
              <p className="text-yellow-400 font-semibold text-base sm:text-lg">
                🚧 Under Development 🚧
              </p>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto px-4">
              We're building something amazing for your career growth!
            </p>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Career GPT will be your AI-powered career advisor, helping you navigate your professional journey with personalized insights, skill recommendations, and career path planning.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10 md:mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Sparkles className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">AI Career Advisor</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Get personalized career guidance powered by advanced AI
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Code className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Skill Gap Analysis</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Identify skills you need to reach your career goals
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Rocket className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Career Roadmaps</h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Get step-by-step plans to achieve your dream career
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Animation */}
          <div className="mb-8 sm:mb-10 md:mb-12 px-4">
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Development Progress</span>
                <span>75%</span>
              </div>
              <div className="h-2 sm:h-2.5 md:h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-1000"
                  style={{ width: '75%' }}
                >
                  <div className="h-full w-full bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3 sm:space-y-4 px-4">
            <p className="text-gray-300 text-base sm:text-lg">
              Want to be notified when Career GPT launches?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/courses">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full">
                  Explore Courses Meanwhile
                </Button>
              </Link>
              <Link href="/">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 px-6 sm:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg rounded-full"
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-purple-500/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2025 ProfessorsAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
