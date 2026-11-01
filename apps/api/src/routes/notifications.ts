// PURPOSE: notification bell. List, unread count, mark read, the live stream (SSE) and phone push registration.
import { Router } from 'express';
import { z } from 'zod';
import { addSseClient } from '../lib/sse';
import { vapidPublicKey } from '../lib/push';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { validateBody } from '../middleware/validate';
import {
  listNotifications, markAllRead, markRead, removePushSubscription, savePushSubscription, unreadCount,
} from '../services/notify.service';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => res.json(await listNotifications(currentUser(req).id)));
router.get('/unread-count', async (req, res) => res.json({ count: await unreadCount(currentUser(req).id) }));
router.post('/read-all', async (req, res) => { await markAllRead(currentUser(req).id); res.json({ ok: true }); });
router.post('/:id/read', async (req, res) => { await markRead(currentUser(req).id, String(req.params.id)); res.json({ ok: true }); });

// GET /api/notifications/stream -> EventSource("/api/notifications/stream"); event name: "notification"
router.get('/stream', (req, res) => addSseClient(currentUser(req).id, res));

router.get('/push/key', (_req, res) => res.json({ publicKey: vapidPublicKey }));
router.post(
  '/push/subscribe',
  validateBody(z.object({ endpoint: z.string().url(), keys: z.object({ p256dh: z.string(), auth: z.string() }) })),
  async (req, res) => { await savePushSubscription(currentUser(req).id, req.body); res.json({ ok: true }); },
);
router.post('/push/unsubscribe', validateBody(z.object({ endpoint: z.string() })), async (req, res) => {
  await removePushSubscription(currentUser(req).id, req.body.endpoint);
  res.json({ ok: true });
});

export default router;
