import { cn } from '@/lib/utils';

export function Logo({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dims = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
  }[size];
  const text = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'grid place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm',
          dims
        )}
        aria-hidden
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-2/3 w-2/3">
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
      <div className="flex flex-col leading-none">
        <span className={cn('font-extrabold tracking-tight text-foreground', text)}>
          Kaam<span className="text-primary">Bol</span>
        </span>
        {size !== 'sm' && (
          <span className="mt-1 text-[11px] font-medium text-muted-foreground">
            Speak. Get work done.
          </span>
        )}
      </div>
    </div>
  );
}
