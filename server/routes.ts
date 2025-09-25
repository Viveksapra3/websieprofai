import type { Express, Request, Response, NextFunction } from "express";
import { db, pool } from "./db";
import { users } from "@shared/schema";
import { eq, or, sql } from "drizzle-orm";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const hashBuffer = Buffer.from(key, "hex");
  const derived = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(hashBuffer, derived);
}

export async function registerRoutes(app: Express): Promise<void> {
  // Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", message: "API is running" });
  });

  // Database health check with performance metrics
  app.get("/api/health/db", async (_req: Request, res: Response) => {
    const start = Date.now();
    try {
      await db.execute(sql`SELECT 1`);
      const duration = Date.now() - start;
      const poolStats = {
        totalCount: pool.totalCount,
        idleCount: pool.idleCount,
        waitingCount: pool.waitingCount,
      };
      res.json({ 
        status: "ok", 
        message: "Database is connected",
        responseTime: `${duration}ms`,
        connectionPool: poolStats
      });
    } catch (error) {
      const duration = Date.now() - start;
      res.status(500).json({ 
        status: "error", 
        message: "Database connection failed",
        responseTime: `${duration}ms`,
        error: (error as Error).message
      });
    }
  });

  // --- File uploads (teacher courses) ---
  const __routesDir = path.dirname(fileURLToPath(import.meta.url));
  const uploadsDir = path.resolve(__routesDir, "..", "uploads");
  // ensure uploads dir exists
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}

  // Persist uploaded courses metadata to a JSON file inside uploadsDir
  const coursesJsonPath = path.join(uploadsDir, "courses.json");

  // In-memory cache for courses to avoid repeated file I/O
  let coursesCache: any[] | null = null;
  let cacheTimestamp = 0;
  const CACHE_TTL = 30000; // 30 seconds cache

  function readUploadedCoursesFromDisk(): any[] {
    try {
      const raw = fs.readFileSync(coursesJsonPath, "utf-8");
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function readUploadedCourses(): any[] {
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (coursesCache !== null && (now - cacheTimestamp) < CACHE_TTL) {
      return coursesCache;
    }
    
    // Cache is stale or doesn't exist, read from disk and update cache
    coursesCache = readUploadedCoursesFromDisk();
    cacheTimestamp = now;
    return coursesCache;
  }

  function invalidateCoursesCache(): void {
    coursesCache = null;
    cacheTimestamp = 0;
  }

  function writeUploadedCourses(courses: any[]): void {
    try {
      fs.writeFileSync(coursesJsonPath, JSON.stringify(courses, null, 2), "utf-8");
      // Invalidate cache after writing new data
      invalidateCoursesCache();
    } catch (e) {
      // swallow write error; endpoint will still respond with upload info
    }
  }

  const storage = multer.diskStorage({
    destination: (_req: any, _file: any, cb: any) => cb(null, uploadsDir),
    filename: (_req: any, file: any, cb: any) => {
      const ext = path.extname(file.originalname) || ".pdf";
      const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, "_");
      cb(null, `${Date.now()}_${base}${ext}`);
    },
  });
  const upload = multer({
    storage,
    fileFilter: (_req: any, file: any, cb: any) => {
      // Accept only PDFs
      if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
        return cb(null, true);
      }
      cb(new Error("Only PDF files are allowed"));
    },
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  });

  // Teacher upload endpoint
  app.post("/api/teacher/courses", upload.single("pdf"), (req: Request, res: Response) => {
    const sessUser = (req.session as any)?.user;
    if (!sessUser) return res.status(401).json({ error: "Not authenticated" });
    if (String(sessUser.role).toLowerCase() !== "teacher") return res.status(403).json({ error: "Only teachers can upload courses" });

    const courseName = (req.body as any)?.courseName?.trim();
    if (!courseName) return res.status(400).json({ error: "courseName is required" });
    const file = (req as any).file as any;
    if (!file) return res.status(400).json({ error: "PDF file is required" });

    // In a real app, persist a DB record linking teacher -> course -> filePath
    // Save course metadata in courses.json
    const all = readUploadedCourses();
    const newCourse = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      title: courseName,
      level: "Beginner",
      teacherId: sessUser.id,
      file: { filename: file.filename, originalName: file.originalname, size: file.size },
      createdAt: new Date().toISOString(),
    };
    all.push(newCourse);
    writeUploadedCourses(all);

    const payload = {
      message: "Course uploaded",
      course: { id: newCourse.id, name: courseName, teacherId: sessUser.id },
      file: { filename: file.filename, originalName: file.originalname, size: file.size },
    };
    return res.status(201).json(payload);
  });

  // SESSION: return current authenticated user from session cookie
  app.get("/api/session", (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    const additionalInfo = (req.session as any)?.additionalInfo;
    if (!user) {
      return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true, user, additionalInfo });
  });

  // LOGOUT: destroy session and clear cookie
  app.post("/api/logout", (req: Request, res: Response) => {
    const sess = req.session as any;
    if (!sess) return res.json({ message: "No session" });
    sess.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      try {
        const cookieName = process.env.SESSION_NAME || "sid";
        res.clearCookie(cookieName, {
          httpOnly: true,
          sameSite: (process.env.COOKIE_SAMESITE as any) || "lax",
          secure: String(process.env.COOKIE_SECURE || "false").toLowerCase() === "true",
          domain: process.env.COOKIE_DOMAIN || undefined,
        });
      } catch {}
      return res.json({ message: "Logged out" });
    });
  });

  // ADDITIONAL INFO: accept and store extra info in the session (demo implementation)
  app.post("/api/additional-info", (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const { phone, organization, bio } = req.body ?? {};
    (req.session as any).additionalInfo = { phone, organization, bio };
    return res.json({ message: "Saved", additionalInfo: (req.session as any).additionalInfo });
  });

  // COURSES: derive available courses using session details (simple demo rules)
  app.post("/api/courses", (req: Request, res: Response) => {
    const user = (req.session as any)?.user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const info = (req.session as any)?.additionalInfo || {};

    const role = String(user.role || "student").toLowerCase();
    const org = String(info.organization || "").toLowerCase();
    const bio = String(info.bio || "").toLowerCase();

    // Load uploaded courses from disk
    const uploaded = readUploadedCourses();

    // Map uploaded courses to client-facing shape
    const mapCourse = (c: any) => ({
      id: c.id,
      title: c.title,
      level: c.level || "Beginner",
      tag: c.teacherId ? "uploaded" : undefined,
      description: c.file?.originalName ? `Uploaded file: ${c.file.originalName}` : undefined,
      image: undefined as string | undefined,
    });

    let courses: Array<{ id: string; title: string; level: string; tag?: string; description?: string; image?: string }> = [];

    if (role === "teacher") {
      // Show only the teacher's own uploads
      const mine = uploaded.filter((c) => String(c.teacherId) === String(user.id)).map(mapCourse);
      courses = mine;
    } else {
      // Students see ALL uploaded courses (from all teachers)
      const allUploads = uploaded.map(mapCourse);
      // Keep some sample courses as well (optional)
      const samples: Array<{ id: string; title: string; level: string; tag?: string }> = [
        { id: "s-101", title: "Study Skills Fundamentals", level: "Beginner" },
        { id: "s-201", title: "Math with AI Tutors", level: "Intermediate" },
      ];
      if (bio.includes("art") || org.includes("design")) {
        samples.push({ id: "s-310", title: "Creative Coding with Three.js", level: "Intermediate", tag: "interest" });
      }
      if (bio.includes("data") || org.includes("analytics")) {
        samples.push({ id: "s-320", title: "Intro to Data Science", level: "Beginner", tag: "interest" });
      }
      courses = [...allUploads, ...samples];
    }

    return res.json({ courses });
  });

  // SIGNUP
  app.post("/api/signup", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        username,
        fullName,
        email,
        password,
        role,
        studentType,
        collegeName,
        degree,
        schoolClass,
        schoolAffiliation,
        termsAccepted,
      } = req.body ?? {};

      // Accept fullName from client as username fallback
      const resolvedUsername: string | undefined = username ?? fullName;

      if (!resolvedUsername || !email || !password) {
        return res.status(400).json({ error: "username (or fullName), email and password are required" });
      }
      if (!termsAccepted) {
        return res.status(400).json({ error: "You must accept the Terms of Use to sign up" });
      }

      // Check if user exists
      const existing = await db
        .select()
        .from(users)
        .where(or(eq(users.email, email), eq(users.username, resolvedUsername)))
        .limit(1);
      if (existing.length > 0) {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }

      const passwordHash = hashPassword(password);
      const newRole = role === "teacher" ? "teacher" : "student";

      const inserted = await db
        .insert(users)
        .values({
          username: resolvedUsername,
          email,
          password: passwordHash,
          role: newRole,
          studentType: newRole === "student" ? studentType ?? null : null,
          collegeName: newRole === "student" && (studentType ?? "").toLowerCase() === "college" ? collegeName ?? null : null,
          degree: newRole === "student" && (studentType ?? "").toLowerCase() === "college" ? degree ?? null : null,
          schoolClass: newRole === "student" && (studentType ?? "").toLowerCase() === "school" ? schoolClass ?? null : null,
          schoolAffiliation: newRole === "student" && (studentType ?? "").toLowerCase() === "school" ? schoolAffiliation ?? null : null,
          termsAccepted: Boolean(termsAccepted),
        })
        .returning({ id: users.id, username: users.username, email: users.email, role: users.role });
      const user = inserted[0];
      // create session
      try {
        (req.session as any).user = { id: user.id, username: user.username, email: user.email, role: user.role };
      } catch {}

      // compute redirect URL (per role or default)
      const redirectUrl =
        (user.role === "teacher" && process.env.TEACHER_REDIRECT_URL)
          ? process.env.TEACHER_REDIRECT_URL
          : (user.role === "student" && process.env.STUDENT_REDIRECT_URL)
            ? process.env.STUDENT_REDIRECT_URL
            : process.env.REDIRECT_URL || (user.role === "teacher" ? "/teacher/upload" : "/courses");

      return res.status(201).json({ message: "User created", user, redirectUrl });
    } catch (err) {
      // Handle Postgres unique violation (duplicate key) gracefully
      const anyErr = err as any;
      if (anyErr && typeof anyErr === "object" && anyErr.code === "23505") {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }

      // In dev, include minimal details to aid debugging; in prod, keep generic
      if ((process.env.NODE_ENV || "").toLowerCase() === "development") {
        return res.status(500).json({ error: "Signup failed", detail: String(anyErr?.message || anyErr) });
      }
      next(err);
    }
  });

  // SIGN IN (TEACHER)
  app.post("/api/signin/teacher", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernameOrEmail, password } = req.body ?? {};
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "username/email and password required" });
      }

      const found = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, usernameOrEmail)))
        .limit(1);

      const user = found[0];
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (user.role !== "teacher") return res.status(403).json({ error: "User is not a teacher" });
      if (!verifyPassword(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });

      // create session
      try {
        (req.session as any).user = { id: user.id, username: user.username, email: user.email, role: user.role };
      } catch {}

      const redirectUrl = process.env.TEACHER_REDIRECT_URL || process.env.REDIRECT_URL || "/teacher/upload";
      return res.json({ message: "Teacher signed in", user: { id: user.id, username: user.username, email: user.email, role: user.role }, redirectUrl });
    } catch (err) {
      next(err);
    }
  });

  // SIGN IN (STUDENT)
  app.post("/api/signin/student", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernameOrEmail, password } = req.body ?? {};
      if (!usernameOrEmail || !password) {
        return res.status(400).json({ error: "username/email and password required" });
      }

      const found = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, usernameOrEmail)))
        .limit(1);

      const user = found[0];
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (user.role !== "student") return res.status(403).json({ error: "User is not a student" });
      if (!verifyPassword(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });

      // create session
      try {
        (req.session as any).user = { id: user.id, username: user.username, email: user.email, role: user.role };
      } catch {}

      const redirectUrl = process.env.STUDENT_REDIRECT_URL || process.env.REDIRECT_URL || "/courses";
      return res.json({ message: "Student signed in", user: { id: user.id, username: user.username, email: user.email, role: user.role }, redirectUrl });
    } catch (err) {
      next(err);
    }
  });

  // DASHBOARD (stub)
  app.get("/api/dashboard", async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const exampleData = {
        summary: "This is dashboard data (stub)",
        stats: { students: 120, courses: 8 },
      };
      return res.json(exampleData);
    } catch (err) {
      next(err);
    }
  });

  // API 404
  app.all("/api/*", (req: Request, res: Response) => {
    res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` });
  });
}
