import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CourseSummary {
  courseKey: string;
  courseName: string;
  completedTopics: number;
  totalTopics: number;
  percent: number;
  lastUpdated: string | null;
}

interface UserSummary {
  userId: string;
  username: string;
  email: string;
  courses: CourseSummary[];
}

interface SendResult {
  total: number;
  sent: number;
  failed: number;
  errors: { email: string; error: string }[];
}

export default function AdminProgressEmails() {
  const [, navigate] = useLocation();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingAll, setSendingAll] = useState(false);
  const [sendingUser, setSendingUser] = useState<string | null>(null);
  const [sendResult, setSendResult] = useState<SendResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Check admin session first, then fall back to regular session
        let sessionData = null;
        let isAuthenticated = false;
        
        // Try admin session
        const adminSessionRes = await fetch("/api/admin/session", { credentials: "include" });
        if (adminSessionRes.ok) {
          const adminData = await adminSessionRes.json();
          if (adminData?.authenticated) {
            sessionData = adminData;
            isAuthenticated = true;
          }
        }
        
        // Fall back to regular session if admin session not authenticated
        if (!isAuthenticated) {
          const sessionRes = await fetch("/api/session", { credentials: "include" });
          if (sessionRes.ok) {
            const regularData = await sessionRes.json();
            if (regularData?.authenticated) {
              sessionData = regularData;
              isAuthenticated = true;
            }
          }
        }
        
        if (!isAuthenticated || !sessionData) {
          navigate("/admin/login");
          return;
        }
        
        const role = String(sessionData?.user?.role || "").toLowerCase();
        if (role !== "teacher" && role !== "admin") {
          navigate("/courses");
          return;
        }
        setIsAuthed(true);

        const res = await fetch("/api/admin/users-progress", { credentials: "include" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || `Failed (${res.status})`);
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err: any) {
        setError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSendAll = async () => {
    if (!confirm("Send personalized progress emails to ALL users on the platform?")) return;
    setSendingAll(true);
    setSendResult(null);
    try {
      const res = await fetch("/api/admin/send-progress-emails", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setSendResult(data);
    } catch (err: any) {
      setError(err?.message || "Failed to send emails");
    } finally {
      setSendingAll(false);
    }
  };

  const handleSendOne = async (userId: string) => {
    setSendingUser(userId);
    try {
      const res = await fetch(`/api/admin/send-progress-email/${userId}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      alert("Email sent successfully!");
    } catch (err: any) {
      alert(err?.message || "Failed to send email");
    } finally {
      setSendingUser(null);
    }
  };

  if (!isAuthed && !loading) return null;

  const usersWithProgress = users.filter((u) => u.courses.length > 0);
  const usersWithoutProgress = users.filter((u) => u.courses.length === 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Progress Email Manager</h1>
            <p className="text-gray-500 mt-1">
              Send personalized course progress reports to users via email
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
              ← Dashboard
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow"
              disabled={sendingAll || loading}
              onClick={handleSendAll}
            >
              {sendingAll ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send to All Users ({users.length})
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Send Result Banner */}
        {sendResult && (
          <div className={`mb-6 p-4 rounded-lg border ${sendResult.failed > 0 ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200"}`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{sendResult.failed > 0 ? "⚠️" : "✅"}</span>
              <div>
                <p className="font-semibold text-gray-800">
                  Emails sent: {sendResult.sent} / {sendResult.total}
                </p>
                {sendResult.failed > 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    {sendResult.failed} failed:{" "}
                    {sendResult.errors.map((e) => `${e.email} (${e.error})`).join(", ")}
                  </p>
                )}
              </div>
              <Button variant="outline" size="sm" className="ml-auto" onClick={() => setSendResult(null)}>
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
            {error}
            <Button variant="outline" size="sm" className="ml-4" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-0 shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{users.length}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{usersWithProgress.length}</p>
                  <p className="text-sm text-gray-500">With Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{usersWithoutProgress.length}</p>
                  <p className="text-sm text-gray-500">No Progress Yet</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Table */}
        {!loading && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gray-50/50">
              <CardTitle className="text-lg">All Users & Course Progress</CardTitle>
            </CardHeader>
            <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
              <div className="divide-y">
                {users.map((u) => (
                  <div key={u.userId} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      {/* User info */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {(u.username || u.email || "?")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate">{u.username}</p>
                          <p className="text-sm text-gray-500 truncate">{u.email}</p>

                          {/* Course progress bars */}
                          {u.courses.length > 0 ? (
                            <div className="mt-3 space-y-2">
                              {u.courses.map((c) => {
                                const hasStarted = c.completedTopics > 0;
                                const isComplete = c.percent === 100 && c.totalTopics > 0;
                                return (
                                  <div key={c.courseKey} className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 w-44 truncate flex-shrink-0" title={c.courseName}>
                                      {c.courseName}
                                    </span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                      <div
                                        className={`h-2 rounded-full transition-all ${isComplete ? "bg-green-500" : hasStarted ? "bg-blue-500" : "bg-gray-300"}`}
                                        style={{ width: `${c.percent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600 w-16 text-right">
                                      {c.totalTopics > 0 ? `${c.completedTopics}/${c.totalTopics}` : "—"}
                                    </span>
                                    <Badge
                                      variant={isComplete ? "default" : "secondary"}
                                      className={`text-xs w-20 justify-center ${
                                        isComplete ? "bg-green-500 text-white" : hasStarted ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                      }`}
                                    >
                                      {isComplete ? "Complete" : hasStarted ? `${c.percent}%` : "Enrolled"}
                                    </Badge>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="mt-2 text-xs text-gray-400 italic">No courses enrolled</p>
                          )}
                        </div>
                      </div>

                      {/* Send button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                        disabled={sendingUser === u.userId}
                        onClick={() => handleSendOne(u.userId)}
                      >
                        {sendingUser === u.userId ? (
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Sending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Send Email
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}

                {users.length === 0 && !loading && (
                  <div className="p-12 text-center text-gray-400">
                    No users found
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
