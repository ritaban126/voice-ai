'use client';

import {
  Wrench,
  Zap,
  Hammer,
  PaintRoller,
  Sparkles,
  Users,
  Stethoscope,
  Scissors,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SERVICE_META } from '@/lib/content';
import type { ServiceSkill } from '@/types';

export const SERVICE_ICONS: Record<ServiceSkill, LucideIcon> = {
  plumber: Wrench,
  electrician: Zap,
  carpenter: Hammer,
  painter: PaintRoller,
  cleaning: Sparkles,
  maid: Users,
  nurse: Stethoscope,
  salon: Scissors,
};

interface ServiceChipProps {
  skill: ServiceSkill;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}

export function ServiceChip({
  skill,
  active = false,
  onClick,
  className,
  compact = false,
}: ServiceChipProps) {
  const Icon = SERVICE_ICONS[skill];
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border font-medium transition-colors',
        compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-base',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent',
        className
      )}
    >
      <Icon className={compact ? 'h-4 w-4' : 'h-5 w-5'} strokeWidth={2} />
      {SERVICE_META[skill].short}
    </Comp>
  );
}