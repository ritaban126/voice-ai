// PURPOSE: Web Push. Sends a phone notification when the user is NOT on the site (needs VAPID keys, otherwise it does nothing).
import webpush from 'web-push';
import { db, pushSubscriptions, eq } from '@repo/db';
import { env } from '../env';

const enabled = !!(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
if (enabled) webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY!, env.VAPID_PRIVATE_KEY!);

export const vapidPublicKey = env.VAPID_PUBLIC_KEY ?? null;

export async function sendPush(userId: string, payload: { title: string; body: string; data?: Record<string, unknown> }): Promise<void> {
  if (!enabled) return;
  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys as { p256dh: string; auth: string } }, JSON.stringify(payload));
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, s.id)); // expired
        else console.error('[push] failed', err);
      }
    }),
  );
}
