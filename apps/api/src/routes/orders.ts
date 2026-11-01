// PURPOSE: the order life cycle. Employer: accept / reject a proposed worker, answer quote, cancel, rate, track.
// Worker: see offers, accept / skip, on the way, arrived, send quote, complete.
import { Router } from 'express';
import { z } from 'zod';
import { createOrderInput, quoteInput, ratingInput } from '@repo/shared';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validateBody } from '../middleware/validate';
import {
  cancelOrder, createOrder, getOrderView, getTracking, listOffers, listOrders, rateOrder, rejectProposal,
  respondQuote, sendQuote, updateStatus, workerRespond,
} from '../services/order.service';
import { replyPayload } from '../services/voice.service';

const router = Router();
router.use(requireAuth, requireRole('EMPLOYER', 'WORKER'));
const id = (req: { params: Record<string, unknown> }) => String(req.params.id);

router.get('/', async (req, res) => res.json(await listOrders(currentUser(req))));
router.get('/offers', requireRole('WORKER'), async (req, res) => res.json(await listOffers(currentUser(req)))); // before /:id
router.get('/:id', async (req, res) => res.json(await getOrderView(currentUser(req), id(req))));
router.get('/:id/tracking', async (req, res) => res.json(await getTracking(currentUser(req), id(req))));

/* ----- employer ----- */
// Accept the worker shown on the map. Body: { requestId, workerId, paymentMode }. AI says "order confirmed, worker is coming".
router.post('/', requireRole('EMPLOYER'), validateBody(createOrderInput), async (req, res) => {
  const user = currentUser(req);
  const { match, replyKey } = await createOrder(user, req.body);
  res.status(201).json({ order: match, ...(await replyPayload(user, replyKey)) });
});

// Reject the worker. AI says "okay, check the next workers" (or "nobody available").
router.post('/:id/reject-proposal', requireRole('EMPLOYER'), async (req, res) => {
  const user = currentUser(req);
  const { replyKey } = await rejectProposal(user, id(req));
  res.json(await replyPayload(user, replyKey));
});

router.patch('/:id/quote/respond', requireRole('EMPLOYER'), validateBody(z.object({ approve: z.boolean() })), async (req, res) => {
  res.json(await respondQuote(currentUser(req), id(req), req.body.approve));
});

router.post('/:id/rate', requireRole('EMPLOYER'), validateBody(ratingInput), async (req, res) => {
  await rateOrder(currentUser(req), id(req), req.body.rating);
  res.json({ ok: true });
});

/* ----- worker ----- */
router.post('/:id/respond', requireRole('WORKER'), validateBody(z.object({ accept: z.boolean() })), async (req, res) => {
  res.json(await workerRespond(currentUser(req), id(req), req.body.accept));
});

router.post('/:id/status', requireRole('WORKER'), validateBody(z.object({ status: z.enum(['ON_THE_WAY', 'ARRIVED', 'COMPLETED']) })), async (req, res) => {
  res.json(await updateStatus(currentUser(req), id(req), req.body.status));
});

router.post('/:id/quote', requireRole('WORKER'), validateBody(quoteInput), async (req, res) => {
  res.json(await sendQuote(currentUser(req), id(req), req.body));
});

/* ----- both ----- */
router.post('/:id/cancel', async (req, res) => res.json(await cancelOrder(currentUser(req), id(req))));

export default router;
