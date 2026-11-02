'use client';

import { Phone, X, Navigation, Clock, MapPin } from 'lucide-react';
import { MapView } from '@/components/map/map-view';
import { content } from '../../lib/content';
import { rupees } from '../../lib/format';
import type { MapMarker, WorkerPin } from '@/types';

interface TrackingCardProps {
  worker: WorkerPin;
  progress?: number;
  onCancel?: () => void;
}

export function TrackingCard({ worker, progress = 0.3, onCancel }: TrackingCardProps) {
  const markers: MapMarker[] = [
    { id: 'home', label: 'Home', x: 50, y: 52, home: true },
    { id: worker.id, label: worker.name, x: worker.x, y: worker.y },
  ];

  return (
    <div className="rounded-3xl border border-primary/30 bg-card p-5 shadow-sm ring-2 ring-primary/15 animate-fade-up">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">
          {content.employer.home.tracking.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary-foreground" />
          On the way
        </span>
      </div>

      <div className="mt-3">
        <MapView
          markers={markers}
          route
          movingPinId={worker.id}
          movingProgress={progress}
          className="min-h-50!"
        />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-secondary px-2 py-2">
          <dt className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Clock className="h-3 w-3" /> ETA
          </dt>
          <dd className="mt-0.5 text-base font-bold text-foreground">
            {Math.max(1, Math.round(worker.etaMinutes * (1 - progress)))} min
          </dd>
        </div>
        <div className="rounded-xl bg-secondary px-2 py-2">
          <dt className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
            <Navigation className="h-3 w-3" /> Distance
          </dt>
          <dd className="mt-0.5 text-base font-bold text-foreground">
            {Math.max(0.1, worker.distanceKm * (1 - progress)).toFixed(1)} km
          </dd>
        </div>
        <div className="rounded-xl bg-secondary px-2 py-2">
          <dt className="flex items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" /> Status
          </dt>
          <dd className="mt-0.5 text-base font-bold text-foreground">On the way</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center gap-3">
        <a
          href={`tel:${worker.name}`}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 text-base font-bold text-foreground hover:bg-accent"
        >
          <Phone className="h-5 w-5 text-primary" />
          {content.employer.home.call}
        </a>
        <button
          type="button"
          onClick={onCancel}
          className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl border border-destructive/30 bg-card text-base font-bold text-destructive hover:bg-destructive/5"
        >
          <X className="h-5 w-5" />
          {content.employer.home.cancel}
        </button>
      </div>
    </div>
  );
}