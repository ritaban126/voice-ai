import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-700',
  secondary: 'border border-ink/20 text-ink hover:border-ink hover:bg-paper-2',
  light: 'bg-paper text-ink hover:bg-white',
} as const;

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  icon?: LucideIcon;
  className?: string;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  icon: Icon,
  className,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        variants[variant],
        className
      )}
    >
      {children}
      {Icon && (
        <Icon
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}
