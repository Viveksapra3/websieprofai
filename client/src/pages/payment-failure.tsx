import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle, RefreshCw } from "lucide-react";
import Navigation from "@/components/navigation";

export default function PaymentFailurePage() {
  const [location] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const courseId = urlParams.get('courseId');

    if (orderId) {
      setOrderDetails({ orderId, courseId });
    }
    setLoading(false);
  }, []);

  const handleRetryPayment = () => {
    if (orderDetails?.courseId) {
      window.location.href = `/courses?retry=${encodeURIComponent(orderDetails.courseId)}`;
    } else {
      window.location.href = '/courses';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-64"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600">
                We couldn't process your payment. Please try again or contact support.
              </p>
            </div>

            {orderDetails?.orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span> {orderDetails.orderId}
                </p>
                {orderDetails.courseId && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Course ID:</span> {orderDetails.courseId}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleRetryPayment}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/courses">
                <Button variant="outline" className="w-full">
                  Browse Courses
                </Button>
              </Link>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Need Help?</strong><br />
                If you continue to experience issues, please contact our support team with your order ID.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
