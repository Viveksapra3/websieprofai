import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Navigation from "@/components/navigation";

export default function PaymentSuccessPage() {
  const [location] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    const courseId = urlParams.get('courseId');

    if (orderId && courseId) {
      setOrderDetails({ orderId, courseId });
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="animate-pulse h-6 bg-gray-200 rounded w-64"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-screen pt-16">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600">
                Your course purchase has been completed successfully.
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Order ID:</span> {orderDetails.orderId}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Course ID:</span> {orderDetails.courseId}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {orderDetails?.courseId && (
                <Link href={`/course/${encodeURIComponent(orderDetails.courseId)}`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Start Learning
                  </Button>
                </Link>
              )}
              
              <Link href="/courses">
                <Button variant="outline" className="w-full">
                  Browse More Courses
                </Button>
              </Link>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              You can access your purchased course anytime from your courses page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
