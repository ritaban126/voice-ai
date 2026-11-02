import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  body?: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, body, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center',
        className
      )}
    >
      <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-primary">
        <Icon className="h-8 w-8" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-lg font-bold text-foreground">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>}
    </div>
  );
}