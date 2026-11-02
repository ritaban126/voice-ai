'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';

interface TranscriptChipProps {
  transcript: string;
  onSayAgain?: () => void;
  className?: string;
}

export function TranscriptChip({
  transcript,
  onSayAgain,
  className,
}: TranscriptChipProps) {
  return (
    <div
      className={cn(
        'flex w-full items-start gap-3 rounded-2xl border border-border bg-secondary/60 p-4 animate-fade-up',
        className
      )}
    >
      <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z"
            fill="currentColor"
          />
          <path
            d="M6 11a1 1 0 0 1 1 1 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21a1 1 0 1 1-2 0v-2.07A7 7 0 0 1 5 12a1 1 0 0 1 1-1Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          You said
        </p>
        <p className="mt-0.5 text-base font-medium leading-snug text-foreground">
          &ldquo;{transcript}&rdquo;
        </p>
      </div>
      {onSayAgain && (
        <button
          type="button"
          onClick={onSayAgain}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {content.voice.sayAgain}
        </button>
      )}
    </div>
  );
}