import { pgTable, text, timestamp, uuid, index } from 'drizzle-orm/pg-core';

// API Access Requests table
export const apiAccessRequests = pgTable('api_access_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  company: text('company').notNull(),
  jobTitle: text('job_title').notNull(),
  useCase: text('use_case'),
  status: text('status', { enum: ['pending', 'approved', 'rejected'] }).default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('api_access_requests_email_idx').on(table.email),
  statusIdx: index('api_access_requests_status_idx').on(table.status),
  createdAtIdx: index('api_access_requests_created_at_idx').on(table.createdAt),
}));
