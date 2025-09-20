import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";

// Fallback Textarea component if not present in UI kit
// Remove if you already have one at '@/components/ui/textarea'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FallbackTextarea(props: any) {
  return <textarea {...props} className={(props.className || "") + " border rounded-md p-2 bg-white/10 text-white"} />;
}

const SafeTextarea = (Textarea as any) ? Textarea : (FallbackTextarea as any);

type SessionResp = {
  authenticated: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  additionalInfo?: {
    phone?: string;
    organization?: string;
    bio?: string;
  };
};

export default function PostAuthPage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ phone: "", organization: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { credentials: "include" });
        const data: SessionResp = await res.json();
        if (!cancelled) {
          if (!res.ok) {
            setSession({ authenticated: false });
          } else {
            setSession(data);
            setForm({
              phone: data.additionalInfo?.phone || "",
              organization: data.additionalInfo?.organization || "",
              bio: data.additionalInfo?.bio || "",
            });
          }
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to fetch session");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(null);
    try {
      const res = await fetch("/api/additional-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to save");
      }
      setSaved("Saved successfully");
      setSession((prev) => prev ? { ...prev, additionalInfo: data.additionalInfo } : prev);
      // Redirect to courses page where available courses are derived from session details
      window.location.href = "/courses";
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gradient-to-br from-gray-50 via-white to-gray-100">Loading…</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-100">{error}</div>;
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Card className="bg-white shadow-md border border-gray-200 text-gray-900 w-full max-w-md">
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-600">Please sign in to view your session details and submit additional info.</p>
            <div className="flex gap-2">
              <Link href="/signin/student"><Button variant="secondary">Student Sign In</Button></Link>
              <Link href="/signin/teacher"><Button>Teacher Sign In</Button></Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session.user!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <div className="max-w-3xl mx-auto space-y-6 py-10 px-4">
        <div className="flex items-center justify-between">
          <Link href="/"><Button variant="secondary">Home</Button></Link>
          <form onSubmit={async (e) => { e.preventDefault(); await fetch("/api/logout", { method: "POST", credentials: "include" }); window.location.href = "/"; }}>
            <Button type="submit" variant="destructive">Logout</Button>
          </form>
        </div>

        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-gray-800">
            <div><span className="text-gray-600">Username:</span> {user.username}</div>
            <div><span className="text-gray-600">Email:</span> {user.email}</div>
            <div><span className="text-gray-600">Role:</span> {user.role}</div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-gray-900">Phone</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white border border-gray-300 text-gray-900" />
              </div>
              <div>
                <Label htmlFor="organization" className="text-gray-900">Organization</Label>
                <Input id="organization" name="organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="bg-white border border-gray-300 text-gray-900" />
              </div>
              <div>
                <Label htmlFor="bio" className="text-gray-900">Bio</Label>
                <SafeTextarea id="bio" name="bio" rows={4} value={form.bio} onChange={(e: any) => setForm({ ...form, bio: e.target.value })} className="bg-white border border-gray-300 text-gray-900 w-full" />
              </div>

              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                {saved && <span className="text-green-600 text-sm">{saved}</span>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
