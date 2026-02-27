import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BlogItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  createdAt?: string | null;
}

export default function AdminBlogsPage() {
  const [, navigate] = useLocation();
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    published: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const sessionRes = await fetch("/api/admin/session", { credentials: "include" });
        const sessionData = await sessionRes.json();
        if (!sessionRes.ok || !sessionData?.authenticated) {
          navigate("/admin/login");
          return;
        }
        if (sessionData.user?.role !== "admin") {
          navigate("/courses");
          return;
        }

        const res = await fetch("/api/admin/blogs", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load blogs");
        setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (err: any) {
        setError(err?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const refreshBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load blogs");
      setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load blogs");
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.content) {
      alert("Title and content are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create blog");
      setForm({ title: "", excerpt: "", content: "", published: true });
      await refreshBlogs();
    } catch (err: any) {
      setError(err?.message || "Failed to create blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await fetch(`/api/admin/blogs/${encodeURIComponent(id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to delete blog");
      await refreshBlogs();
    } catch (err: any) {
      setError(err?.message || "Failed to delete blog");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Blogs</h1>
            <p className="text-gray-500 mt-1">Create and remove blog posts shown on the ProfAI site.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/admin/dashboard")}>
              ← Dashboard
            </Button>
            <Button variant="outline" onClick={refreshBlogs} disabled={loading}>
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-sm text-red-700 flex justify-between items-center">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={() => setError(null)}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Create form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create Blog Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Blog title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short excerpt (optional)</label>
              <Input
                value={form.excerpt}
                onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                placeholder="One line summary for cards & SEO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={8}
                placeholder="Write your blog content here..."
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                Published
              </label>
              <Button onClick={handleCreate} disabled={saving}>
                {saving ? "Creating..." : "Create blog"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Existing blogs */}
        <Card>
          <CardHeader>
            <CardTitle>Existing Blogs</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-gray-500 text-sm">Loading blogs...</div>
            ) : blogs.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">No blogs created yet.</div>
            ) : (
              <div className="space-y-3">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex items-center justify-between gap-4 px-3 py-2 rounded border border-gray-200 bg-white"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{blog.title}</p>
                      <p className="text-xs text-gray-500 truncate">
                        /blog/{blog.slug}
                        {" "}
                        {blog.published ? "• Published" : "• Draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/blog/${encodeURIComponent(blog.slug)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        View
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(blog.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
