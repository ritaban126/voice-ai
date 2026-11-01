// PURPOSE: employer's job requests. Create one (typed), see the proposed workers for the map, reschedule to "kal subah", cancel.
import { Router } from 'express';
import { z } from 'zod';
import { searchWorkersInput } from '@repo/shared';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validateBody } from '../middleware/validate';
import { cancelRequest, createRequest, getRequestView, listRequests, reschedule, startSearch } from '../services/request.service';
import { replyPayload } from '../services/voice.service';

const router = Router();
router.use(requireAuth, requireRole('EMPLOYER'));

// POST /api/requests  (same as speaking, but with typed data + GPS)
router.post('/', validateBody(searchWorkersInput), async (req, res) => {
  const user = currentUser(req);
  const { lat, lng, rawTranscript, ...draft } = req.body;
  const request = await createRequest({ employerId: user.id, draft, lat, lng, transcript: rawTranscript });
  startSearch(request.id);
  res.status(201).json({ requestId: request.id, ...(await replyPayload(user, 'orderSearching')) });
});

router.get('/', async (req, res) => res.json(await listRequests(currentUser(req).id)));

// GET /api/requests/:id -> proposed workers with map points (poll this, or wait for the WORKERS_FOUND notification)
router.get('/:id', async (req, res) => res.json(await getRequestView(String(req.params.id), currentUser(req).id)));

// POST /api/requests/:id/reschedule  (body optional: custom window). Default = tomorrow 6am to 10am
router.post(
  '/:id/reschedule',
  validateBody(z.object({ windowStart: z.coerce.date().optional(), windowEnd: z.coerce.date().optional() })),
  async (req, res) => {
    const { windowStart, windowEnd } = req.body;
    await reschedule(String(req.params.id), currentUser(req).id, windowStart && windowEnd ? { start: windowStart, end: windowEnd } : undefined);
    res.json({ ok: true });
  },
);

router.post('/:id/cancel', async (req, res) => {
  await cancelRequest(String(req.params.id), currentUser(req).id);
  res.json({ ok: true });
});

export default router;
