import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  createdAt?: string | null;
}

// Use the same Pexels API for decorative blog images as the courses page
const PEXELS_API_KEY = "6fBQxNQoBnEtNwqHNq3eQVjrwe2hrIWsdlpjtarCWKXdh6GSqoDYrdYG";
const MAX_CONCURRENT_FETCHES = 5;

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blogImages, setBlogImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/blogs?limit=100");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load blogs");
        if (!cancelled) {
          setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load blogs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch decorative images for blogs via Pexels, independent of any table image data
  useEffect(() => {
    if (!blogs.length) return;

    const blogsToFetch = blogs.filter((b) => !blogImages[b.id]);
    if (!blogsToFetch.length || !PEXELS_API_KEY) return;

    const fetchPexelsImage = async (query: string, blogId: string) => {
      try {
        const searchUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
        const response = await fetch(searchUrl, {
          signal: AbortSignal.timeout(5000),
          headers: { Authorization: PEXELS_API_KEY },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const imageUrl = data.photos[0].src.large as string;
          setBlogImages((prev) => ({ ...prev, [blogId]: imageUrl }));
        }
      } catch {
        // Ignore failures, cards will fall back to gradient background
      }
    };

    let index = 0;
    const worker = async () => {
      while (index < blogsToFetch.length) {
        const blog = blogsToFetch[index++];
        await fetchPexelsImage(blog.title, blog.id);
      }
    };

    const workers = Math.min(MAX_CONCURRENT_FETCHES, blogsToFetch.length);
    for (let i = 0; i < workers; i++) {
      worker();
    }
  }, [blogs]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <Navigation />

      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 mb-4">
            <span className="text-xs font-semibold text-purple-200">Blog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Latest insights from <span className="text-purple-400">ProfAI</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Explore articles on AI in education, course updates, implementation stories, and more.
          </p>
        </section>

        {/* Content */}
        {loading ? (
          <div className="text-center text-gray-400 py-16">Loading blogs...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-16 text-sm">{error}</div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-gray-400 py-16 text-sm">No blog posts have been published yet.</div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="bg-gray-900/80 border border-gray-800/80 hover:border-purple-500/60 hover:shadow-purple-500/25 hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col rounded-2xl"
              >
                <div className="h-44 w-full overflow-hidden relative">
                  {blogImages[blog.id] ? (
                    <img
                      src={blogImages[blog.id]}
                      alt={blog.title}
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 to-blue-600/70 flex items-center justify-center text-sm text-white/85 font-medium">
                      ProfAI Blogs
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">{blog.title}</h2>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt || blog.content.slice(0, 160) + (blog.content.length > 160 ? "..." : "")}
                  </p>
                  <div className="mt-auto flex justify-between items-center">
                    <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      >
                        Read article
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
