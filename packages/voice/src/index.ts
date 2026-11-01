import type { LangCode } from '@repo/shared';
import { GnaniProvider } from './gnani';
import type { SpeechProvider, SttResult, TtsResult } from './types';

export * from './types';
export { GnaniProvider } from './gnani';

export const speech: SpeechProvider = new GnaniProvider();

export const isVoiceReplyEnabled = () => process.env.VOICE_REPLY_ENABLED === 'true';

// User audio to text. Convert webm to wav with ffmpeg in the API first if Gnani needs wav.
export function transcribe(audio: Buffer, lang: LangCode, mimeType?: string): Promise<SttResult> {
  return speech.stt(audio, { lang, mimeType });
}

// AI replies are fixed templates, so the same sentence is spoken again and again: cache the audio.
const cache = new Map<string, TtsResult>();
const MAX_CACHE = 200;

// Text to speech. Returns null when voice replies are off or TTS fails, so the UI just shows the text.
export async function speak(text: string, lang: LangCode): Promise<TtsResult | null> {
  if (!isVoiceReplyEnabled()) return null;
  const key = `${lang}:${text}`;
  const hit = cache.get(key);
  if (hit) return hit;
  try {
    const result = await speech.tts(text, { lang });
    if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value as string);
    cache.set(key, result);
    return result;
  } catch (err) {
    console.error('[voice] TTS failed, falling back to text only:', err);
    return null;
  }
}