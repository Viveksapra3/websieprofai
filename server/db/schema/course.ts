import { pgTable, text, timestamp, boolean, integer, jsonb, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Courses table
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  isPublished: boolean('is_published').default(false).notNull(),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderIdx: index('courses_order_idx').on(table.order),
  publishedIdx: index('courses_published_idx').on(table.isPublished),
}));

// Modules table
export const modules = pgTable('modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  courseIdx: index('modules_course_idx').on(table.courseId),
  orderIdx: index('modules_order_idx').on(table.courseId, table.order),
}));

// Lessons table
export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: uuid('module_id').references(() => modules.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  type: text('type', { enum: ['video', 'quiz', 'resource'] }).notNull(),
  order: integer('order').default(0).notNull(),
  duration: integer('duration'), // in seconds
  
  // Video fields
  videoUrl: text('video_url'),
  vimeoId: text('vimeo_id'),
  youtubeId: text('youtube_id'),
  videoProvider: text('video_provider', { enum: ['vimeo', 'youtube', 'custom'] }),
  
  // Resource fields
  resourceUrl: text('resource_url'),
  resourceType: text('resource_type', { enum: ['pdf', 'doc', 'link'] }),
  
  // Quiz fields
  quizId: uuid('quiz_id'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  moduleIdx: index('lessons_module_idx').on(table.moduleId),
  orderIdx: index('lessons_order_idx').on(table.moduleId, table.order),
  typeIdx: index('lessons_type_idx').on(table.type),
}));

// User Progress table
export const userProgress = pgTable('user_progress', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(), // Firebase UID
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }).notNull(),
  completed: boolean('completed').default(false).notNull(),
  completedAt: timestamp('completed_at'),
  watchTime: integer('watch_time'), // in seconds
  lastWatchedAt: timestamp('last_watched_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userLessonIdx: index('user_lesson_idx').on(table.userId, table.lessonId),
  userIdx: index('user_progress_user_idx').on(table.userId),
  lessonIdx: index('user_progress_lesson_idx').on(table.lessonId),
}));

// Video Uploads table
export const videoUploads = pgTable('video_uploads', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  size: integer('size').notNull(),
  mimeType: text('mime_type').notNull(),
  url: text('url').notNull(),
  provider: text('provider', { enum: ['local', 'vimeo', 'youtube', 's3'] }).notNull(),
  providerId: text('provider_id'), // External provider ID
  uploadedBy: text('uploaded_by').notNull(), // User ID
  status: text('status', { enum: ['pending', 'processing', 'ready', 'failed'] }).default('pending').notNull(),
  metadata: jsonb('metadata'), // Additional metadata
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('video_uploads_status_idx').on(table.status),
  providerIdx: index('video_uploads_provider_idx').on(table.provider),
  uploadedByIdx: index('video_uploads_uploaded_by_idx').on(table.uploadedBy),
}));

// Relations
export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  userProgress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id],
  }),
}));
