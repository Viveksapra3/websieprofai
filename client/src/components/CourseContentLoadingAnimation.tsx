import { useEffect, useState } from "react";

export default function CourseContentLoadingAnimation() {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const loadingSteps = [
    { icon: "🔐", text: "Verifying access..." },
    { icon: "📚", text: "Loading course modules..." },
    { icon: "🎯", text: "Preparing content..." },
    { icon: "✨", text: "Almost ready..." },
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 12;
      });
    }, 250);

    // Step rotation
    const stepInterval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % loadingSteps.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden flex items-center justify-center">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow-more-delayed"></div>
      </div>

      {/* Grid overlay */}
      <div
        className="fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-10 px-4 max-w-2xl mx-auto">
        {/* Main Animation Container */}
        <div className="relative">
          {/* Outer hexagon ring */}
          <div className="absolute inset-0 animate-rotate-hexagon">
            <svg className="w-40 h-40" viewBox="0 0 100 100">
              <polygon
                points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Inner rotating circle */}
          <div className="absolute inset-4 animate-spin-slow-reverse">
            <div className="w-32 h-32 rounded-full border-2 border-transparent border-t-violet-500 border-r-fuchsia-500"></div>
          </div>

          {/* Center content */}
          <div className="relative w-40 h-40 flex items-center justify-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-600/30 via-fuchsia-600/30 to-orange-600/30 backdrop-blur-xl border border-white/10 flex items-center justify-center animate-pulse-glow">
              {/* Animated icon */}
              <div className="text-5xl animate-bounce-gentle" key={stepIndex}>
                {loadingSteps[stepIndex].icon}
              </div>
            </div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
              style={{
                animation: `orbit ${3 + i * 0.5}s linear infinite`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/50"></div>
            </div>
          ))}
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4 w-full">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">
            Loading Course
          </h2>

          {/* Current step with smooth transition */}
          <div className="h-8 flex items-center justify-center">
            <p
              className="text-gray-300 text-lg font-medium animate-fade-slide"
              key={stepIndex}
            >
              {loadingSteps[stepIndex].text}
            </p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="w-full max-w-md space-y-3">
          {/* Progress bar */}
          <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-700/50">
            <div
              className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-orange-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine"></div>
            </div>
          </div>

          {/* Progress info */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 font-mono">{Math.round(progress)}%</span>
            <span className="text-gray-500">Please wait...</span>
          </div>
        </div>

        {/* Loading dots indicator */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            ></div>
          ))}
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animation: `float-random ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <div
                className="w-1 h-1 rounded-full bg-violet-400/30"
                style={{
                  boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        @keyframes pulse-slow-more-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
        }

        @keyframes rotate-hexagon {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(236, 72, 153, 0.5);
            transform: scale(1.05);
          }
        }

        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fade-slide {
          0% { opacity: 0; transform: translateY(10px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }

        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg) translateX(70px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(70px) rotate(-360deg); }
        }

        @keyframes float-random {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-5px, -20px); }
          75% { transform: translate(-10px, -10px); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-pulse-slow-more-delayed {
          animation: pulse-slow-more-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-rotate-hexagon {
          animation: rotate-hexagon 8s linear infinite;
        }

        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 4s linear infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-fade-slide {
          animation: fade-slide 1.5s ease-in-out;
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
