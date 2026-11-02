'use client';

import { Volume2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';

interface AiMessageProps {
  message: string;
  onReplay?: () => void;
  muted?: boolean;
  className?: string;
  animate?: boolean;
}

export function AiMessage({
  message,
  onReplay,
  muted = false,
  className,
  animate = true,
}: AiMessageProps) {
  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 animate-fade-up',
        className
      )}
    >
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
            fill="currentColor"
          />
          <path
            d="M6 11a1 1 0 0 1 1 1 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21a1 1 0 1 1-2 0v-2.07A7 7 0 0 1 5 12a1 1 0 0 1 1-1Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="flex-1 rounded-2xl rounded-tl-sm bg-primary px-4 py-3">
        <p className="text-base font-medium leading-snug text-primary-foreground">
          {message}
        </p>
      </div>
      {!muted && onReplay && (
        <button
          type="button"
          onClick={onReplay}
          aria-label={content.voice.replay}
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-background text-foreground hover:bg-accent"
        >
          {animate ? (
            <Volume2 className="h-4 w-4 animate-speaker-pulse" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  );
}