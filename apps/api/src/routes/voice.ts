// PURPOSE: the mic. Receives recorded audio (or typed text for testing), runs the voice pipeline, returns the AI reply text + audio.
import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { REPLIES, type ReplyKey } from '@repo/shared';
import { AppError } from '../lib/errors';
import { rateLimit } from '../middleware/rateLimit';
import { currentUser, requireAuth } from '../middleware/requireAuth';
import { validateBody } from '../middleware/validate';
import { replyPayload, runVoiceCommand } from '../services/voice.service';

const router = Router();
router.use(requireAuth, rateLimit({ windowMs: 60_000, max: 30 }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // short clips only

const fields = z.object({
  mode: z.enum(['ONBOARDING', 'DASHBOARD']).default('DASHBOARD'),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

// POST /api/voice/command  (multipart: audio file + mode, lat, lng)
router.post('/command', upload.single('audio'), async (req, res) => {
  if (!req.file) throw new AppError(400, 'AUDIO_REQUIRED', 'Send the recording in the "audio" field');
  const f = fields.parse(req.body);
  res.json(await runVoiceCommand(currentUser(req), { audio: req.file.buffer, mimeType: req.file.mimetype, ...f }));
});

// POST /api/voice/text  { text, mode, lat, lng }  (same pipeline without the microphone: handy while Gnani is not ready)
router.post('/text', validateBody(fields.extend({ text: z.string().min(1).max(1000) })), async (req, res) => {
  res.json(await runVoiceCommand(currentUser(req), req.body));
});

// POST /api/voice/speak { key }  (text + audio of a fixed AI message, e.g. micGuideWorker, workersFound, nextWorkers)
const keys = Object.keys(REPLIES) as [ReplyKey, ...ReplyKey[]];
router.post('/speak', validateBody(z.object({ key: z.enum(keys) })), async (req, res) => {
  res.json(await replyPayload(currentUser(req), req.body.key));
});

export default router;
