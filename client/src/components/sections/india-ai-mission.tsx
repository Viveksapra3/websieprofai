import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap } from 'lucide-react';

export default function IndiaAIMissionSection() {
  return (
    <section id="india-ai-mission" className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Image */}
            <div className="relative h-full min-h-[400px] bg-gradient-to-br from-orange-100 to-green-100">
              <img
                src="https://storageprdv2inwink.blob.core.windows.net/420a82bb-9653-422b-8f56-70bfebb4e75e/527ca2de-8828-4650-b19b-225d74fc778a"
                alt="India AI Mission"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
              {/* Overlay gradient for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-green-500/10"></div>
            </div>

            {/* Right side - Content */}
            <div className="p-8 md:p-12">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-green-100 rounded-full border border-orange-300">
                  <span className="text-2xl">🇮🇳</span>
                  <span className="text-sm font-semibold text-gray-800">India AI Mission Initiative</span>
                </div>

                {/* Heading */}
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Start Your Learning Journey
                </h2>

                {/* Description */}
                <p className="text-lg text-gray-600 leading-relaxed">
                  Access comprehensive course materials, track your progress, and earn certificates. 
                  Part of India's mission to democratize AI education and empower learners nationwide.
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Track progress across multiple modules</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Earn verified certificates upon completion</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">Learn at your own pace with flexible scheduling</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link href="/india-ai-course">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                    >
                      <GraduationCap className="mr-2 h-5 w-5" />
                      Access My Course
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>

                {/* Additional Info */}
                <p className="text-sm text-gray-500 italic">
                  Supported by the India AI Mission to build a skilled AI workforce
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
