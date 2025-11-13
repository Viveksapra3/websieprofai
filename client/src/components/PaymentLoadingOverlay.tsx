import { Loader2 } from "lucide-react";

interface PaymentLoadingOverlayProps {
  courseName: string;
}

export default function PaymentLoadingOverlay({ courseName }: PaymentLoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-8 py-12 bg-white/95 rounded-2xl shadow-2xl border border-gray-200 max-w-md mx-4">
        {/* Animated spinner */}
        <div className="relative">
          <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
          <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full animate-pulse" />
        </div>
        
        {/* Course name */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            {courseName}
          </h2>
          <p className="text-gray-600 font-medium">
            Processing your payment...
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we redirect you to the payment gateway
          </p>
        </div>
        
        {/* Progress dots */}
        <div className="flex gap-2">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
