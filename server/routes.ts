import type { Express, Request, Response, NextFunction } from "express";
import { db, pool } from "./db";
import { users, coursePricing, userPurchases, courseImages, courseIdMapping } from "@shared/schema";
import { eq, or, sql, and, asc } from "drizzle-orm";
import crypto from "crypto";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { fileURLToPath } from "url";
import { paymentService } from "./payment-service";





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

// Helper function to get old course ID from new course ID using mapping table
async function getOldCourseId(newCourseId: string): Promise<string> {
  try {
    const mapping = await db
      .select()
      .from(courseIdMapping)
      .where(eq(courseIdMapping.newCourseId, newCourseId))
      .limit(1);
    
    if (mapping[0]) {
      return mapping[0].oldCourseId;
    }
    
    // If no mapping found, return the original ID (silently)
    return newCourseId;
  } catch (error) {
    // Only log actual errors, not missing mappings
    console.error(`Error getting course ID mapping for ${newCourseId}:`, error);
    return newCourseId;
  }
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

  app.post("/api/quiz/generate-course", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiBase = process.env.VITE_API_BASE as string | undefined;
      if (!apiBase) {
        return res.status(500).json({ error: "External API base not configured (VITE_API_BASE)" });
      }
      let apiUrl: string;
      if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
        apiUrl = `${apiBase}/api/quiz/generate-course`;
      } else {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:5000';
        const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
        apiUrl = `${protocol}://${host}${base}/api/quiz/generate-course`;
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return res.status(response.status).json(data || { error: `Failed (${response.status})` });
      }
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/quiz/generate-module", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const apiBase = process.env.VITE_API_BASE as string | undefined;
      if (!apiBase) {
        return res.status(500).json({ error: "External API base not configured (VITE_API_BASE)" });
      }
      let apiUrl: string;
      if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
        apiUrl = `${apiBase}/api/quiz/generate-module`;
      } else {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:5000';
        const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
        apiUrl = `${protocol}://${host}${base}/api/quiz/generate-module`;
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body ?? {}),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return res.status(response.status).json(data || { error: `Failed (${response.status})` });
      }
      return res.json(data);
    } catch (err) {
      next(err);
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
    limits: { 
      fileSize: 500 * 1024 * 1024, // 500MB - increased for large PDFs
      files: 1
    },
  });

  // Teacher upload endpoint
  app.post("/api/teacher/courses", upload.single("pdf"), (req: Request, res: Response) => {
    // Extend timeout for this specific route to handle long uploads
    req.setTimeout(10 * 60 * 60 * 1000); // 10 hours
    res.setTimeout(10 * 60 * 60 * 1000); // 10 hours
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

  // SIGNUP (STUDENT) - For Google Sign-Up with Firebase
  app.post("/api/signup/student", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernameOrEmail, firebaseUid, displayName, profileData } = req.body ?? {};
      
      if (!usernameOrEmail || !firebaseUid) {
        return res.status(400).json({ error: "Email and Firebase UID are required" });
      }

      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, displayName)))
        .limit(1);
      
      if (existing.length > 0) {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }

      const username = displayName || usernameOrEmail.split('@')[0];
      const hashedPassword = hashPassword(firebaseUid); // Use firebaseUid as password placeholder
      
      console.log(`[Firebase Signup] Creating new student account for: ${usernameOrEmail}`);
      console.log(`[Firebase Signup] Profile data:`, profileData);
      
      // Prepare user data with profile information
      const userData: any = {
        username,
        email: usernameOrEmail,
        password: hashedPassword,
        role: "student",
        termsAccepted: profileData?.termsAccepted || false,
      };

      // Add student-specific fields if provided
      if (profileData) {
        if (profileData.studentType) userData.studentType = profileData.studentType;
        if (profileData.collegeName) userData.collegeName = profileData.collegeName;
        if (profileData.degree) userData.degree = profileData.degree;
        if (profileData.schoolClass) userData.schoolClass = profileData.schoolClass;
        if (profileData.schoolAffiliation) userData.schoolAffiliation = profileData.schoolAffiliation;
      }
      
      console.log(`[Firebase Signup] Saving student data:`, userData);
      
      const [newUser] = await db
        .insert(users)
        .values(userData)
        .returning();
      
      console.log(`[Firebase Signup] Student account created successfully: ${newUser.id}`);
      
      // Create session
      try {
        (req.session as any).user = { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        };
      } catch {}

      const redirectUrl = process.env.STUDENT_REDIRECT_URL || process.env.REDIRECT_URL || "/courses";
      return res.status(201).json({ 
        message: "Student account created", 
        user: { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        }, 
        redirectUrl 
      });
    } catch (err) {
      const anyErr = err as any;
      console.error('[Firebase Signup] Error creating student account:', anyErr);
      
      if (anyErr && typeof anyErr === "object" && anyErr.code === "23505") {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }
      
      return res.status(500).json({ 
        error: "Failed to create account", 
        detail: anyErr?.message || String(anyErr) 
      });
    }
  });

  // SIGNUP (TEACHER) - For Google Sign-Up with Firebase
  app.post("/api/signup/teacher", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernameOrEmail, firebaseUid, displayName, profileData } = req.body ?? {};
      
      if (!usernameOrEmail || !firebaseUid) {
        return res.status(400).json({ error: "Email and Firebase UID are required" });
      }

      // Check if user already exists
      const existing = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, displayName)))
        .limit(1);
      
      if (existing.length > 0) {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }

      const username = displayName || usernameOrEmail.split('@')[0];
      const hashedPassword = hashPassword(firebaseUid); // Use firebaseUid as password placeholder
      
      console.log(`[Firebase Signup] Creating new teacher account for: ${usernameOrEmail}`);
      console.log(`[Firebase Signup] Profile data:`, profileData);
      
      // Prepare user data with profile information
      const userData: any = {
        username,
        email: usernameOrEmail,
        password: hashedPassword,
        role: "teacher",
        termsAccepted: profileData?.termsAccepted || false,
      };

      // Add teacher-specific fields if provided
      if (profileData) {
        if (profileData.institution) userData.institution = profileData.institution;
        if (profileData.subject) userData.subject = profileData.subject;
        if (profileData.experience) userData.experience = profileData.experience;
      }
      
      console.log(`[Firebase Signup] Saving teacher data:`, userData);
      
      const [newUser] = await db
        .insert(users)
        .values(userData)
        .returning();
      
      console.log(`[Firebase Signup] Teacher account created successfully: ${newUser.id}`);
      
      // Create session
      try {
        (req.session as any).user = { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        };
      } catch {}

      const redirectUrl = process.env.TEACHER_REDIRECT_URL || process.env.REDIRECT_URL || "/teacher/upload";
      return res.status(201).json({ 
        message: "Teacher account created", 
        user: { 
          id: newUser.id, 
          username: newUser.username, 
          email: newUser.email, 
          role: newUser.role 
        }, 
        redirectUrl 
      });
    } catch (err) {
      const anyErr = err as any;
      console.error('[Firebase Signup] Error creating teacher account:', anyErr);
      
      if (anyErr && typeof anyErr === "object" && anyErr.code === "23505") {
        return res.status(409).json({ error: "User with this email or username already exists" });
      }
      
      return res.status(500).json({ 
        error: "Failed to create account", 
        detail: anyErr?.message || String(anyErr) 
      });
    }
  });

  // SIGN IN (TEACHER)
  app.post("/api/signin/teacher", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usernameOrEmail, password, firebaseUid, displayName } = req.body ?? {};
      
      // Check if this is Firebase Google Sign-In (has firebaseUid but no password)
      const isFirebaseAuth = firebaseUid && !password;
      
      if (!usernameOrEmail) {
        return res.status(400).json({ error: "email is required" });
      }
      
      if (!isFirebaseAuth && !password) {
        return res.status(400).json({ error: "password is required for email/password login" });
      }

      const found = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, usernameOrEmail)))
        .limit(1);

      let user = found[0];
      
      // If Firebase auth and user doesn't exist, create new user
      if (!user && isFirebaseAuth) {
        try {
          const username = displayName || usernameOrEmail.split('@')[0];
          const hashedPassword = hashPassword(firebaseUid); // Use firebaseUid as password placeholder
          
          console.log(`[Firebase Auth] Creating new teacher account for: ${usernameOrEmail}`);
          
          const [newUser] = await db
            .insert(users)
            .values({
              username,
              email: usernameOrEmail,
              password: hashedPassword,
              role: "teacher",
            })
            .returning();
          
          user = newUser;
          console.log(`[Firebase Auth] Teacher account created successfully: ${user.id}`);
        } catch (insertError: any) {
          console.error('[Firebase Auth] Error creating teacher account:', insertError);
          // User might already exist with different role or username conflict
          return res.status(500).json({ 
            error: "Failed to create account. Email may already be registered.",
            detail: insertError.message 
          });
        }
      }
      
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (user.role !== "teacher") {
        return res.status(403).json({ 
          error: "This account is registered as a student. Please sign in as a student instead." 
        });
      }
      
      // For traditional password login, verify password
      if (!isFirebaseAuth) {
        if (!verifyPassword(password, user.password)) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        // For Firebase auth on existing user, update database password with Firebase UID
        // This handles cases where user reset password via Firebase
        const hashedPassword = hashPassword(firebaseUid);
        await db
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.email, usernameOrEmail));
        console.log(`[Firebase Auth] Synced database password for existing teacher: ${usernameOrEmail}`);
      }

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
      const { usernameOrEmail, password, firebaseUid, displayName } = req.body ?? {};
      
      // Check if this is Firebase Google Sign-In (has firebaseUid but no password)
      const isFirebaseAuth = firebaseUid && !password;
      
      if (!usernameOrEmail) {
        return res.status(400).json({ error: "email is required" });
      }
      
      if (!isFirebaseAuth && !password) {
        return res.status(400).json({ error: "password is required for email/password login" });
      }

      const found = await db
        .select()
        .from(users)
        .where(or(eq(users.email, usernameOrEmail), eq(users.username, usernameOrEmail)))
        .limit(1);

      let user = found[0];
      
      // If Firebase auth and user doesn't exist, create new user
      if (!user && isFirebaseAuth) {
        try {
          const username = displayName || usernameOrEmail.split('@')[0];
          const hashedPassword = hashPassword(firebaseUid); // Use firebaseUid as password placeholder
          
          console.log(`[Firebase Auth] Creating new student account for: ${usernameOrEmail}`);
          
          const [newUser] = await db
            .insert(users)
            .values({
              username,
              email: usernameOrEmail,
              password: hashedPassword,
              role: "student",
            })
            .returning();
          
          user = newUser;
          console.log(`[Firebase Auth] Student account created successfully: ${user.id}`);
        } catch (insertError: any) {
          console.error('[Firebase Auth] Error creating student account:', insertError);
          // User might already exist with different role or username conflict
          return res.status(500).json({ 
            error: "Failed to create account. Email may already be registered.",
            detail: insertError.message 
          });
        }
      }
      
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (user.role !== "student") {
        return res.status(403).json({ 
          error: "This account is registered as a teacher. Please sign in as a teacher instead." 
        });
      }
      
      // For traditional password login, verify password
      if (!isFirebaseAuth) {
        if (!verifyPassword(password, user.password)) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        // For Firebase auth on existing user, update database password with Firebase UID
        // This handles cases where user reset password via Firebase
        const hashedPassword = hashPassword(firebaseUid);
        await db
          .update(users)
          .set({ password: hashedPassword })
          .where(eq(users.email, usernameOrEmail));
        console.log(`[Firebase Auth] Synced database password for existing student: ${usernameOrEmail}`);
      }

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

  // Check if user exists (for Google Sign-In flow)
  app.post("/api/check-user", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body ?? {};
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const found = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const user = found[0];

      if (user) {
        // User exists - return their role
        return res.json({ 
          exists: true, 
          role: user.role,
          message: `Account already exists as ${user.role}` 
        });
      } else {
        // User doesn't exist - needs to select role
        return res.json({ 
          exists: false,
          message: "No account found. Please select your role." 
        });
      }
    } catch (err) {
      next(err);
    }
  });

  // Check if username is available
  app.post("/api/check-username", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.body ?? {};
      
      if (!username) {
        return res.status(400).json({ error: "Username is required" });
      }

      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.json({ 
          available: false,
          message: "Username must be 3-20 characters and contain only letters, numbers, and underscores" 
        });
      }

      const found = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      const available = !found[0];

      return res.json({ 
        available,
        message: available ? "Username is available" : "Username is already taken" 
      });
    } catch (err) {
      next(err);
    }
  });

  // Update password in database after Firebase password reset
  app.post("/api/update-password", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, newPassword } = req.body ?? {};

      if (!email || !newPassword) {
        return res.status(400).json({ error: "Email and new password are required" });
      }

      // Find user by email
      const found = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const user = found[0];

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Hash the new password
      const hashedPassword = hashPassword(newPassword);

      // Update password in database
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.email, email));

      console.log(`[Password Reset] Password updated in database for: ${email}`);

      return res.json({ 
        success: true,
        message: "Password updated successfully" 
      });
    } catch (err) {
      console.error('[Password Reset] Error updating password:', err);
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

  // Debug endpoint to test pricing without authentication
  app.get("/api/debug/pricing/:courseId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const pricing = await paymentService.getCoursePricing(courseId);
      const hasAccess = await paymentService.hasAccess('debug-user', courseId);
      
      return res.json({
        courseId,
        pricing,
        hasAccess,
        message: "Debug endpoint - no auth required"
      });
    } catch (err) {
      next(err);
    }
  });

  // PAYMENT ROUTES

  // Initialize course pricing (admin endpoint)
  app.post("/api/admin/course-pricing", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || user.role !== "teacher") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { courses } = req.body;
      if (!Array.isArray(courses)) {
        return res.status(400).json({ error: "Courses array is required" });
      }

      // Set first 3 courses as free, rest as paid
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const courseId = String(course.id);
        
        // Get old course ID from mapping table
        const oldCourseId = await getOldCourseId(courseId);
        
        const isFree = i < 3;
        const price = isFree ? 0 : (course.price || 99); // Default price 99 INR
        
        // Set pricing using the old course ID
        await paymentService.setCoursePricing(
          oldCourseId,
          price,
          isFree,
          i + 1 // display order
        );
      }

      return res.json({ message: "Course pricing updated successfully" });
    } catch (err) {
      next(err);
    }
  });

  // Get course pricing and access info (public - no auth required to see prices)
  app.get("/api/courses-with-pricing", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any)?.user;
      // Allow unauthenticated users to see pricing, but not access courses

      // Get courses from external API or fallback to local
      const apiBase = process.env.VITE_API_BASE as string | undefined;
      let courses: any[] = [];

      if (apiBase) {
        try {
          // Handle both absolute URLs and relative paths
          let apiUrl: string;
          if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
            // Absolute URL - use as is
            apiUrl = `${apiBase}/api/courses`;
          } else {
            // Relative path - convert to absolute URL using request host
            const protocol = req.protocol || 'http';
            const host = req.get('host') || 'localhost:5000';
            apiUrl = `${protocol}://${host}${apiBase}/api/courses`;
          }
          
          console.log(`Fetching courses from: ${apiUrl}`);
          const response = await fetch(apiUrl);
          const data = await response.json();
          courses = Array.isArray(data.courses) ? data.courses : Array.isArray(data) ? data : [];
        } catch (error) {
          console.error("Failed to fetch courses from external API:", error);
        }
      }

      // If no courses from external API, use fallback data
      if (courses.length === 0) {
        courses = [
          { id: "s-101", title: "Study Skills Fundamentals", level: "Beginner", modules: 5 },
          { id: "s-201", title: "Math with AI Tutors", level: "Intermediate", modules: 8 },
          { id: "s-310", title: "Creative Coding with Three.js", level: "Intermediate", modules: 12 },
          { id: "s-320", title: "Intro to Data Science", level: "Beginner", modules: 10 },
          { id: "course_1", title: "Advanced Programming", level: "Advanced", modules: 15 },
          { id: "course_2", title: "Machine Learning Basics", level: "Intermediate", modules: 20 }
        ];
      }

      // Get pricing information
      const pricingData = await db
        .select()
        .from(coursePricing)
        .orderBy(asc(coursePricing.displayOrder));

      // Get custom course images
      const courseImagesData = await db
        .select()
        .from(courseImages);

      // Get user's purchases (only if logged in)
      let purchasedCourseIds = new Set<string>();
      if (user) {
        const userPurchases = await paymentService.getUserPurchases(user.id);
        purchasedCourseIds = new Set(
          userPurchases
            .filter(p => p.status === "completed")
            .map(p => p.courseId)
        );
      }

      // Get all course ID mappings for efficient lookup
      const courseMappings = await db.select().from(courseIdMapping);
      const mappingMap = new Map(courseMappings.map(m => [m.newCourseId, m.oldCourseId]));

      // Combine course data with pricing, access info, and custom images
      const coursesWithPricing = courses.map((course, index) => {
        const courseId = String(course.course_id || course.id);
        
        // Get the old course ID from mapping table for pricing/images lookup
        const oldCourseId = mappingMap.get(courseId) || courseId;
        
        // Use old course ID to find pricing and images
        const pricing = pricingData.find(p => p.courseId === oldCourseId);
        const customImage = courseImagesData.find(img => img.courseId === oldCourseId);
        
        // Course is free if price is 0 or isFree flag is true
        const price = pricing?.price || "99.00";
        const priceValue = parseFloat(price);
        const isFree = pricing?.isFree || priceValue === 0;
        
        // Only grant access if user is logged in AND (course is free OR user purchased it using old course ID)
        const hasAccess = user ? (isFree || purchasedCourseIds.has(oldCourseId)) : false;

        return {
          id: courseId,
          title: course.course_title || course.title || "Untitled Course",
          level: course.level || "Beginner",
          description: course.description || `${course.modules || 0} modules`,
          tag: course.tag,
          price: priceValue,
          currency: pricing?.currency || "INR",
          isFree,
          hasAccess,
          displayOrder: pricing?.displayOrder || (index + 1),
          imageUrl: customImage?.imageUrl || null,
        };
      });

      return res.json({ courses: coursesWithPricing });
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/course/:courseId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const apiBase = process.env.VITE_API_BASE as string | undefined;

      if (!apiBase) {
        return res.status(500).json({ error: "External API base not configured (VITE_API_BASE)" });
      }

      let apiUrl: string;
      if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
        apiUrl = `${apiBase}/api/course/${encodeURIComponent(courseId)}`;
      } else {
        const protocol = req.protocol || 'http';
        const host = req.get('host') || 'localhost:5000';
        const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
        apiUrl = `${protocol}://${host}${base}/api/course/${encodeURIComponent(courseId)}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        return res.status(response.status).json(data || { error: `Failed (${response.status})` });
      }
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // Check course access
  app.get("/api/course/:courseId/access", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { courseId } = req.params;
      const hasAccess = await paymentService.hasAccess(user.id, courseId);
      const pricing = await paymentService.getCoursePricing(courseId);

      // Debug logging
      console.log(`[DEBUG] Course access check for ${courseId}:`, {
        userId: user.id,
        hasAccess,
        pricing: pricing ? { isFree: pricing.isFree, price: pricing.price } : null
      });

      return res.json({
        hasAccess,
        pricing: pricing || { price: "99.00", currency: "INR", isFree: false },
      });
    } catch (err) {
      console.error(`[ERROR] Course access check failed for ${req.params.courseId}:`, err);
      next(err);
    }
  });

  // Initialize payment
  app.post("/api/payment/initialize", async (req: Request, res: Response, next: NextFunction) => {
    // try {
    //   const user = (req.session as any)?.user;
    //   if (!user) {
    //     return res.status(401).json({ error: "Not authenticated" });
    //   }

    //   const { courseId } = req.body;
    //   if (!courseId) {
    //     return res.status(400).json({ error: "Course ID is required" });
    //   }

    //   // Check if user already has access
    //   const hasAccess = await paymentService.hasAccess(user.id, courseId);
    //   if (hasAccess) {
    //     return res.status(400).json({ error: "You already have access to this course" });
    //   }

    //   const paymentData = await paymentService.initializePayment(user.id, courseId, user);
    //   return res.json(paymentData);
    // } catch (err) {
    //   console.error("Payment initialization error:", err);
    //   return res.status(500).json({ error: err instanceof Error ? err.message : "Payment initialization failed" });
    // }

    try {
    const user = (req.session as any)?.user;
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ error: "Course ID is required" });
    }

    // Check if user already has access
    const hasAccess = await paymentService.hasAccess(user.id, courseId);
    if (hasAccess) {
      return res.status(400).json({ error: "You already have access to this course" });
    }

    // Initialize payment
    const paymentData = await paymentService.initializePayment(user.id, courseId, user);

    // Return data for frontend form rendering
    return res.json(paymentData);
  } catch (err) {
    console.error("Payment initialization error:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Payment initialization failed",
    });
  }
  });
//payement cancelled
  app.post("/payment/cancelled", (req: Request, res: Response) => {
    console.log("Payment cancelled by user, redirecting to courses page");
    return res.redirect("/courses");
  });



  // Payment callback from CCAvenue
  app.post("/api/payment/callback", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { encResp } = req.body;
      if (!encResp) {
        return res.status(400).json({ error: "Invalid payment response" });
      }

      const result = await paymentService.handlePaymentCallback(encResp);
      
      if (result.success) {
        // Redirect to the purchased course
        return res.redirect(`/course/${result.courseId}`);
      } else {
        // Redirect to courses page (course not purchased)
        return res.redirect("/courses");
      }
    } catch (err) {
      console.error("Payment callback error:", err);
      return res.redirect("/courses");
    }
  });

  // Get user purchases
  app.get("/api/user/purchases", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any)?.user;
      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const purchases = await paymentService.getUserPurchases(user.id);
      return res.json({ purchases });
    } catch (err) {
      next(err);
    }
  });

  // Sync course pricing from external API (admin only)
  app.post("/api/admin/sync-courses", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req.session as any)?.user;
      if (!user || user.role !== "teacher") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const apiBase = process.env.VITE_API_BASE as string | undefined;
      const result = await paymentService.syncCoursePricing(apiBase);
      
      return res.json(result);
    } catch (err) {
      console.error("Sync error:", err);
      return res.status(500).json({ 
        error: "Failed to sync courses", 
        details: err instanceof Error ? err.message : String(err) 
      });
    }
  });

  // API Access Request endpoint
  app.post("/api/api-access-requests", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, phone, company, jobTitle, useCase } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !company || !jobTitle) {
        return res.status(400).json({ error: "All required fields must be provided" });
      }

      // Insert into database
      await pool.query(
        `INSERT INTO api_access_requests 
         (first_name, last_name, email, phone, company, job_title, use_case, status, created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW(), NOW())`,
        [firstName, lastName, email, phone, company, jobTitle, useCase || null]
      );

      return res.status(201).json({ 
        success: true, 
        message: "API access request submitted successfully" 
      });
    } catch (err) {
      console.error("API access request error:", err);
      next(err);
    }
  });

  // API 404
  app.all("/api/*", (req: Request, res: Response) => {
    res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` });
  });
}
