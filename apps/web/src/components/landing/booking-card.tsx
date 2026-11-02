import { MapPin, BadgeCheck, Clock, Star } from 'lucide-react';
import type { Worker } from '@/lib/landing-content';
import { cn } from '@/lib/utils';
import { ButtonLink } from './button-link';

type BookingCardProps = {
  worker: Worker;
  className?: string;
};

export function BookingCard({ worker, className }: BookingCardProps) {
  return (
    <article
      aria-label={`Booking suggestion: ${worker.name}`}
      className={cn(
        'rounded-2xl border border-ink/10 bg-white p-5 shadow-[0_18px_40px_-24px_rgba(29,27,23,0.35)]',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-50 font-semibold text-emerald-700"
          >
            {worker.initials}
          </span>
          <div>
            <p className="font-semibold leading-tight">{worker.name}</p>
            <p className="mt-0.5 text-sm text-ink-3">{worker.skill}</p>
          </div>
        </div>
        <p className="flex items-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          <span>{worker.rating}</span>
          <span className="font-normal text-ink-3">({worker.jobs})</span>
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4 text-sm">
        <p className="flex items-center gap-2 text-ink-2">
          <MapPin className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
          {worker.distance}
        </p>
        <p className="flex items-center gap-2 text-ink-2">
          <Clock className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
          {worker.eta}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl leading-none">{worker.price}</p>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Identity verified
          </p>
        </div>
        <ButtonLink 
          href="/signup" 
          className="h-11 px-5 text-sm bg-[#C2410C] hover:bg-[#9A3412] text-white"
        >
          Book in one tap
        </ButtonLink>
      </div>
    </article>
  );
}
