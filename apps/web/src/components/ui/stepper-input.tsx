'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperInputProps {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  prefix?: string;
  className?: string;
}

export function StepperInput({
  value,
  onChange,
  step = 10,
  min = 0,
  max = 100000,
  prefix = 'Rs',
  className,
}: StepperInputProps) {
  const clamp = (v: number) => Math.min(Math.max(v, min), max);
  return (
    <div className={cn('flex items-stretch overflow-hidden rounded-2xl border border-border', className)}>
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        disabled={value <= min}
        aria-label="Decrease"
        className="grid w-14 place-items-center bg-muted text-foreground hover:bg-accent disabled:opacity-40"
      >
        <Minus className="h-5 w-5" />
      </button>
      <div className="flex flex-1 flex-col items-center justify-center bg-card px-3 py-2">
        <span className="text-xl font-extrabold text-foreground">
          {prefix} {value.toLocaleString('en-IN')}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        disabled={value >= max}
        aria-label="Increase"
        className="grid w-14 place-items-center bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}