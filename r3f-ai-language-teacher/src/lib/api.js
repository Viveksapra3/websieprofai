"use client";

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function apiGet(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  return { ok: res.ok, status: res.status, data };
}

export async function apiPost(path, body = {}, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    body: JSON.stringify(body),
    ...opts,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    // ignore
  }
  return { ok: res.ok, status: res.status, data };
}
