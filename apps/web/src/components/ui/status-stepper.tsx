'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Step {
  key: string;
  label: string;
}

interface StatusStepperProps {
  steps: Step[];
  currentIndex: number;
  className?: string;
}

export function StatusStepper({ steps, currentIndex, className }: StatusStepperProps) {
  return (
    <ol
      className={cn('flex items-center', className)}
      aria-label="Order status"
    >
      {steps.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const reached = i <= currentIndex;
        return (
          <li key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-bold transition-colors',
                  reached
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground'
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
              </span>
              <span
                className={cn(
                  'text-[11px] font-semibold leading-tight text-center',
                  active ? 'text-primary' : reached ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                className={cn(
                  'mx-1.5 h-0.5 flex-1 rounded-full transition-colors',
                  i < currentIndex ? 'bg-primary' : 'bg-border'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}