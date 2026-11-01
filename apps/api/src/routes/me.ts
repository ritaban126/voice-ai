// PURPOSE: "who am I" routes. Tells the web app where to resume signup, saves language + role, and voice-reply preference.
import { Router } from 'express';
import { z } from 'zod';
import { getResumeStep } from '@repo/auth';
import { langSchema, onboardInput } from '@repo/shared';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { validateBody } from '../middleware/validate';
import { onboardUser, profileInfo, updatePreferences } from '../services/profile.service';

const router = Router();
router.use(requireAuth);

// GET /api/me -> user + whether the profile exists + which signup step to open next
router.get('/', async (req, res) => {
  const user = currentUser(req);
  const info = await profileInfo(user);
  res.json({ user, ...info, resumeStep: getResumeStep({ signedIn: true, role: user.role, hasProfile: info.hasProfile }) });
});

// POST /api/me/onboard { lang, role } (role can be chosen only once)
router.post('/onboard', validateBody(onboardInput), async (req, res) => {
  await onboardUser(currentUser(req), req.body);
  res.json({ ok: true });
});

// PATCH /api/me/preferences { lang?, voiceReplies? } (mute / unmute the AI voice, change language)
router.patch('/preferences', validateBody(z.object({ lang: langSchema.optional(), voiceReplies: z.boolean().optional() })), async (req, res) => {
  await updatePreferences(currentUser(req).id, req.body);
  res.json({ ok: true });
});

export default router;
