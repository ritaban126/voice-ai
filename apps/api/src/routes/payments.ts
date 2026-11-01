// PURPOSE: payment record routes. Employer "Paisa diya", worker "Paisa mila" / "Nahi mila", UPI link for the QR code.
import { Router } from 'express';
import { z } from 'zod';
import { markPaidInput } from '@repo/shared';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validateBody } from '../middleware/validate';
import { buildUpiLink, confirmPaid, dispute, listPayments, markPaid } from '../services/payment.service';

const router = Router();
router.use(requireAuth, requireRole('EMPLOYER', 'WORKER'));
const id = (req: { params: Record<string, unknown> }) => String(req.params.id);

router.get('/', async (req, res) => res.json(await listPayments(currentUser(req))));

// GET /api/payments/qr/:matchId -> { upiLink, amount, upiId }. The web app draws the QR from upiLink (qrcode.react).
router.get('/qr/:matchId', async (req, res) => res.json(await buildUpiLink(currentUser(req), String(req.params.matchId))));

router.patch('/:id/mark-paid', requireRole('EMPLOYER'), validateBody(markPaidInput), async (req, res) => {
  res.json(await markPaid(currentUser(req), id(req), req.body.mode));
});
router.patch('/:id/confirm', requireRole('WORKER'), async (req, res) => res.json(await confirmPaid(currentUser(req), id(req))));
router.patch('/:id/dispute', requireRole('WORKER'), validateBody(z.object({ note: z.string().max(300).optional() })), async (req, res) => {
  res.json(await dispute(currentUser(req), id(req), req.body.note));
});

export default router;
