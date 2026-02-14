import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface BlogSummary {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  createdAt?: string | null;
}

// Use the same Pexels API as the courses page for dynamic hero images
const PEXELS_API_KEY = "6fBQxNQoBnEtNwqHNq3eQVjrwe2hrIWsdlpjtarCWKXdh6GSqoDYrdYG";
const MAX_CONCURRENT_FETCHES = 3;

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogImages, setBlogImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/blogs?limit=3");
        if (!res.ok) throw new Error("Failed to load blogs");
        const data = await res.json();
        if (!cancelled) {
          setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
        }
      } catch {
        if (!cancelled) setBlogs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch decorative images from Pexels for each blog card
  useEffect(() => {
    if (!blogs.length) return;

    const blogsToFetch = blogs.filter((b) => !blogImages[b.id]);
    if (!blogsToFetch.length) return;

    const fetchPexelsImage = async (query: string, blogId: string) => {
      if (!PEXELS_API_KEY) return;

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
        // Ignore errors – cards will fall back to gradient background
      }
    };

    let index = 0;
    const worker = async () => {
      while (index < blogsToFetch.length) {
        const blog = blogsToFetch[index++];
        const query = blog.title;
        await fetchPexelsImage(query, blog.id);
      }
    };

    const workers = Math.min(MAX_CONCURRENT_FETCHES, blogsToFetch.length);
    for (let i = 0; i < workers; i++) {
      worker();
    }
  }, [blogs]);

  if (!loading && blogs.length === 0) {
    // If there are no blogs yet, silently hide the section
    return null;
  }

  return (
    <section
      id="blog"
      className="py-20 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              From the <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ProfAI Blogs</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Insights, stories, and updates on AI-powered learning, education, and the future of skills.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/blogs">
              <Button className="inline-flex items-center gap-2 rounded-full px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-500/30">
                View all blogs
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading
            ? [1, 2, 3].map((idx) => (
                <motion.div
                  key={idx}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * idx }}
                  className="group rounded-2xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/70 dark:border-gray-700/70 shadow-md overflow-hidden flex flex-col animate-pulse"
                >
                  <div className="relative h-40 bg-gradient-to-br from-purple-500/40 to-blue-500/40" />
                  <div className="flex-1 p-5 space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                  </div>
                </motion.div>
              ))
            : blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 * index }}
                  className="group rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/70 dark:border-gray-800/80 shadow-lg hover:shadow-2xl overflow-hidden flex flex-col"
                >
                  {/* Image / placeholder */}
                  <div className="relative h-44 overflow-hidden">
                    {blogImages[blog.id] ? (
                      <img
                        src={blogImages[blog.id]}
                        alt={blog.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/70 to-blue-500/70 flex items-center justify-center text-white/80 text-sm font-medium">
                        ProfAI Blogs
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {blog.excerpt || "Read more about this topic on our blog."}
                    </p>

                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {blog.createdAt
                          ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
                      </span>
                      <Link href={`/blog/${encodeURIComponent(blog.slug)}`}>
                        <button className="inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline text-xs font-medium">
                          Read more
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
