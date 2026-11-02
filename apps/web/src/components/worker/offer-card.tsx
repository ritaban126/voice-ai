'use client';

import { MapPin, Clock, Banknote, Smartphone, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content, SERVICE_META } from '../../lib/content';
import { SERVICE_ICONS } from '../../components/ui/service-chip';
import { rupees } from '../../lib/format';
import type { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
  onAccept?: () => void;
  onSkip?: () => void;
  highlighted?: boolean;
}

export function OfferCard({ offer, onAccept, onSkip, highlighted = false }: OfferCardProps) {
  const Icon = SERVICE_ICONS[offer.skill];
  return (
    <article
      className={cn(
        'rounded-3xl border bg-card p-5 transition-shadow',
        highlighted ? 'border-primary/40 shadow-md ring-2 ring-primary/15' : 'border-border'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">
              {SERVICE_META[offer.skill].label}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              {offer.timeLabel}
            </span>
          </div>
          <p className="mt-0.5 text-sm font-medium text-muted-foreground">
            {offer.employerName} · {offer.employerArea}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-extrabold text-primary">{rupees(offer.visitCharge)}</p>
          <p className="text-[11px] font-medium text-muted-foreground">visit charge</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-1.5 text-foreground">
          <Navigation className="h-4 w-4 text-muted-foreground" />
          {offer.distanceKm} {content.common.km}
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {offer.timeLabel}
        </div>
        <div className="flex items-center gap-1.5 text-foreground">
          {offer.paymentMode === 'upi' ? (
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Banknote className="h-4 w-4 text-muted-foreground" />
          )}
          {offer.paymentMode === 'upi' ? 'UPI' : 'Cash'}
        </div>
      </dl>

      <p className="mt-3 flex items-start gap-1.5 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        {offer.landmark}
      </p>

      {onAccept && onSkip && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="flex min-h-14 items-center justify-center rounded-2xl border border-border bg-card text-lg font-bold text-foreground hover:bg-accent"
          >
            {content.worker.home.skip}
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            {content.worker.home.accept}
          </button>
        </div>
      )}
    </article>
  );
}