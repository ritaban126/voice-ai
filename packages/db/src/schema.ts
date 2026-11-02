// import {
//   pgTable, pgEnum, text, integer, real, doublePrecision,
//   boolean, timestamp, jsonb, index,
// } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';
// import { createId } from '@paralleldrive/cuid2';

// const id = () => text('id').primaryKey().$defaultFn(() => createId());

// // Better Auth tables 
// export const user = pgTable('user', {
//   id: text('id').primaryKey(),
//   name: text('name').notNull(),
//   email: text('email').notNull().unique(),
//   emailVerified: boolean('email_verified').notNull().default(false),
//   image: text('image'),
//   phoneNumber: text('phone_number').unique(),
//   phoneNumberVerified: boolean('phone_number_verified').default(false),
//   role: text('role'),                              // WORKER | EMPLOYER 
//   lang: text('lang').notNull().default('hi'),      // hi | bn | ta | en
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// });

// export const session = pgTable('session', {
//   id: text('id').primaryKey(),
//   expiresAt: timestamp('expires_at').notNull(),
//   token: text('token').notNull().unique(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   ipAddress: text('ip_address'),
//   userAgent: text('user_agent'),
//   userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
// });

// export const account = pgTable('account', {
//   id: text('id').primaryKey(),
//   accountId: text('account_id').notNull(),
//   providerId: text('provider_id').notNull(),
//   userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
//   accessToken: text('access_token'),
//   refreshToken: text('refresh_token'),
//   idToken: text('id_token'),
//   accessTokenExpiresAt: timestamp('access_token_expires_at'),
//   refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
//   scope: text('scope'),
//   password: text('password'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
// });

// export const verification = pgTable('verification', {
//   id: text('id').primaryKey(),
//   identifier: text('identifier').notNull(),
//   value: text('value').notNull(),
//   expiresAt: timestamp('expires_at').notNull(),
//   createdAt: timestamp('created_at').defaultNow(),
//   updatedAt: timestamp('updated_at').defaultNow(),
// });

// // App tables 
// export const areas = pgTable('areas', {
//   id: id(),
//   name: text('name').notNull(),
//   lat: doublePrecision('lat').notNull(),
//   lng: doublePrecision('lng').notNull(),
// });

// export const workerProfiles = pgTable('worker_profiles', {
//   id: id(),
//   userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
// //   createdByHelperId: text('created_by_helper_id').references(() => user.id),
// profileStatus: text('profile_status').notNull().default('PENDING'), // PENDING | READY
// upiId: text('upi_id'),
// expectedSalary: integer('expected_salary'),          // maid/nurse, monthly
// workStartHour: integer('work_start_hour').notNull().default(6),
// workEndHour: integer('work_end_hour').notNull().default(20),
//   skills: text('skills').array().notNull().default([]),
//   areaId: text('area_id').references(() => areas.id),
//   lat: doublePrecision('lat'),                      // base location
//   lng: doublePrecision('lng'),
//   serviceRadiusKm: integer('service_radius_km').notNull().default(10),
//   serviceCharge: integer('service_charge').notNull().default(0), // visit / minimum charge (jaise ₹100)
//   dailyRate: integer('daily_rate'),
//   available: boolean('available').notNull().default(false),
//   verified: boolean('verified').notNull().default(false),
//   ratingAvg: real('rating_avg').notNull().default(0),
//   ratingCount: integer('rating_count').notNull().default(0),
//   originalTranscript: text('original_transcript'),
//   lastLat: doublePrecision('last_lat'),             // live tracking
//   lastLng: doublePrecision('last_lng'),
//   lastLocationAt: timestamp('last_location_at'),
// }, (t) => ({
//   availIdx: index('worker_avail_idx').on(t.available),
// }));

// export const employerProfiles = pgTable('employer_profiles', {
//   id: id(),
//   userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
//   lat: doublePrecision('lat'),
//   lng: doublePrecision('lng'),
//   addressNote: text('address_note'),
//   profileStatus: text('profile_status').notNull().default('PENDING'),
// });

// export const jobRequests = pgTable('job_requests', {
//   id: id(),
//   employerId: text('employer_id').notNull().references(() => user.id),
//   skill: text('skill').notNull(),
//   addressNote: text('address_note'),                // "Durgachowk mor ke samne safed ghar"
//   lat: doublePrecision('lat').notNull(),
//   lng: doublePrecision('lng').notNull(),
//   whenText: text('when_text'),                      // "abhi", "kal subah"
//   scheduledAt: timestamp('scheduled_at'),
//   description: text('description'),
//   estimatedHours: real('estimated_hours'),
//   jobSize: text('job_size'),                        // SMALL | HALF_DAY | FULL_DAY
//   pricingType: text('pricing_type').notNull().default('FIXED'), // FIXED | INSPECTION_NEEDED
//   status: text('status').notNull().default('OPEN'), // OPEN | ASSIGNED | CANCELLED
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   jobType: text('job_type').notNull().default('ON_DEMAND'), // ON_DEMAND | SCHEDULED | LONG_TERM
//   windowStart: timestamp('window_start'),                   // SCHEDULED
//   windowEnd: timestamp('window_end'),
//   durationMonths: integer('duration_months'),               // LONG_TERM
//   offeredSalary: integer('offered_salary'),                 // LONG_TERM, monthly
//   startDate: timestamp('start_date'),
// });

// export const orderStatusEnum = pgEnum('order_status', [
//   'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED',
//   'ON_THE_WAY', 'ARRIVED','ACTIVE', 'COMPLETED', 'CANCELLED','PROPOSED',
//   'EMPLOYER_REJECTED'
// ]);

// // "Order" = match. Employer ne order kiya, worker ko gaya.
// export const matches = pgTable('matches', {
//   id: id(),
//   requestId: text('request_id').notNull().references(() => jobRequests.id),
//   workerId: text('worker_id').notNull().references(() => workerProfiles.id),
//   score: real('score').notNull(),
//   distanceKm: real('distance_km').notNull(),
//   status: orderStatusEnum('status').notNull().default('SENT'),
//   // pricing
//   priceModel: text('price_model'),                  // FIXED | MIN_VISIT | HALF_DAY | FULL_DAY
//   quotedAmount: integer('quoted_amount'),           // fixed kaam ka locked price
//   visitCharge: integer('visit_charge'),             // inspection wale kaam mein
//   labourAmount: integer('labour_amount'),
//   materialAmount: integer('material_amount'),
//   quoteNote: text('quote_note'),
//   quoteStatus: text('quote_status').notNull().default('NONE'), // NONE | SENT | APPROVED | REJECTED
//   // result
//   rating: integer('rating'),
//   acceptedAt: timestamp('accepted_at'),
//   completedAt: timestamp('completed_at'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (t) => ({
//   workerIdx: index('match_worker_idx').on(t.workerId, t.status),
// }));

// export const paymentStatusEnum = pgEnum('payment_status', [
//   'PENDING', 'EMPLOYER_MARKED_PAID', 'PAID', 'DISPUTED',
// ]);
// export const paymentModeEnum = pgEnum('payment_mode', ['CASH', 'UPI']);

// export const payments = pgTable('payments', {
//   id: id(),
// //   matchId: text('match_id').notNull().unique().references(() => matches.id),
//  matchId: text('match_id').notNull().references(() => matches.id),
//   agreedAmount: integer('agreed_amount').notNull(),
//   mode: paymentModeEnum('mode'),
//   status: paymentStatusEnum('status').notNull().default('PENDING'),
//   employerMarkedAt: timestamp('employer_marked_at'),
//   workerConfirmedAt: timestamp('worker_confirmed_at'),
//   disputeNote: text('dispute_note'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   period: text('period'),                                    // "2026-11", sirf long-term
// });

// export const notifications = pgTable('notifications', {
//   id: id(),
//   userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
//   type: text('type').notNull(),   // NEW_ORDER | ORDER_ACCEPTED | ON_THE_WAY | QUOTE_SENT | PAYMENT_MARKED ...
//   title: text('title').notNull(),
//   body: text('body').notNull(),
//   data: jsonb('data'),            // { orderId, ... }
//   readAt: timestamp('read_at'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// }, (t) => ({
//   userIdx: index('notif_user_idx').on(t.userId, t.readAt),
// }));

// export const pushSubscriptions = pgTable('push_subscriptions', {
//   id: id(),
//   userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
//   endpoint: text('endpoint').notNull().unique(),
//   keys: jsonb('keys').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// export const voiceLogs = pgTable('voice_logs', {
//   id: id(),
//   userId: text('user_id').references(() => user.id),
//   transcript: text('transcript').notNull(),
//   intent: text('intent'),
//   parsedJson: jsonb('parsed_json').notNull(),
//   confirmedByUser: boolean('confirmed_by_user'),
//   lang: text('lang').notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
// });

// // Relations 
// export const userRelations = relations(user, ({ one, many }) => ({
//   worker: one(workerProfiles, { fields: [user.id], references: [workerProfiles.userId] }),
//   requests: many(jobRequests),
//   notifications: many(notifications),
// }));
// export const workerRelations = relations(workerProfiles, ({ one, many }) => ({
//   user: one(user, { fields: [workerProfiles.userId], references: [user.id] }),
//   area: one(areas, { fields: [workerProfiles.areaId], references: [areas.id] }),
//   matches: many(matches),
// }));
// export const requestRelations = relations(jobRequests, ({ one, many }) => ({
//   employer: one(user, { fields: [jobRequests.employerId], references: [user.id] }),
//   matches: many(matches),
// }));
// export const matchRelations = relations(matches, ({ one }) => ({
//   request: one(jobRequests, { fields: [matches.requestId], references: [jobRequests.id] }),
//   worker: one(workerProfiles, { fields: [matches.workerId], references: [workerProfiles.id] }),
//   payment: one(payments, { fields: [matches.id], references: [payments.matchId] }),
// }));






import {
  pgTable, pgEnum, text, integer, real, doublePrecision, boolean, timestamp, jsonb, index, uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const pk = () => text('id').primaryKey().$defaultFn(() => createId());

/* ================= Better Auth tables (phone + OTP) =================
   Keep these names: the Better Auth drizzle adapter looks for user / session / account / verification. */
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(), // temp email generated from the phone number
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  phoneNumber: text('phone_number').unique(),
  phoneNumberVerified: boolean('phone_number_verified').default(false),
  role: text('role'), // WORKER | EMPLOYER (null until the "who are you" step)
  lang: text('lang').notNull().default('hi'), // hi | bn | ta | en
  voiceReplies: boolean('voice_replies').notNull().default(true), // AI speaks replies; user can mute
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/* ================= Enums (same values as packages/shared/src/orderStatus.ts) ================= */
export const orderStatusEnum = pgEnum('order_status', [
  'PROPOSED', 'EMPLOYER_REJECTED', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED',
  'ON_THE_WAY', 'ARRIVED', 'ACTIVE', 'COMPLETED', 'CANCELLED',
]);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'EMPLOYER_MARKED_PAID', 'PAID', 'DISPUTED']);
export const paymentModeEnum = pgEnum('payment_mode', ['CASH', 'UPI']);

/* ================= App tables ================= */
export const areas = pgTable('areas', {
  id: pk(),
  name: text('name').notNull(),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
});

export const workerProfiles = pgTable('worker_profiles', {
  id: pk(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  profileStatus: text('profile_status').notNull().default('PENDING'), // PENDING | READY (built async after voice)
  skills: text('skills').array().notNull().default([]),
  areaId: text('area_id').references(() => areas.id),
  lat: doublePrecision('lat'), // base location
  lng: doublePrecision('lng'),
  serviceRadiusKm: integer('service_radius_km').notNull().default(10),
  serviceCharge: integer('service_charge').notNull().default(0), // visit / minimum charge (e.g. 100)
  dailyRate: integer('daily_rate'),
  expectedSalary: integer('expected_salary'), // monthly, maid / nurse
  workStartHour: integer('work_start_hour').notNull().default(6),
  workEndHour: integer('work_end_hour').notNull().default(20),
  upiId: text('upi_id'), // used to build the payment QR
  available: boolean('available').notNull().default(false),
  ratingAvg: real('rating_avg').notNull().default(0),
  ratingCount: integer('rating_count').notNull().default(0),
  originalTranscript: text('original_transcript'),
  lastLat: doublePrecision('last_lat'), // live tracking
  lastLng: doublePrecision('last_lng'),
  lastLocationAt: timestamp('last_location_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [index('worker_available_idx').on(t.available)]);

export const employerProfiles = pgTable('employer_profiles', {
  id: pk(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  profileStatus: text('profile_status').notNull().default('PENDING'),
  lat: doublePrecision('lat'), // saved home location
  lng: doublePrecision('lng'),
  addressNote: text('address_note'), // "Durgachowk mor ke samne safed ghar"
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const jobRequests = pgTable('job_requests', {
  id: pk(),
  employerId: text('employer_id').notNull().references(() => user.id),
  skill: text('skill').notNull(),
  jobType: text('job_type').notNull().default('ON_DEMAND'), // ON_DEMAND | SCHEDULED | LONG_TERM
  rawTranscript: text('raw_transcript'), // what the employer actually said (saved as text)
  addressNote: text('address_note'),
  lat: doublePrecision('lat').notNull(),
  lng: doublePrecision('lng').notNull(),
  whenText: text('when_text'), // "abhi", "kal subah"
  windowStart: timestamp('window_start'), // SCHEDULED
  windowEnd: timestamp('window_end'),
  durationMonths: integer('duration_months'), // LONG_TERM
  offeredSalary: integer('offered_salary'), // LONG_TERM, monthly
  startDate: timestamp('start_date'),
  description: text('description'),
  estimatedHours: real('estimated_hours'),
  jobSize: text('job_size'), // SMALL | HALF_DAY | FULL_DAY
  pricingType: text('pricing_type').notNull().default('FIXED'), // FIXED | INSPECTION_NEEDED
  status: text('status').notNull().default('SEARCHING'), // SEARCHING | PROPOSED | ASSIGNED | NO_MATCH | CANCELLED
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// One row per worker offered for a request. Search creates the top 3 as PROPOSED.
// Employer Accept -> SENT (worker is notified). Employer Reject -> EMPLOYER_REJECTED, next ranks are shown.
export const matches = pgTable('matches', {
  id: pk(),
  requestId: text('request_id').notNull().references(() => jobRequests.id),
  workerId: text('worker_id').notNull().references(() => workerProfiles.id),
  rank: integer('rank').notNull().default(1), // 1 = best match, auto-selected on the map
  score: real('score').notNull(),
  distanceKm: real('distance_km').notNull(),
  status: orderStatusEnum('status').notNull().default('PROPOSED'),
  paymentMode: paymentModeEnum('payment_mode'), // chosen by employer in the payment modal
  priceModel: text('price_model'), // FIXED | MIN_VISIT | HALF_DAY | FULL_DAY | MONTHLY
  quotedAmount: integer('quoted_amount'), // locked price for fixed jobs
  visitCharge: integer('visit_charge'), // inspection jobs
  labourAmount: integer('labour_amount'),
  materialAmount: integer('material_amount'),
  quoteNote: text('quote_note'),
  quoteStatus: text('quote_status').notNull().default('NONE'), // NONE | SENT | APPROVED | REJECTED
  rating: integer('rating'),
  acceptedAt: timestamp('accepted_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [
  uniqueIndex('match_request_worker_uq').on(t.requestId, t.workerId),
  index('match_worker_status_idx').on(t.workerId, t.status),
]);

export const payments = pgTable('payments', {
  id: pk(),
  matchId: text('match_id').notNull().references(() => matches.id),
  period: text('period'), // "2026-11" for long-term monthly salary, null otherwise
  agreedAmount: integer('agreed_amount').notNull(),
  mode: paymentModeEnum('mode'),
  status: paymentStatusEnum('status').notNull().default('PENDING'),
  employerMarkedAt: timestamp('employer_marked_at'),
  workerConfirmedAt: timestamp('worker_confirmed_at'),
  disputeNote: text('dispute_note'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [index('payment_match_idx').on(t.matchId)]);

export const notifications = pgTable('notifications', {
  id: pk(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // NEW_ORDER | ORDER_ACCEPTED | ON_THE_WAY | QUOTE_SENT | PAYMENT_MARKED | PROFILE_READY ...
  title: text('title').notNull(),
  body: text('body').notNull(),
  data: jsonb('data'), // { orderId, ... }
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (t) => [index('notification_user_idx').on(t.userId, t.readAt)]);

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: pk(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  endpoint: text('endpoint').notNull().unique(),
  keys: jsonb('keys').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const voiceLogs = pgTable('voice_logs', {
  id: pk(),
  userId: text('user_id').references(() => user.id),
  lang: text('lang').notNull(),
  transcript: text('transcript').notNull(), // speech to text
  intent: text('intent'),
  parsedJson: jsonb('parsed_json').notNull(),
  replyKey: text('reply_key'), // which template the AI answered with
  replyText: text('reply_text'), // what the AI said (text to speech input)
  confirmedByUser: boolean('confirmed_by_user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/* ================= Relations (for db.query.*) ================= */
export const userRelations = relations(user, ({ one, many }) => ({
  worker: one(workerProfiles),
  employer: one(employerProfiles),
  requests: many(jobRequests),
  notifications: many(notifications),
}));
export const workerRelations = relations(workerProfiles, ({ one, many }) => ({
  user: one(user, { fields: [workerProfiles.userId], references: [user.id] }),
  area: one(areas, { fields: [workerProfiles.areaId], references: [areas.id] }),
  matches: many(matches),
}));
export const employerRelations = relations(employerProfiles, ({ one }) => ({
  user: one(user, { fields: [employerProfiles.userId], references: [user.id] }),
}));
export const requestRelations = relations(jobRequests, ({ one, many }) => ({
  employer: one(user, { fields: [jobRequests.employerId], references: [user.id] }),
  matches: many(matches),
}));
export const matchRelations = relations(matches, ({ one, many }) => ({
  request: one(jobRequests, { fields: [matches.requestId], references: [jobRequests.id] }),
  worker: one(workerProfiles, { fields: [matches.workerId], references: [workerProfiles.id] }),
  payments: many(payments),
}));
export const paymentRelations = relations(payments, ({ one }) => ({
  match: one(matches, { fields: [payments.matchId], references: [matches.id] }),
}));