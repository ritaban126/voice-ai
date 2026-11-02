'use client';

import { Star, Navigation, Clock, MapPin } from 'lucide-react';
import { content } from '../../lib/content';
import { SERVICE_META } from '../../lib/content';
import { rupees } from '../../lib/format';
import type { WorkerPin } from '@/types';

interface WorkerPopupCardProps {
  worker: WorkerPin;
  onAccept?: () => void;
  onReject?: () => void;
  variant?: 'popup' | 'panel';
}

export function WorkerPopupCard({
  worker,
  onAccept,
  onReject,
  variant = 'popup',
}: WorkerPopupCardProps) {
  return (
    <div
      className={
        variant === 'popup'
          ? 'w-64 rounded-2xl border border-border bg-popover p-4 shadow-xl animate-fade-up'
          : 'rounded-3xl border border-primary/30 bg-card p-5 shadow-sm ring-2 ring-primary/15'
      }
    >
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-base font-bold text-primary-foreground">
          {worker.initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold text-foreground">{worker.name}</p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {worker.rating} · {worker.ratingCount} {content.common.ratings}
          </p>
        </div>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-secondary px-2 py-1.5">
          <dt className="text-[10px] font-medium text-muted-foreground">Distance</dt>
          <dd className="text-sm font-bold text-foreground">{worker.distanceKm} km</dd>
        </div>
        <div className="rounded-xl bg-secondary px-2 py-1.5">
          <dt className="text-[10px] font-medium text-muted-foreground">Visit</dt>
          <dd className="text-sm font-bold text-foreground">{rupees(worker.visitCharge)}</dd>
        </div>
        <div className="rounded-xl bg-secondary px-2 py-1.5">
          <dt className="text-[10px] font-medium text-muted-foreground">ETA</dt>
          <dd className="text-sm font-bold text-foreground">{worker.etaMinutes} min</dd>
        </div>
      </dl>

      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" /> {worker.area} · {SERVICE_META[worker.skill].short}
      </p>

      {onAccept && onReject && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReject}
            className="flex min-h-12 items-center justify-center rounded-2xl border border-border bg-card text-sm font-bold text-foreground hover:bg-accent"
          >
            {content.employer.home.reject}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex min-h-12 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
          >
            {content.employer.home.accept}
          </button>
        </div>
      )}
    </div>
  );
}