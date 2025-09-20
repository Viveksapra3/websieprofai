"use client";

import { useEffect, useState, useCallback } from "react";
import { apiGet } from "@/lib/api";

export function useSession() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { ok, data } = await apiGet("/api/session");
      if (!ok || !data?.authenticated) {
        setUser(null);
        setError("Not authenticated");
      } else {
        setUser(data.user || null);
      }
    } catch (e) {
      setError("Failed to verify session");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { loading, user, error, refresh };
}
