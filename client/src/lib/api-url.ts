const VITE_API_BASE = import.meta.env.VITE_API_BASE as string | undefined;

export function buildApiUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const cleanBase = (VITE_API_BASE || "").endsWith("/")
    ? (VITE_API_BASE || "").slice(0, -1)
    : (VITE_API_BASE || "");

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  if (!cleanBase) {
    return cleanPath;
  }

  return `${cleanBase}${cleanPath}`;
}
