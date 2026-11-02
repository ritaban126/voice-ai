'use client';

import * as React from 'react';
import type { VoiceState } from '@/types';

type Listener = (state: VoiceState) => void;

export interface UseVoiceResult extends VoiceState {
  start: (
    transcript?: string,
    aiReply?: string,
    opts?: { speaking?: boolean }
  ) => void;
  reset: () => void;
  setStatus: (s: VoiceState['status']) => void;
}

export function useVoice(): UseVoiceResult {
  const [state, setState] = React.useState<VoiceState>({
    status: 'idle',
    transcript: '',
    aiReply: '',
  });
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const listeners = React.useRef<Set<Listener>>(new Set());

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const emit = (next: VoiceState) => {
    setState(next);
    listeners.current.forEach((l) => l(next));
  };

  React.useEffect(() => () => clear(), []);

  const start: UseVoiceResult['start'] = React.useCallback(
    (transcript = '', aiReply = '', opts) => {
      clear();
      // recording
      emit({ status: 'recording', transcript: '', aiReply: '' });
      const t1 = setTimeout(() => {
        emit({ status: 'processing', transcript: '', aiReply: '' });
        const t2 = setTimeout(() => {
          const speaking = opts?.speaking ?? true;
          emit({ status: speaking ? 'speaking' : 'idle', transcript, aiReply });
          if (speaking) {
            const t3 = setTimeout(() => {
              emit({ status: 'idle', transcript, aiReply });
            }, 2400);
            timers.current.push(t3);
          }
        }, 1400);
        timers.current.push(t2);
      }, 2600);
      timers.current.push(t1);
    },
    []
  );

  const reset = React.useCallback(() => {
    clear();
    emit({ status: 'idle', transcript: '', aiReply: '' });
  }, []);

  const setStatus = React.useCallback((s: VoiceState['status']) => {
    setState((prev) => ({ ...prev, status: s }));
  }, []);

  return { ...state, start, reset, setStatus };
}