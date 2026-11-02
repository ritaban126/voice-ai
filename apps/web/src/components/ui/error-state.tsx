'use client';

import { AlertCircle, RotateCcw } from 'lucide-react';
import { content } from '@/lib/content';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-7 w-7" />
      </span>
      <p className="mt-3 text-base font-medium text-foreground">
        {message ?? content.common.error}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          {content.common.retry}
        </button>
      )}
    </div>
  );
}