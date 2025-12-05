import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Avatar } from "@/components/ui/avatar";
import { Check, X, LogOut, Home, Edit3, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import logoPath from "@assets/ProfAI-Updated.svg";

// Fallback Textarea + Avatar if not present in UI kit
// Remove if you already have implementations at '@/components/ui/*'
function FallbackTextarea(props: any) {
  return (
    <textarea
      {...props}
      className={(props.className || "") +
        " min-h-[96px] w-full resize-y rounded-md p-3 border bg-white/5 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-300"}
    />
  );
}

function FallbackAvatar({ name }: { name?: string }) {
  const initials = (name || "User").split(" ").map((s) => s[0]).slice(0, 2).join("");
  return (
    <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold text-lg">{initials}</div>
  );
}

const SafeTextarea = (Textarea as any) || (FallbackTextarea as any);
const SafeAvatar = (Avatar as any) || FallbackAvatar;

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

export default function PostAuthPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<SessionResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ phone: "", organization: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [editing, setEditing] = useState(true);

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

  async function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSaving(true);
    setSaved(null);
    try {
      // basic client validation
      if (!form.phone.trim() && !form.organization.trim() && !form.bio.trim()) {
        throw new Error("Please fill at least one field before saving.");
      }

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
      setEditing(false);
      // gentle success animation time for UX before navigation
      setTimeout(() => {
        window.location.href = "/courses";
      }, 700);
    } catch (e: any) {
      setError(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-gray-700">
          Loading…
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-700 mb-4">{error}</div>
            <div className="grid grid-cols-1 gap-3">
              <Link href="/signin/student">
                <Button className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700">
                  Student Sign In
                </Button>
              </Link>
              <Link href="/signin/teacher">
                <Button className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700">
                  Academia Sign In
                </Button>
              </Link>
              <Link href="/organization-contact">
                <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:from-purple-700 hover:to-red-700">
                  Organization Partnership
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session?.authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-zinc-900 via-stone-950 to-stone-900 flex items-center justify-center p-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        
        <div className="relative w-full max-w-md">
          {/* Back to Home Link */}
          <Link href="/">
            <Button 
              variant="ghost" 
              className="absolute z-[100] left-0 text-white/70 hover:text-white hover:scale-110 transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={logoPath} 
                  alt="ProfessorsAI Logo" 
                  className="h-12 w-auto"
                />
              </div>
              <CardTitle className="text-2xl font-bold text-white">Sign In Required</CardTitle>
              <p className="text-white/70">Please sign in to view your session details and submit additional info.</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <Link href="/signin/student">
                  <Button 
                    className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/30 text-white border-0"
                  >
                    Sign In as Student
                  </Button>
                </Link>
                <Link href="/signin/teacher">
                  <Button 
                    className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 text-white border-0"
                  >
                    Sign In as Academia
                  </Button>
                </Link>
                <Link href="/organization-contact">
                  <Button 
                    className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-size-200 bg-pos-0 hover:bg-pos-100 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 text-white border-0"
                  >
                    Organization Partnership
                  </Button>
                </Link>
              </div>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-transparent px-2 text-white/70">New to ProfessorsAI?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-white/70">
                  Don't have an account?{' '}
                  <Link href="/signup">
                    <span className="text-green-400 hover:text-green-300 font-medium cursor-pointer transition-colors">
                      Sign up here
                    </span>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const user = session.user!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <div className="max-w-4xl mx-auto py-12 px-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <SafeAvatar name={user.username} />
              <div>
                <h1 className="text-2xl font-semibold">Welcome back, {user.username}</h1>
                <p className="text-sm text-gray-600">Role: <span className="font-medium text-gray-800">{user.role}</span></p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/"><Button variant="ghost"><Home size={16} className="mr-2"/>Home</Button></Link>
              <form onSubmit={async (e) => { e.preventDefault(); await fetch("/api/logout", { method: "POST", credentials: "include" }); window.location.href = "/"; }}>
                <Button type="submit" variant="destructive"><LogOut size={16} className="mr-2"/>Logout</Button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 p-4">
              <CardHeader>
                <CardTitle className="text-base">Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-700">
                  <div><span className="text-gray-500">Username:</span> <span className="font-medium">{user.username}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{user.email}</span></div>
                  <div><span className="text-gray-500">Role:</span> <span className="font-medium">{user.role}</span></div>
                </div>
              </CardContent>
            </Card>

            <motion.div layout className="md:col-span-2">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>Additional Information</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant={editing ? "ghost" : "outline"} size="sm" onClick={() => setEditing((v) => !v)}>
                      <Edit3 size={14} className="mr-2" /> {editing ? "Editing" : "Edit"}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <form onSubmit={submit} className="space-y-4" aria-live="polite">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone" className="text-sm">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="mt-1"
                          placeholder="+1 555 123 456"
                          disabled={!editing || saving}
                        />
                        <p className="mt-1 text-xs text-gray-500">Optional — used for account recovery and notifications.</p>
                      </div>

                      <div>
                        <Label htmlFor="organization" className="text-sm">Organization</Label>
                        <Input
                          id="organization"
                          name="organization"
                          value={form.organization}
                          onChange={(e) => setForm({ ...form, organization: e.target.value })}
                          className="mt-1"
                          placeholder="Company or School"
                          disabled={!editing || saving}
                        />
                        <p className="mt-1 text-xs text-gray-500">Optional — helps us tailor your course recommendations.</p>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-sm">Bio</Label>
                      <SafeTextarea
                        id="bio"
                        name="bio"
                        rows={5}
                        value={form.bio}
                        onChange={(e: any) => setForm({ ...form, bio: e.target.value })}
                        className="mt-1"
                        placeholder="Tell us a bit about yourself — skills, interests or what you want to learn."
                        disabled={!editing || saving}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500">Max 500 characters</p>
                        <p className={`text-xs ${form.bio.length > 500 ? "text-red-600" : "text-gray-500"}`}>{form.bio.length}/500</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button type="submit" disabled={saving || !editing || form.bio.length > 500}>
                        {saving ? (
                          <span>Saving…</span>
                        ) : (
                          <span className="flex items-center gap-2"><Check size={14}/> Save</span>
                        )}
                      </Button>

                      {saved && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-600 flex items-center gap-2">
                          <Check size={14} /> {saved}
                        </motion.div>
                      )}

                      {error && <div className="text-sm text-red-600">{error}</div>}

                    </div>

                    <div className="mt-2 text-sm text-gray-500">After saving, you'll be redirected to the courses page with personalized recommendations.</div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
