import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import Logo from "@assets/prof-ai-logo_1755775207766-DKA28TFR.avif";

type SessionResp = {
  authenticated: boolean;
  user?: {
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

export function AuthNavbar() {
  const [session, setSession] = useState<SessionResp | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { credentials: "include" });
        const data: SessionResp = await res.json();
        if (!cancelled) setSession(res.ok ? data : { authenticated: false });
      } catch {
        if (!cancelled) setSession({ authenticated: false });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <header className="w-full bg-black backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <a className="font-semibold hover:opacity-80 inline-flex items-center">
              <img src={Logo} alt="Professor AI" className="h-auto w-52 object-contain" />
            </a>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {session?.authenticated && session.user ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <button className="px-3 py-1.5 rounded-md bg-white/10 border border-white/20 hover:bg-white/15  text-lg">
                  {session.user.username}
                </button>
              </HoverCardTrigger>
              <HoverCardContent className="w-64 bg-black/90 text-white border border-white/20">
                <div className="space-y-1 text-sm">
                  <div className="opacity-70">Account</div>
                  <div className="font-medium">{session.user.username}</div>
                  <div className="mt-2"><span className="opacity-70">Email:</span> {session.user.email}</div>
                  {session.additionalInfo?.phone && (
                    <div><span className="opacity-70">Phone:</span> {session.additionalInfo.phone}</div>
                  )}

                  {/* Logout button inside hover card */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await fetch("/api/logout", { method: "POST", credentials: "include" });
                      window.location.href = "/";
                    }}
                    className="mt-3"
                  >
                    <Button size="sm" variant="destructive" className="w-full">
                      Logout
                    </Button>
                  </form>
                </div>
              </HoverCardContent>
            </HoverCard>
          ) : (
            <Link href="/signin/student">
              <Button size="sm" variant="secondary">Sign in</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
