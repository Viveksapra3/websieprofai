import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import Navigation from "@/components/navigation";

// Define the core structure of a Course
type Course = {
  id: string;
  title: string;
  level: string;
  tag?: string;
  description?: string;
  price?: number;
  currency?: string;
  isFree?: boolean;
  hasAccess?: boolean;
};

// Global constants for Pexels API
const PEXELS_API_KEY = "6fBQxNQoBnEtNwqHNq3eQVjrwe2hrIWsdlpjtarCWKXdh6GSqoDYrdYG";
const MAX_CONCURRENT_FETCHES = 5; // Limit concurrent requests to manage load

export default function CoursesPage() {
  const [location] = useLocation();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState(false);

  // NEW state: Map course IDs to their fetched Pexels image URL
  const [courseImages, setCourseImages] = useState<Record<string, string>>({});

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");

  // Get course type from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const courseType = urlParams.get('type');

  // Determine page title based on course type
  const getPageTitle = () => {
    switch (courseType) {
      case 'undergrad':
        return 'Undergrad Courses';
      case 'high-school':
        return 'High School Courses';
      case 'skill-development':
        return 'Skill Development Courses';
      default:
        return 'Available Courses';
    }
  };

  // --- Pexels Image Fetching Logic ---

  // Function to fetch a relevant image from Pexels API
  const fetchPexelsImage = async (query: string, courseId: string) => {
    if (!PEXELS_API_KEY) {
      console.warn("Pexels API Key not configured. Using placeholder.");
      // Fallback placeholder (light gray SVG)
      const placeholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#ccc" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="#666">No API Key</text></svg>`;
      setCourseImages(prev => ({ ...prev, [courseId]: placeholder }));
      return;
    }

    try {
      // Pexels Search API endpoint
      const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;

      const response = await fetch(searchUrl, { 
        signal: AbortSignal.timeout(5000),
        headers: {
          // Pexels requires the API key in the Authorization header
          Authorization: PEXELS_API_KEY,
        }
      });

      if (!response.ok) throw new Error(`Pexels API failed with status ${response.status}`);

      const data = await response.json();

      if (data.photos && data.photos.length > 0) {
        // Use the 'large' size for high quality display
        const imageUrl = data.photos[0].src.large;
        setCourseImages(prev => ({ ...prev, [courseId]: imageUrl }));
      } else {
         // Placeholder for 'no image found' (dark gray SVG)
        const notFound = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#aaa" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="#444">Image Not Found</text></svg>`;
        setCourseImages(prev => ({ ...prev, [courseId]: notFound }));
      }
    } catch (error) {
      console.error(`Failed to fetch Pexels image for "${query}":`, error);
      // Fallback on error
      const errorPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#f00" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="40" fill="#fff">API Error</text></svg>`;
      setCourseImages(prev => ({ ...prev, [courseId]: errorPlaceholder }));
    }
  };

  // NEW useEffect to fetch images after courses are loaded
  useEffect(() => {
    if (courses.length > 0) {
      // Filter for courses that don't already have an image
      const coursesToFetch = courses.filter(c => !courseImages[c.id]);

      // Worker pattern to limit concurrent API calls
      let index = 0;
      const worker = async () => {
        while (index < coursesToFetch.length) {
          const course = coursesToFetch[index++];
          // Use a combination of tag and title for accurate search
          const query = `${course.title} ${course.tag || ''}`;
          await fetchPexelsImage(query, course.id);
        }
      };

      // Start multiple workers
      for (let i = 0; i < MAX_CONCURRENT_FETCHES; i++) {
        worker();
      }
    }
  }, [courses]); // Run when course list changes


  // --- Main Course Data Fetching (Original Logic - Unchanged) ---
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authRes = await fetch("/api/session", { credentials: "include" });
        const authData: any = await authRes.json();
        if (authRes.ok && authData.authenticated) {
          setIsTeacher(String(authData?.user?.role || "").toLowerCase() === "teacher");
        }

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
            tag: item.tag ?? undefined,
          }));
        };

        try {
          // Use the new pricing API that combines external courses with pricing info
          const res = await fetchWithTimeout(`/api/courses-with-pricing`, { credentials: "include" });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || `Failed (${res.status})`);
          
          normalized = data.courses.map((item: any) => ({
            id: String(item.id),
            title: String(item.title),
            level: String(item.level),
            description: item.description,
            tag: item.tag,
            price: item.price,
            currency: item.currency,
            isFree: item.isFree,
            hasAccess: item.hasAccess,
          }));
        } catch (err) {
          console.warn("Pricing API failed, trying fallback:", err);
          try {
            if (apiBase) {
              console.log(`[Courses] Fetching from external API: ${apiBase}/api/courses`);
              normalized = await fetchAndNormalize(`${apiBase}/api/courses`);
            } else {
              normalized = await fetchAndNormalize(`/api/courses`, { method: "POST", credentials: "include" });
            }
          } catch (err2) {
            console.error("All APIs failed:", err2);
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

  // --- Filtering Logic (Unchanged) ---
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

  const handleRedirect = (courseId: string, hasAccess: boolean) => {
    if (hasAccess) {
      window.location.href = `/course/${encodeURIComponent(courseId)}`;
    } else {
      // Redirect to payment page or show payment modal
      handlePayment(courseId);
    }
  };

  const handlePayment = async (courseId: string) => {
    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Failed to initialize payment");
        return;
      }

      // Create a form and submit to CCAvenue
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.ccavenueUrl;
      form.style.display = "none";

      const encReqInput = document.createElement("input");
      encReqInput.type = "hidden";
      encReqInput.name = "encRequest";
      encReqInput.value = data.encryptedData;

      const accessCodeInput = document.createElement("input");
      accessCodeInput.type = "hidden";
      accessCodeInput.name = "access_code";
      accessCodeInput.value = data.accessCode;

      form.appendChild(encReqInput);
      form.appendChild(accessCodeInput);
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Payment initialization error:", error);
      alert("Failed to initialize payment. Please try again.");
    }
  };
  
  // Placeholder for image while loading
  const loadingPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#f0f0f0" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="30" fill="#a0a0a0">Searching Pexels...</text></svg>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <Navigation />

      <div className="max-w-6xl mx-auto py-10 mt-16 px-4 space-y-8">
        {/* Header + Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>

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
            {filtered.map((c) => {
              const imageUrl = courseImages[c.id] || loadingPlaceholder;

              return (
                <article
                  key={c.id}
                  className="group relative border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  {/* Image Section */}
                  <div className="h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      // 💡 UPDATED: Use the URL fetched from Pexels
                      src={imageUrl}
                      alt={`Image for ${c.title}`}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                    />
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

                    {/* Pricing Information */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {c.isFree ? (
                          <span className="text-lg font-bold text-green-600">FREE</span>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {c.currency === 'INR' ? '₹' : '$'}{c.price || 0}
                          </span>
                        )}
                        {c.hasAccess && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            ✓ Purchased
                          </span>
                        )}
                      </div>
                      {!c.hasAccess && !c.isFree && (
                        <Unlock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleRedirect(c.id, c.hasAccess || c.isFree || false)}
                      className={`w-full mt-3 ${
                        c.hasAccess || c.isFree 
                          ? "bg-green-600 hover:bg-green-700" 
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {c.hasAccess || c.isFree ? "View Course" : `Buy for ${c.currency === 'INR' ? '₹' : '$'}${c.price || 0}`}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}