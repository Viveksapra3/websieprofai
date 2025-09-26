import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";

type Course = { id: string; title: string; level: string; tag?: string; description?: string; image?: string };

export default function CoursesPage() {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authRes = await fetch("/api/session", { credentials: "include" });
        const authData: any = await authRes.json();
        if (!authRes.ok || !authData.authenticated) {
          window.location.href = "/post-auth";
          return;
        }
        setIsTeacher(String(authData?.user?.role || "").toLowerCase() === "teacher");

        // Get external API base URL from environment
        const apiBase = import.meta.env.VITE_API_BASE as string | undefined;
        let normalized: Course[] = [];

        const fetchWithTimeout = (url: string, init: RequestInit = {}, timeoutMs = 8000) => {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeoutMs);
          return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(id));
        };

        const fetchAndNormalize = async (url: string, init?: RequestInit) => {
          let res: Response;
          try {
            res = await fetchWithTimeout(url, init);
          } catch (err: any) {
            if (err?.name === "AbortError") {
              throw new Error("Request timed out. Please try again.");
            }
            throw err;
          }
          const raw: any = await res.json().catch(() => null);
          if (!res.ok) throw new Error((raw && (raw.error || raw.message)) || `Failed (${res.status})`);
          // Accept shapes: array, single object, or { courses: [...] }
          const payload = raw && typeof raw === "object" && Array.isArray(raw.courses) ? raw.courses : raw;
          const list = Array.isArray(payload) ? payload : payload && typeof payload === "object" ? [payload] : [];
          return list.map((item: any) => ({
            id: String(item.course_id ?? item.id ?? crypto.randomUUID()),
            title: String(item.course_title ?? item.title ?? "Untitled Course"),
            level: String(item.level ?? "Beginner"),
            description:
              typeof item.modules === "number"
                ? `${item.modules} modules`
                : item.description ?? (Array.isArray(item.modules) ? `${item.modules.length} modules` : undefined),
            image: item.image ?? undefined,
            tag: item.tag ?? undefined,
          }));
        };

        // Try external API first, fallback to local if needed
        try {
          if (apiBase) {
            console.log(`[Courses] Fetching from external API: ${apiBase}/api/courses`);
            normalized = await fetchAndNormalize(`${apiBase}/api/courses`);
          } else {
            throw new Error("VITE_API_BASE not configured");
          }
        } catch (err) {
          console.warn("External API failed, trying local fallback:", err);
          try {
            normalized = await fetchAndNormalize(`/api/courses`, { method: "POST", credentials: "include" });
          } catch (err2) {
            console.error("Both external and local APIs failed:", err2);
            throw err2;
          }
        }

        if (!cancelled) setCourses(normalized);
      } catch (e: any) {
        if (!cancelled) {
          let msg = String(e?.message || "Failed to load courses");
          if (/Failed \(401\)/.test(msg)) {
            msg = "You are not authenticated. Please sign in again.";
          } else if (/Failed \(403\)/.test(msg)) {
            msg = "You do not have permission to view courses.";
          } else if (/Failed \(404\)/.test(msg)) {
            msg = "Courses endpoint not found.";
          } else if (/NetworkError|TypeError/i.test(String(e))) {
            msg = "Network error. Please check your connection or CORS settings.";
          }
          console.error("Courses load error:", e);
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (levelFilter !== "all" && c.level.toLowerCase() !== levelFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return c.title.toLowerCase().includes(q) || (c.tag || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
    });
  }, [courses, query, levelFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="space-y-4 w-80">
          <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600">
        <div className="text-lg font-semibold">{error}</div>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const handleRedirect = (courseId: string) => {
    window.location.href = `/course/${encodeURIComponent(courseId)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />

      <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Available Courses</h1>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              placeholder="Search courses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full sm:w-64"
            />

            <Select onValueChange={(val: any) => setLevelFilter(val)} defaultValue={levelFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isTeacher && (
            <Link href="/teacher/upload">
              <Button className="bg-black text-white hover:scale-105 hover:bg-gray-900 transition-all">
                + Add Course
              </Button>
            </Link>
          ) 
          // : (
          //   <Link href="/unlock-course">
          //     <Button className="bg-black text-white hover:scale-105 hover:bg-gray-900 transition-all flex items-center gap-2">
          //       <Unlock className="h-4 w-4" />
          //       <span>Unlock Course</span>
          //     </Button>
          //   </Link>
          // )
          }
        </div>

        {/* Courses Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-gray-500 mb-4">No courses found.</div>
            <Button variant="secondary" onClick={() => { setQuery(""); setLevelFilter("all"); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c) => (
              <article
                key={c.id}
                className="group relative border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
              >
                {/* Image */}
                <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img src={`https://picsum.photos/seed/${encodeURIComponent(c.title)}/800/600`} alt={c.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform" />
                 
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{c.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{c.description ?? "No description available."}</p>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        c.level.toLowerCase() === "beginner"
                          ? "bg-blue-100 text-blue-700"
                          : c.level.toLowerCase() === "intermediate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {c.level}
                    </span>

                    {c.tag && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">{c.tag}</span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleRedirect(c.id)}
                    className="w-full mt-3"
                  >
                    View Course
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
