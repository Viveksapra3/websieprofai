import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { testDbConnection, ensureSchema, pool } from "./db";
import { paymentService } from "./payment-service";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { createServer } from "http";
import { setupVite } from "./vite";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

// Simple logging function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// Increase limits for large file uploads and long processing times
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: false, limit: '500mb' }));

// --- Minimal CORS for cross-port session sharing with credentials ---
const defaultAllowed = ["http://localhost:3000", "http://127.0.0.1:3000"]; 
const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ORIGINS = allowedOrigins.length > 0 ? allowedOrigins : defaultAllowed;
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  if (origin && ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Vary", "Origin");
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, X-CSRF-Token"
  );
  
  // Fix for Firebase Google Sign-In popup (COOP error)
  res.header("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.header("Cross-Origin-Embedder-Policy", "unsafe-none");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// --- Sessions ---
const PgSessionStore = connectPgSimple(session);
app.set("trust proxy", 1); // if behind proxy (Heroku, etc.)
app.use(
  session({
    store: new PgSessionStore({
      pool,
      tableName: "session",
      // create the table automatically if it does not exist
      createTableIfMissing: true as any, // type not in older defs
      // Performance optimizations for session store
      pruneSessionInterval: 60 * 15, // Clean up expired sessions every 15 minutes
      errorLog: (error: Error) => console.error('[Session Store]', error),
    }) as any,
    name: process.env.SESSION_NAME || "sid",
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
      secure: String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      domain: process.env.COOKIE_DOMAIN || undefined,
    },
  })
);

// --- simple logging middleware (keeps your JSON capture) ---
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json.bind(res) as typeof res.json;
  (res as any).json = function (bodyJson: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson as any);
  };
  

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse !== undefined) {
        try {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        } catch {
          logLine += ` :: [unserializable response]`;
        }
      }

      if (logLine.length > 200) {
        // keep logs reasonable length (bigger than before so we don't chop important info)
        logLine = logLine.slice(0, 199) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// --- register app routes (assumes registerRoutes attaches your /api routes) ---
(async () => {
  // If registerRoutes is async, await it; if sync it still works.
  // Ensure DB schema exists (creates users table if missing)
  try {
    await ensureSchema();
    log("Database schema ensured");
  } catch (e) {
    log(`Failed ensuring DB schema: ${(e as Error).message}`);
  }

  await registerRoutes(app);

  // Test DB connection (optional but helpful for early failure)
  try {
    await testDbConnection();
    log("Database connection OK");
  } catch (e) {
    log(`Database connection FAILED: ${(e as Error).message}`);
  }

  // Auto-sync course pricing on startup
  try {
    const apiBase = process.env.VITE_API_BASE as string | undefined;
    if (apiBase) {
      log("Auto-syncing course pricing from external API...");
      const result = await paymentService.syncCoursePricing(apiBase);
      log(`Course sync completed: ${result.synced} new, ${result.updated} updated, ${result.total} total`);
    } else {
      log("Skipping course sync - VITE_API_BASE not configured");
    }
  } catch (e) {
    log(`Course sync failed: ${(e as Error).message}`);
  }

  // --- error handler (simple JSON error responses) ---
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";

    // log the error for debugging
    try {
      log(`ERROR: ${message} (${status})`);
      if (err && err.stack) {
        log(err.stack.split("\n").slice(0, 5).join("\n"));
      }
    } catch {
      /* ignore logging errors */
    }

    // respond to client
    res.status(status).json({ message });
    // do NOT re-throw here — keep the server stable
  });

  // In ESM, emulate __dirname for current module
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";

  // Create a single HTTP server so Vite can hook into HMR in development
  const httpServer = createServer(app);
  
  // Set server timeouts for long-running uploads (2+ hours)
  httpServer.timeout = 10 * 60 * 60 * 1000; // 10 hours
  httpServer.keepAliveTimeout = 10 * 60 * 60 * 1000; // 10 hours
  httpServer.headersTimeout = 10 * 60 * 60 * 1000 + 1000; // slightly more than keepAliveTimeout

  const nodeEnv = String(process.env.NODE_ENV || "").toLowerCase();
  if (nodeEnv === "development") {
    log("Starting in DEVELOPMENT mode with Vite middleware");
    // Use Vite middleware in dev for HMR and instant updates
    await setupVite(app, httpServer);
  } else {
    log("Starting in PRODUCTION mode serving static build");
    // Serve static files from the built client in production
    const distPath = path.resolve(__dirname, "..", "dist", "public");

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      log(`Serving static files from: ${distPath}`);

      // SPA fallback - serve index.html for all non-API routes
      app.get("*", (req, res) => {
        if (!req.path.startsWith("/api")) {
          res.sendFile(path.resolve(distPath, "index.html"));
        }
      });
    } else {
      log(`Warning: Build directory not found at ${distPath}. Run 'npm run build' first.`);
    }
  }

  httpServer.listen(port, host, () => {
    log(`Server running on http://${host}:${port}`);
  });
})();
