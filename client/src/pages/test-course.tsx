import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";

export default function TestCoursePage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testCourseAccess = async () => {
      try {
        // Test authentication
        const authRes = await fetch("/api/session", { credentials: "include" });
        const authData = await authRes.json();
        
        // Test course access for s-101
        const accessRes = await fetch("/api/course/s-101/access", { credentials: "include" });
        const accessData = await accessRes.json();
        
        // Test debug endpoint
        const debugRes = await fetch("/api/debug/pricing/s-101");
        const debugData = await debugRes.json();

        setDebugInfo({
          auth: {
            status: authRes.status,
            authenticated: authData.authenticated,
            user: authData.user,
          },
          access: {
            status: accessRes.status,
            data: accessData,
          },
          debug: debugData,
        });
      } catch (error) {
        setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
      } finally {
        setLoading(false);
      }
    };

    testCourseAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Testing course access...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-10 mt-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Course Access Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="mt-6 space-x-4">
          <Button onClick={() => window.location.href = "/course/s-101"}>
            Try Free Course (s-101)
          </Button>
          <Button onClick={() => window.location.href = "/course/s-320"} variant="outline">
            Try Paid Course (s-320)
          </Button>
          <Button onClick={() => window.location.href = "/courses"} variant="secondary">
            Back to Courses
          </Button>
        </div>
      </div>
    </div>
  );
}
