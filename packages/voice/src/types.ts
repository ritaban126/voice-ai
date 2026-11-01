import type { LangCode } from '@repo/shared';

export interface SttResult {
  text: string;
  confidence?: number;
}
export interface TtsResult {
  audio: Buffer;
  mimeType: string; // e.g. audio/wav or audio/mpeg
}

// Any speech vendor must implement this, so switching from Gnani to another provider touches one file.
export interface SpeechProvider {
  stt(audio: Buffer, opts: { lang: LangCode; mimeType?: string }): Promise<SttResult>;
  tts(text: string, opts: { lang: LangCode }): Promise<TtsResult>;
}

export class VoiceError extends Error {
  constructor(
    public code: 'NOT_CONFIGURED' | 'STT_FAILED' | 'TTS_FAILED',
    message: string,
  ) {
    super(message);
    this.name = 'VoiceError';
  }
}