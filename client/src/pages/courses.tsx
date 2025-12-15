import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Unlock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import PaymentLoadingOverlay from "@/components/PaymentLoadingOverlay";
import CoursesLoadingAnimation from "@/components/CoursesLoadingAnimation";

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
  imageUrl?: string | null;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState("");

  // NEW state: Map course IDs to their fetched Pexels image URL
  const [courseImages, setCourseImages] = useState<Record<string, string>>({});

  const [query, setQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [viewMode, setViewMode] = useState<"all" | "my-courses">("all");

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

  // Handle page visibility to hide loading overlay when user navigates back
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && paymentLoading) {
        // User came back to the page, hide the loading overlay
        console.log('Page became visible, hiding payment loading overlay');
        setPaymentLoading(false);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      // Handle browser back/forward navigation
      if (event.persisted && paymentLoading) {
        console.log('Page restored from cache, hiding payment loading overlay');
        setPaymentLoading(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [paymentLoading]);

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
          setIsAuthenticated(true);
          setIsTeacher(String(authData?.user?.role || "").toLowerCase() === "teacher");
        } else {
          setIsAuthenticated(false);
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
            imageUrl: item.imageUrl || null,
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
          if (/Failed \(404\)/.test(msg)) {
            msg = "Courses endpoint not found.";
          } else if (/NetworkError|TypeError/i.test(String(e))) {
            msg = "Network error. Please check your connection or CORS settings.";
          }
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [location]);

  // --- Filtering Logic ---
  const filtered = useMemo(() => {
    return courses.filter((c) => {
      // Filter by view mode (my courses or all)
      if (viewMode === "my-courses" && !c.hasAccess && !c.isFree) return false;
      
      // Filter by level
      if (levelFilter !== "all" && c.level.toLowerCase() !== levelFilter) return false;
      
      // Filter by search query
      if (!query) return true;
      const q = query.toLowerCase();
      return c.title.toLowerCase().includes(q) || (c.tag || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q);
    });
  }, [courses, query, levelFilter, viewMode]);

  if (loading) {
    return <CoursesLoadingAnimation />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600">
        <div className="text-lg font-semibold">{error}</div>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const handleRedirect = (courseId: string, hasAccess: boolean, courseName: string, isFree: boolean) => {
    // Check if user is authenticated before allowing any course access
    if (!isAuthenticated) {
      // Redirect to login page
      window.location.href = "/signin/student";
      return;
    }

    if (hasAccess) {
      window.location.href = `/course/${encodeURIComponent(courseId)}`;
    } else {
      // Redirect to payment page or show payment modal
      handlePayment(courseId, courseName);
    }
  };

  const handlePayment = async (courseId: string, courseName: string) => {
    try {
      // Show loading overlay
      setSelectedCourseName(courseName);
      setPaymentLoading(true);

      // Safety timeout: hide overlay after 30 seconds if still loading
      const timeoutId = setTimeout(() => {
        console.warn('Payment loading timeout reached, hiding overlay');
        setPaymentLoading(false);
      }, 30000); // 30 seconds

      // Store timeout ID to clear it if needed
      (window as any).__paymentTimeout = timeoutId;

      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId }),
      });

      const data = await response.json();
      if (!response.ok) {
        setPaymentLoading(false);
        // Check if user is not authenticated
        if (response.status === 401) {
          // Redirect to sign-in page
          window.location.href = "/signin/student";
          return;
        }
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

      // Append in desired order: access_code first, then encRequest
      form.appendChild(accessCodeInput);
      form.appendChild(encReqInput);
      document.body.appendChild(form);
      console.log(data.accessCode, data.encryptedData?.length, data.ccavenueUrl);
      form.submit();
      // Keep loading overlay visible during redirect
    } catch (error) {
      // Clear timeout on error
      if ((window as any).__paymentTimeout) {
        clearTimeout((window as any).__paymentTimeout);
      }
      setPaymentLoading(false);
      console.error("Payment initialization error:", error);
      alert("Failed to initialize payment. Please try again.");
    }
  };
  
  // Placeholder for image while loading
  const loadingPlaceholder = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect fill="#f0f0f0" width="800" height="600"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="30" fill="#a0a0a0">Searching Pexels...</text></svg>`;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-fuchsia-600/20 to-orange-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 200, 0, 0.3) 0%, transparent 50%)
          `,
          animation: 'mesh-move 20s ease-in-out infinite'
        }}></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Payment Loading Overlay */}
      {paymentLoading && <PaymentLoadingOverlay courseName={selectedCourseName} />}
      
      <Navigation />

      <div className="max-w-[1600px] mx-auto py-8 mt-20 px-6 relative z-10">
        {/* Floating Header */}
        <div className="mb-16 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left: Title */}
            <div className="space-y-4 flex-1 animate-slide-in-left">
              <div className="inline-block pb-4">
                <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-tight">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-fuchsia-200 animate-shimmer pb-2" style={{
                    backgroundSize: '200% 100%'
                  }}>
                    {getPageTitle()}
                  </span>
                </h1>
              </div>
              <p className="text-gray-400 text-lg max-w-xl">
                Cutting-edge courses curated for the future
              </p>
              
              {/* View Mode Toggle */}
              {isAuthenticated && (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setViewMode("all")}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      viewMode === "all"
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                        : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-900 hover:text-gray-300 border border-zinc-800"
                    }`}
                  >
                    All Courses
                  </button>
                  <button
                    onClick={() => setViewMode("my-courses")}
                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      viewMode === "my-courses"
                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                        : "bg-zinc-900/50 text-gray-400 hover:bg-zinc-900 hover:text-gray-300 border border-zinc-800"
                    }`}
                  >
                    My Courses
                  </button>
                </div>
              )}
            </div>

            {/* Right: Filters */}
            <div className="flex flex-col sm:flex-row gap-3 animate-slide-in-right">
              <Input
                placeholder="Search anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full sm:w-72 h-12 bg-zinc-900/90 backdrop-blur-xl border-zinc-800 text-white placeholder:text-gray-500 rounded-2xl px-4 focus:bg-zinc-900 focus:border-violet-500 transition-all"
              />

              <Select onValueChange={(val: any) => setLevelFilter(val)} defaultValue={levelFilter}>
                <SelectTrigger className="h-12 w-full sm:w-44 bg-zinc-900/90 backdrop-blur-xl border-zinc-800 text-white rounded-2xl">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white backdrop-blur-xl">
                  <SelectItem value="all" className="focus:bg-violet-600">All Levels</SelectItem>
                  <SelectItem value="beginner" className="focus:bg-violet-600">Beginner</SelectItem>
                  <SelectItem value="intermediate" className="focus:bg-violet-600">Intermediate</SelectItem>
                  <SelectItem value="advanced" className="focus:bg-violet-600">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {isTeacher && (
                <Link href="/teacher/upload">
                  <Button className="h-12 px-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 rounded-2xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all">
                    + New Course
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Courses Display */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="text-gray-400 mb-6 text-xl">Nothing found</div>
            <Button 
              onClick={() => { setQuery(""); setLevelFilter("all"); }}
              className="bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 rounded-2xl"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((c, index) => {
              // Prioritize: 1) Custom DB image, 2) Pexels fetched image, 3) Loading placeholder
              const imageUrl = c.imageUrl || courseImages[c.id] || loadingPlaceholder;

              return (
                <article
                  key={c.id}
                  className="group relative overflow-hidden cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 40}ms` }}
                  onClick={() => handleRedirect(c.id, c.hasAccess || c.isFree || false, c.title, c.isFree || false)}
                >
                  {/* Glow Effect */}
                  <div className="absolute -inset-[1px] bg-gradient-to-br from-violet-600/30 via-fuchsia-600/30 to-orange-600/30 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-700"></div>
                  
                  {/* Card Container */}
                  <div className="relative h-[480px] bg-zinc-900/60 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 group-hover:border-violet-500/50 overflow-hidden transition-all duration-500 flex flex-col">
                    
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={imageUrl}
                        alt={c.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        style={{
                          filter: 'brightness(0.85) contrast(1.1)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>
                      
                      {/* Status Badge */}
                      {c.hasAccess && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-500/90 backdrop-blur-sm rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-500/30">
                          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                          OWNED
                        </div>
                      )}

                      {/* Level Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md ${
                          c.level.toLowerCase() === "beginner"
                            ? "bg-blue-500/30 text-blue-200 border border-blue-400/30"
                            : c.level.toLowerCase() === "intermediate"
                            ? "bg-amber-500/30 text-amber-200 border border-amber-400/30"
                            : "bg-rose-500/30 text-rose-200 border border-rose-400/30"
                        }`}>
                          {c.level.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex-grow space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-fuchsia-400 transition-all line-clamp-2 leading-tight">
                            {c.title}
                          </h3>
                          {c.tag && (
                            <span className="text-[9px] px-2 py-0.5 bg-zinc-800/80 rounded-md text-gray-400 whitespace-nowrap flex-shrink-0">
                              {c.tag}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 line-clamp-3">
                          {c.description ?? "Explore this comprehensive course"}
                        </p>
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/50">
                        <div>
                          {/* Only show price if course is not owned */}
                          {!c.hasAccess && (
                            c.isFree ? (
                              <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                                FREE
                              </span>
                            ) : (
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white">
                                  {c.currency === 'INR' ? '₹' : '$'}{c.price || 0}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-semibold text-xs transition-all group-hover:scale-110 ${
                          c.hasAccess || c.isFree 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" 
                            : "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                        }`}>
                          {!isAuthenticated 
                            ? "Login"
                            : c.hasAccess || c.isFree 
                              ? "Open" 
                              : "Buy"}
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes mesh-move {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
        }

        @keyframes shimmer {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-shimmer {
          animation: shimmer 8s linear infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out backwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}