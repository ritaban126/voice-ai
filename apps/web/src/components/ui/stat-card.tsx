import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  accent = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-4 sm:p-5',
        accent
          ? 'border-primary/30 bg-primary text-primary-foreground'
          : 'border-border bg-card text-card-foreground',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {icon && (
          <span className={cn(accent ? 'text-primary-foreground/90' : 'text-primary')}>
            {icon}
          </span>
        )}
        <p
          className={cn(
            'text-xs font-medium',
            accent ? 'text-primary-foreground/80' : 'text-muted-foreground'
          )}
        >
          {label}
        </p>
      </div>
      <p className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {value}
      </p>
    </div>
  );
}