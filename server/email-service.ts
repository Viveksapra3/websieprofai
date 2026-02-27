import nodemailer from "nodemailer";
import { db } from "./db";
import { users, courseProgress, coursePricing, userPurchases } from "../shared/schema";
import { sql, eq } from "drizzle-orm";
import { paymentService } from "./payment-service";

// SMTP transporter — configure via .env
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in .env");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

const FROM_NAME = process.env.EMAIL_FROM_NAME || "ProfAI";
const FROM_EMAIL = process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER || "noreply@profai.com";

// ── Types ──────────────────────────────────────────────────────────────

interface CourseSummary {
  courseKey: string;
  courseName: string;
  completedTopics: number;
  totalTopics: number;
  percent: number;
  lastUpdated: Date | null;
}

interface UserProgressSummary {
  userId: string;
  username: string;
  email: string;
  courses: CourseSummary[];
}

// ── Parse India AI course progress ─────────────────────────────────────
// The progress JSON for india-ai-course is an array of modules:
// [ { id, title, lessons: [ { id, title, completed: true/false, ... }, ... ] }, ... ]

function parseIndiaAICourseProgress(progressData: any): { completed: number; total: number } {
  let completed = 0;
  let total = 0;

  if (Array.isArray(progressData)) {
    for (const mod of progressData) {
      if (mod && Array.isArray(mod.lessons)) {
        for (const lesson of mod.lessons) {
          total++;
          if (lesson.completed === true) {
            completed++;
          }
        }
      }
    }
  }

  return { completed, total };
}

// ── Fetch external API course details (cached) ────────────────────────

interface ExternalCourse {
  id: number | string;
  title: string;
  totalTopics: number;
}

let _externalCoursesCache: ExternalCourse[] | null = null;
let _externalCoursesCacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

async function getExternalCourses(): Promise<ExternalCourse[]> {
  if (_externalCoursesCache && Date.now() - _externalCoursesCacheTime < CACHE_TTL) {
    return _externalCoursesCache;
  }

  const apiBase = process.env.VITE_API_BASE;
  if (!apiBase) return [];

  try {
    // Get course list
    const listRes = await fetch(`${apiBase.replace(/\/$/, "")}/api/courses`, { signal: AbortSignal.timeout(10000) });
    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const courseList = Array.isArray(listData) ? listData : listData?.courses || [];

    // Fetch all course details in PARALLEL with a 10s timeout each
    const results = await Promise.all(
      courseList
        .filter((c: any) => c.id ?? c.course_id)
        .map(async (c: any) => {
          const cId = c.id ?? c.course_id;
          let totalTopics = 0;
          try {
            const detailRes = await fetch(
              `${apiBase.replace(/\/$/, "")}/api/course/${encodeURIComponent(cId)}`,
              { signal: AbortSignal.timeout(10000) }
            );
            if (detailRes.ok) {
              const detail = await detailRes.json();
              const modules = detail?.modules || [];
              for (const mod of modules) {
                const topics = mod?.topics || mod?.sub_topics || [];
                totalTopics += topics.length;
              }
            }
          } catch {
            // Timeout or error — skip detail, keep name
          }
          return {
            id: cId,
            title: c.course_title || c.title || String(cId),
            totalTopics,
          } as ExternalCourse;
        })
    );

    _externalCoursesCache = results;
    _externalCoursesCacheTime = Date.now();
    return results;
  } catch {
    return [];
  }
}

// ── Gather progress for all users ──────────────────────────────────────

export async function getAllUsersProgress(): Promise<UserProgressSummary[]> {
  // 1. Get all users
  const allUsers = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
    })
    .from(users);

  // 2. Get all course_progress records (India AI course and any others stored here)
  const allProgress = await db
    .select({
      userId: courseProgress.userId,
      courseKey: courseProgress.courseKey,
      courseVersion: sql<string>`course_version`,
      progress: courseProgress.progress,
      updatedAt: courseProgress.updatedAt,
    })
    .from(courseProgress);

  // 3. Get all user purchases (for external API courses)
  const allPurchases = await db
    .select({
      userId: userPurchases.userId,
      courseId: userPurchases.courseId,
      status: userPurchases.status,
      purchasedAt: userPurchases.purchasedAt,
    })
    .from(userPurchases);

  // 4. Build course name map from pricing table
  const pricingRows = await db
    .select({
      courseId: coursePricing.courseId,
      courseName: coursePricing.courseName,
      isFree: coursePricing.isFree,
    })
    .from(coursePricing);

  const courseNameMap: Record<string, string> = {};
  const freeCourseIds = new Set<string>();
  for (const row of pricingRows) {
    if (row.courseId && row.courseName) {
      courseNameMap[row.courseId] = row.courseName;
    }
    if (row.isFree) {
      freeCourseIds.add(row.courseId);
    }
  }

  // 5. Fetch external API courses (names + total topic counts)
  const externalCourses = await getExternalCourses();
  const externalCourseMap: Record<string, ExternalCourse> = {};
  for (const ec of externalCourses) {
    const key = String(ec.id);
    externalCourseMap[key] = ec;
    if (!courseNameMap[key]) {
      courseNameMap[key] = ec.title;
    }
  }

  // India AI course name
  courseNameMap["india-ai-course"] = "India AI - Yuva AI for All";

  // 6. Group data by user
  const progressByUser: Record<string, typeof allProgress> = {};
  for (const row of allProgress) {
    if (!progressByUser[row.userId]) progressByUser[row.userId] = [];
    progressByUser[row.userId].push(row);
  }

  const purchasesByUser: Record<string, typeof allPurchases> = {};
  for (const row of allPurchases) {
    if (!purchasesByUser[row.userId]) purchasesByUser[row.userId] = [];
    purchasesByUser[row.userId].push(row);
  }

  // 7. Build per-user summaries
  const summaries: UserProgressSummary[] = [];

  for (const user of allUsers) {
    const userProgressRows = progressByUser[user.id] || [];
    const userPurchaseRows = purchasesByUser[user.id] || [];

    const courses: CourseSummary[] = [];
    const addedCourseKeys = new Set<string>();

    // A) Process course_progress records (India AI course etc.)
    for (const row of userProgressRows) {
      const key = row.courseKey;
      if (addedCourseKeys.has(key)) continue;
      addedCourseKeys.add(key);

      let completed = 0;
      let total = 0;

      if (key === "india-ai-course") {
        // India AI course: progress is an array of modules with lessons
        const parsed = parseIndiaAICourseProgress(row.progress);
        completed = parsed.completed;
        total = parsed.total;
      } else {
        // Other course_progress entries: try modules-array format first, then key-value
        const progressData = row.progress as any;
        if (Array.isArray(progressData)) {
          const parsed = parseIndiaAICourseProgress(progressData);
          completed = parsed.completed;
          total = parsed.total;
        } else if (progressData && typeof progressData === "object") {
          const entries = Object.entries(progressData);
          total = entries.length;
          completed = entries.filter(([_, val]) => val === true || (val && typeof val === "object" && (val as any).completed === true)).length;
        }
      }

      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      courses.push({
        courseKey: key,
        courseName: courseNameMap[key] || key,
        completedTopics: completed,
        totalTopics: total,
        percent,
        lastUpdated: row.updatedAt ? new Date(row.updatedAt) : null,
      });
    }

    // B) Process purchased courses (external API courses)
    const completedPurchases = userPurchaseRows.filter((p) => p.status === "completed");
    for (const purchase of completedPurchases) {
      const cId = purchase.courseId;
      if (addedCourseKeys.has(cId)) continue;
      addedCourseKeys.add(cId);

      const ec = externalCourseMap[cId];
      const totalTopics = ec?.totalTopics || 0;

      // No server-side progress data for external API courses
      // (progress is stored client-side in localStorage)
      courses.push({
        courseKey: cId,
        courseName: courseNameMap[cId] || ec?.title || `Course ${cId}`,
        completedTopics: 0,
        totalTopics,
        percent: 0,
        lastUpdated: purchase.purchasedAt ? new Date(purchase.purchasedAt) : null,
      });
    }

    // C) Also add free courses that every user has access to
    for (const freeId of Array.from(freeCourseIds)) {
      if (addedCourseKeys.has(freeId)) continue;
      addedCourseKeys.add(freeId);

      const ec = externalCourseMap[freeId];
      courses.push({
        courseKey: freeId,
        courseName: courseNameMap[freeId] || ec?.title || `Course ${freeId}`,
        completedTopics: 0,
        totalTopics: ec?.totalTopics || 0,
        percent: 0,
        lastUpdated: null,
      });
    }

    summaries.push({
      userId: user.id,
      username: user.username,
      email: user.email,
      courses,
    });
  }

  return summaries;
}

// ── Build HTML email ───────────────────────────────────────────────────

function buildProgressEmailHtml(summary: UserProgressSummary): string {
  const name = summary.username || "Learner";

  const hasCourses = summary.courses.length > 0;

  const courseRows = summary.courses
    .map((c) => {
      const hasStarted = c.completedTopics > 0;
      const isComplete = c.percent === 100 && c.totalTopics > 0;
      const barColor = isComplete ? "#22c55e" : hasStarted ? "#3b82f6" : "#d1d5db";
      const topicsLabel = c.totalTopics > 0 ? `${c.completedTopics} / ${c.totalTopics}` : "—";
      const statusHtml = isComplete
        ? '<span style="color:#22c55e;font-weight:600;">✅ Complete</span>'
        : hasStarted
        ? `<span style="color:#3b82f6;font-weight:600;">🔄 ${c.percent}% Done</span>`
        : '<span style="color:#9ca3af;font-weight:600;">📋 Enrolled</span>';

      return `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;">
          <strong style="color:#1e40af;">${escapeHtml(c.courseName)}</strong>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:center;">
          ${topicsLabel}
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;width:200px;">
          <div style="background:#e5e7eb;border-radius:9999px;height:10px;overflow:hidden;">
            <div style="background:${barColor};height:10px;width:${c.percent}%;border-radius:9999px;"></div>
          </div>
          <div style="text-align:center;font-size:12px;color:#6b7280;margin-top:4px;">${c.percent}%</div>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;text-align:center;">
          ${statusHtml}
        </td>
      </tr>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:640px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#3b82f6);padding:32px 24px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;">📚 Your Course Progress Report</h1>
      <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;">ProfAI — Personalized Learning Update</p>
    </div>

    <!-- Body -->
    <div style="padding:24px;">
      <p style="font-size:16px;color:#374151;">Hi <strong>${escapeHtml(name)}</strong>,</p>
      <p style="font-size:14px;color:#6b7280;line-height:1.6;">
        Here's a summary of your learning progress across all your enrolled courses. Keep up the great work!
      </p>

      ${hasCourses ? `
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;color:#374151;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:10px 16px;text-align:left;border-bottom:2px solid #e5e7eb;">Course</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:2px solid #e5e7eb;">Topics</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:2px solid #e5e7eb;">Progress</th>
            <th style="padding:10px 16px;text-align:center;border-bottom:2px solid #e5e7eb;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${courseRows}
        </tbody>
      </table>
      ` : `
      <div style="text-align:center;padding:32px;background:#f9fafb;border-radius:8px;margin:24px 0;">
        <p style="font-size:16px;color:#6b7280;">You haven't started any courses yet.</p>
        <p style="font-size:14px;color:#9ca3af;">Visit ProfAI to begin your learning journey!</p>
      </div>
      `}

      <div style="text-align:center;margin:24px 0;">
        <a href="${process.env.BASE_URL || "http://localhost:5000"}/courses"
           style="display:inline-block;background:#3b82f6;color:#ffffff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
          Continue Learning →
        </a>
      </div>

      <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:32px;">
        This is an automated progress report from ProfAI.<br>
        If you have questions, reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Send emails ────────────────────────────────────────────────────────

export interface SendProgressEmailsResult {
  total: number;
  sent: number;
  failed: number;
  errors: { email: string; error: string }[];
}

export async function sendProgressEmailsToAllUsers(): Promise<SendProgressEmailsResult> {
  const transporter = createTransporter();
  const summaries = await getAllUsersProgress();

  const result: SendProgressEmailsResult = {
    total: summaries.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  for (const summary of summaries) {
    try {
      const html = buildProgressEmailHtml(summary);

      await transporter.sendMail({
        from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
        to: summary.email,
        subject: `📚 Your Course Progress Report — ${summary.courses.length > 0 ? summary.courses.map((c) => `${c.percent}%`).join(", ") : "Get Started!"}`,
        html,
      });

      result.sent++;
    } catch (err: any) {
      result.failed++;
      result.errors.push({
        email: summary.email,
        error: err?.message || String(err),
      });
    }
  }

  await transporter.close();
  return result;
}

export async function sendProgressEmailToUser(userId: string): Promise<{ sent: boolean; error?: string }> {
  const transporter = createTransporter();

  try {
    const summaries = await getAllUsersProgress();
    const summary = summaries.find((s) => s.userId === userId);

    if (!summary) {
      return { sent: false, error: "User not found" };
    }

    const html = buildProgressEmailHtml(summary);

    await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: summary.email,
      subject: `📚 Your Course Progress Report — ${summary.courses.length > 0 ? summary.courses.map((c) => `${c.percent}%`).join(", ") : "Get Started!"}`,
      html,
    });

    return { sent: true };
  } catch (err: any) {
    return { sent: false, error: err?.message || String(err) };
  } finally {
    await transporter.close();
  }
}
