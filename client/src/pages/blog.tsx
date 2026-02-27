import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/navigation";
import Footer from "@/components/sections/footer";
import { Button } from "@/components/ui/button";

interface BlogDetail {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  createdAt?: string | null;
}

export default function BlogDetailPage() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const [blog, setBlog] = useState<BlogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/blogs/${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load blog");
        if (!cancelled) {
          setBlog(data.blog as BlogDetail);
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message || "Failed to load blog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      <Navigation />

      <main className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/blogs">
            <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:text-white">
              ← Back to all blogs
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center text-gray-400">Loading blog...</div>
        ) : error || !blog ? (
          <div className="py-24 text-center text-red-400 text-sm">{error || "Blog not found"}</div>
        ) : (
          <article className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            {blog.imageUrl && (
              <div className="h-60 w-full overflow-hidden">
                <img
                  src={blog.imageUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="px-6 pt-6 pb-10">
              <p className="text-xs text-purple-300 mb-2">
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="text-lg text-gray-300 mb-6">{blog.excerpt}</p>
              )}

              <div className="prose prose-invert max-w-none text-gray-100 whitespace-pre-line text-sm sm:text-base leading-relaxed">
                {blog.content}
              </div>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
