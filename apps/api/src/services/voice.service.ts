// PURPOSE: the voice pipeline. audio -> text (Gnani STT) -> intent (extract.service) -> do the action (profile / rate / request)
// -> pick the AI reply -> speak it (Gnani TTS) in the user's language. Every call is logged in voice_logs.
import { db, voiceLogs } from '@repo/db';
import { reply, type LangCode, type ReplyKey, type VoiceIntent } from '@repo/shared';
import { speak, transcribe } from '@repo/voice';
import { env } from '../env';
import { toWav } from '../lib/audio';
import { AppError } from '../lib/errors';
import type { SessionUser } from '../types';
import { extractIntent } from './extract.service';
import {
  ensureEmployerProfile, getEmployerProfile, resolveEmployerLocation, setAvailability, updateWorkerPricing, upsertWorkerProfile,
} from './profile.service';
import { createRequest, startSearch } from './request.service';

export interface ReplyPayload {
  replyKey: ReplyKey;
  replyText: string; // always shown on screen
  audioBase64?: string; // played if present (voice replies on and TTS worked)
  mimeType?: string;
}
export interface VoiceResult extends ReplyPayload {
  transcript: string;
  intent: string;
  data?: Record<string, unknown>;
  error?: string;
}
interface Ctx {
  mode: 'ONBOARDING' | 'DASHBOARD';
  lat?: number;
  lng?: number;
  transcript: string;
}

// Turns a reply key into text (+ audio in the user's language). Used by voice and by the order screens.
export async function replyPayload(user: Pick<SessionUser, 'lang' | 'voiceReplies'>, key: ReplyKey): Promise<ReplyPayload> {
  const replyText = reply(key, user.lang);
  const out: ReplyPayload = { replyKey: key, replyText };
  if (user.voiceReplies) {
    const audio = await speak(replyText, user.lang);
    if (audio) {
      out.audioBase64 = audio.audio.toString('base64');
      out.mimeType = audio.mimeType;
    }
  }
  return out;
}

// What the user said -> what we do -> which reply to give
async function handleIntent(user: SessionUser, intent: VoiceIntent, ctx: Ctx): Promise<{ key: ReplyKey; data?: Record<string, unknown> }> {
  if (user.role === 'WORKER') {
    switch (intent.intent) {
      case 'SET_PROFILE': {
        const res = await upsertWorkerProfile(user, intent.data, { lat: ctx.lat, lng: ctx.lng, transcript: ctx.transcript });
        return { key: ctx.mode === 'ONBOARDING' ? 'accountCreatedWorker' : 'profileUpdated', data: res };
      }
      case 'CHANGE_RATE':
        await updateWorkerPricing(user.id, intent.data);
        return { key: 'rateUpdated' };
      case 'SET_AVAILABLE':
        await setAvailability(user.id, intent.data.available);
        return { key: intent.data.available ? 'availabilityOn' : 'availabilityOff' };
    }
  }
  if (user.role === 'EMPLOYER' && intent.intent === 'REQUEST_WORKER') {
    const draft = intent.data;
    const loc = await resolveEmployerLocation(user.id, { lat: ctx.lat, lng: ctx.lng, addressNote: draft.addressNote });
    if (ctx.mode === 'ONBOARDING' || !(await getEmployerProfile(user.id))) {
      await ensureEmployerProfile(user.id, { ...loc, addressNote: draft.addressNote }); // first time: remember the home
    }
    const request = await createRequest({ employerId: user.id, draft, lat: loc.lat, lng: loc.lng, transcript: ctx.transcript });
    startSearch(request.id); // AI says "wait a minute", workers are searched in the background
    return { key: 'orderSearching', data: { requestId: request.id } };
  }
  return { key: 'notUnderstood' };
}

export async function runVoiceCommand(
  user: SessionUser,
  input: { text?: string; audio?: Buffer; mimeType?: string; mode: 'ONBOARDING' | 'DASHBOARD'; lat?: number; lng?: number },
): Promise<VoiceResult> {
  if (!user.role) throw new AppError(409, 'ROLE_NOT_SET', 'Choose worker or employer first');
  const lang: LangCode = user.lang;

  // 1. speech to text (or typed text for testing)
  let transcript = input.text?.trim() ?? '';
  if (!transcript && input.audio) {
    try {
      const wav = env.CONVERT_TO_WAV === 'true';
      const audio = wav ? await toWav(input.audio) : input.audio;
      transcript = (await transcribe(audio, lang, wav ? 'audio/wav' : input.mimeType)).text;
    } catch (err) {
      console.error('[voice] STT failed', err);
    }
  }

  // 2. text to intent, 3. do it, 4. choose reply
  let intent: VoiceIntent = { intent: 'UNKNOWN' };
  let key: ReplyKey = 'notUnderstood';
  let data: Record<string, unknown> | undefined;
  let error: string | undefined;
  if (transcript) {
    intent = await extractIntent(transcript, user.role, lang);
    try {
      ({ key, data } = await handleIntent(user, intent, { mode: input.mode, lat: input.lat, lng: input.lng, transcript }));
    } catch (err) {
      if (!(err instanceof AppError)) throw err;
      key = err.code === 'OUT_OF_BAND' ? 'rateOutOfRange' : 'notUnderstood';
      error = err.message;
    }
  }

  // 5. log, 6. speak
  const payload = await replyPayload(user, key);
  await db.insert(voiceLogs).values({
    userId: user.id, lang, transcript, intent: intent.intent, parsedJson: intent, replyKey: key, replyText: payload.replyText,
  });
  return { ...payload, transcript, intent: intent.intent, data, error };
}
