import { useState } from "react";
import { AuthNavbar } from "@/components/auth-navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
export default function UnlockCoursePage() {
  const [courseCode, setCourseCode] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!courseCode.trim() || !professorName.trim()) {
      setError("Please provide both Course Code and Professor Name.");
      return;
    }

    try {
      setLoading(true);
      // Placeholder: call your backend once ready
      // const res = await fetch("/api/unlock-course", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ courseCode, professorName }) });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.error || data?.message || "Unlock failed");
      await new Promise((r) => setTimeout(r, 600));
      setSuccess("Course unlocked successfully (demo).");
    } catch (err: any) {
      setError(String(err?.message || "Failed to unlock course"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />

      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Unlock Course</h1>
          <Link href="/courses" className="hover:scale-105 transition-all">
            <Button variant="secondary" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </Button>
          </Link>
        </div>

        <form onSubmit={onSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Course Code</label>
            <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="e.g. CS101" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Professor Name</label>
            <Input value={professorName} onChange={(e) => setProfessorName(e.target.value)} placeholder="e.g. Dr. Kumar" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
          {success && <div className="text-sm text-green-700">{success}</div>}

          <Button type="submit" className="w-full bg-black text-white hover:scale-105 hover:bg-gray-900 transition-all" disabled={loading}>
            {loading ? "Verifying..." : "Unlock"}
          </Button>
        </form>
      </div>
    </div>
  );
}
