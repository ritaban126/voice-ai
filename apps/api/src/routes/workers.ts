// PURPOSE: worker-only routes: own profile, rate changes (inside the allowed range), "Aaj kaam chahiye" toggle, settings, live location.
import { Router } from 'express';
import { z } from 'zod';
import { changePricingInput, latLngSchema, workerProfileDraft } from '@repo/shared';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';
import { validateBody } from '../middleware/validate';
import {
  requireWorker, setAvailability, updateLiveLocation, updateWorkerPricing, updateWorkerSettings, upsertWorkerProfile,
} from '../services/profile.service';

const router = Router();
router.use(requireAuth, requireRole('WORKER'));

const settings = z.object({
  upiId: z.string().regex(/^[\w.\-]{2,}@[a-zA-Z]{2,}$/, 'Enter a valid UPI ID, like name@upi').optional(),
  workStartHour: z.number().int().min(0).max(23).optional(),
  workEndHour: z.number().int().min(1).max(24).optional(),
  serviceRadiusKm: z.number().int().min(1).max(50).optional(),
  lat: latLngSchema.shape.lat.optional(),
  lng: latLngSchema.shape.lng.optional(),
});

router.get('/me', async (req, res) => res.json(await requireWorker(currentUser(req).id)));

// Typed/manual way to create the profile (voice does the same through /voice/command)
router.post('/me/profile', validateBody(workerProfileDraft), async (req, res) => {
  res.json(await upsertWorkerProfile(currentUser(req), req.body));
});

// Dashboard settings: change service charge / daily rate / salary (buttons or voice)
router.patch('/me/pricing', validateBody(changePricingInput), async (req, res) => {
  res.json(await updateWorkerPricing(currentUser(req).id, req.body));
});

router.patch('/me/availability', validateBody(z.object({ available: z.boolean() })), async (req, res) => {
  res.json({ available: await setAvailability(currentUser(req).id, req.body.available) });
});

router.patch('/me/settings', validateBody(settings), async (req, res) => {
  res.json(await updateWorkerSettings(currentUser(req).id, req.body));
});

// The worker's phone sends its GPS every ~10 seconds while "on the way"
router.post('/me/location', validateBody(latLngSchema), async (req, res) => {
  await updateLiveLocation(currentUser(req).id, req.body.lat, req.body.lng);
  res.json({ ok: true });
});

export default router;
