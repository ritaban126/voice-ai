// PURPOSE: the one place that sends notifications: saves to DB (bell history), pushes live over SSE, and uses Web Push if the user is offline.
// title/body are English fallbacks. The web app shows the local-language text using `type` and `data` (for example data.replyKey).
import { db, notifications, pushSubscriptions, and, eq, isNull, desc, sql } from '@repo/db';
import { isOnline, sendSse } from '../lib/sse';
import { sendPush } from '../lib/push';

export interface NotifyInput {
  type: string; // NEW_ORDER | ORDER_ACCEPTED | ON_THE_WAY | QUOTE_SENT | PAYMENT_MARKED | PROFILE_READY | WORKERS_FOUND ...
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Create + deliver one notification
export async function notify(userId: string, input: NotifyInput) {
  const [row] = await db
    .insert(notifications)
    .values({ userId, type: input.type, title: input.title, body: input.body, data: input.data ?? null })
    .returning();
  sendSse(userId, 'notification', row); // live, if the user has the app open
  if (!isOnline(userId)) {
    void sendPush(userId, { title: input.title, body: input.body, data: { type: input.type, ...input.data } }); // phone, if app is closed
  }
  return row!;
}

export const listNotifications = (userId: string, limit = 50) =>
  db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);

export async function unreadCount(userId: string): Promise<number> {
  const [r] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
  return r?.c ?? 0;
}

export const markRead = (userId: string, id: string) =>
  db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, id), eq(notifications.userId, userId)));

export const markAllRead = (userId: string) =>
  db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

// Browser registers for phone notifications
export async function savePushSubscription(userId: string, sub: { endpoint: string; keys: { p256dh: string; auth: string } }) {
  await db
    .insert(pushSubscriptions)
    .values({ userId, endpoint: sub.endpoint, keys: sub.keys })
    .onConflictDoUpdate({ target: pushSubscriptions.endpoint, set: { userId, keys: sub.keys } });
}

export const removePushSubscription = (userId: string, endpoint: string) =>
  db.delete(pushSubscriptions).where(and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.endpoint, endpoint)));
