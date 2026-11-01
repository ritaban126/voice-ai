import type { LangCode } from '@repo/shared';
import { VoiceError, type SpeechProvider, type SttResult, type TtsResult } from './types';

/**
 * Gnani adapter.
 * IMPORTANT: the endpoint URLs, auth header, form/JSON field names and language codes below are
 * PLACEHOLDERS. Check docs.gnani.ai and fix the 4 marked spots (search "GNANI-DOCS").
 * Everything else in the app talks to the SpeechProvider interface, so only this file changes.
 */

// GNANI-DOCS 1: language codes Gnani expects (and whether bn / ta are supported)
const GNANI_LANG: Record<LangCode, string> = { hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', en: 'en-IN' };

function need(name: 'GNANI_STT_URL' | 'GNANI_TTS_URL'): string {
  const v = process.env[name];
  if (!v) throw new VoiceError('NOT_CONFIGURED', `${name} is not set`);
  return v;
}

// GNANI-DOCS 2: auth scheme
function authHeaders(): Record<string, string> {
  const key = process.env.GNANI_API_KEY;
  if (!key) throw new VoiceError('NOT_CONFIGURED', 'GNANI_API_KEY is not set');
  return { Authorization: `Bearer ${key}` };
}

export class GnaniProvider implements SpeechProvider {
  async stt(audio: Buffer, opts: { lang: LangCode; mimeType?: string }): Promise<SttResult> {
    const form = new FormData();
    // GNANI-DOCS 3: multipart field names
    form.append('audio_file', new Blob([new Uint8Array(audio)], { type: opts.mimeType ?? 'audio/wav' }), 'speech.wav');
    form.append('language_code', GNANI_LANG[opts.lang]);

    const res = await fetch(need('GNANI_STT_URL'), { method: 'POST', headers: authHeaders(), body: form });
    if (!res.ok) throw new VoiceError('STT_FAILED', `Gnani STT ${res.status}: ${await res.text()}`);

    const json = (await res.json()) as Record<string, unknown>;
    const text = String(json.transcript ?? json.text ?? '').trim(); // GNANI-DOCS 4: response field
    return { text, confidence: typeof json.confidence === 'number' ? json.confidence : undefined };
  }

  async tts(text: string, opts: { lang: LangCode }): Promise<TtsResult> {
    const res = await fetch(need('GNANI_TTS_URL'), {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language_code: GNANI_LANG[opts.lang] }),
    });
    if (!res.ok) throw new VoiceError('TTS_FAILED', `Gnani TTS ${res.status}: ${await res.text()}`);

    return {
      audio: Buffer.from(await res.arrayBuffer()),
      mimeType: res.headers.get('content-type') ?? 'audio/wav',
    };
  }
}