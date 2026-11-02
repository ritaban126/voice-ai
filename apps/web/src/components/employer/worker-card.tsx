'use client';

import { Check, Star, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';
import { rupees } from '../../lib/format';
import type { WorkerPin } from '@/types';

interface WorkerCardProps {
  worker: WorkerPin;
  selected?: boolean;
  monthlySalary?: number;
  onChoose?: () => void;
  actionLabel?: string;
  className?: string;
}

export function WorkerCard({
  worker,
  selected = false,
  monthlySalary,
  onChoose,
  actionLabel,
  className,
}: WorkerCardProps) {
  return (
    <article
      className={cn(
        'rounded-3xl border bg-card p-5 transition-all',
        selected ? 'border-primary/40 shadow-md ring-2 ring-primary/15' : 'border-border',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
          {worker.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold text-foreground">{worker.name}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {worker.rating} · {worker.ratingCount} {content.common.ratings}
          </p>
        </div>
        {selected && (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-xl bg-secondary px-3 py-2">
          <dt className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Navigation className="h-3 w-3" /> Distance
          </dt>
          <dd className="font-bold text-foreground">{worker.distanceKm} km</dd>
        </div>
        <div className="rounded-xl bg-secondary px-3 py-2">
          <dt className="text-[11px] font-medium text-muted-foreground">Area</dt>
          <dd className="font-bold text-foreground">{worker.area}</dd>
        </div>
      </dl>

      {monthlySalary !== undefined ? (
        <p className="mt-3 text-2xl font-extrabold text-primary">
          {rupees(monthlySalary)}
          <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>
        </p>
      ) : (
        worker.visitCharge > 0 && (
          <p className="mt-3 text-lg font-bold text-foreground">
            Visit charge <span className="text-primary">{rupees(worker.visitCharge)}</span>
          </p>
        )
      )}

      {onChoose && (
        <button
          type="button"
          onClick={onChoose}
          className={cn(
            'mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-colors',
            selected
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'border border-primary/40 bg-card text-primary hover:bg-accent'
          )}
        >
          {actionLabel ?? content.employer.home.choose}
        </button>
      )}
    </article>
  );
}