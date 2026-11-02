import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
  tone?: 'light' | 'dark';
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  tone = 'light',
  className,
}: SectionHeadingProps) {
  const isDark = tone === 'dark';
  return (
    <div className={cn('max-w-xl', className)}>
      <p
        className={cn(
          'text-sm font-semibold uppercase tracking-[0.14em]',
          isDark ? 'text-amber-400' : 'text-[#C2410C]'
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          'mt-3 font-display text-4xl leading-[1.12] md:text-5xl',
          isDark ? 'text-paper' : 'text-ink'
        )}
      >
        {title}
      </h2>
      {body && (
        <p
          className={cn(
            'mt-4 text-lg leading-normal',
            isDark ? 'text-paper/80' : 'text-ink-2'
          )}
        >
          {body}
        </p>
      )}
    </div>
  );
}
