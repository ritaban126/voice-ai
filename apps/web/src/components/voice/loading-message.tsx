import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingMessageProps {
  text: string;
  className?: string;
}

export function LoadingMessage({ text, className }: LoadingMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-accent bg-accent/40 px-4 py-3 animate-fade-in',
        className
      )}
    >
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <p className="text-base font-medium text-foreground">{text}</p>
    </div>
  );
}