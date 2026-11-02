'use client';

import { Check, X, Info } from 'lucide-react';
import { content } from '../../lib/content';
import { rupees } from '../../lib/format';
import type { Quote } from '@/types';

interface QuoteApprovalCardProps {
  quote: Quote;
  visitCharge: number;
  onApprove?: () => void;
  onReject?: () => void;
  resolved?: boolean;
}

export function QuoteApprovalCard({
  quote,
  visitCharge,
  onApprove,
  onReject,
  resolved = false,
}: QuoteApprovalCardProps) {
  const total = quote.labour + quote.material;
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold text-foreground">
        {content.employer.orders.detail.quoteTitle}
      </h3>

      <dl className="mt-4 space-y-2.5 text-base">
        <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-2.5">
          <dt className="font-medium text-muted-foreground">{content.worker.orders.detail.quoteLabour}</dt>
          <dd className="font-bold text-foreground">{rupees(quote.labour)}</dd>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-2.5">
          <dt className="font-medium text-muted-foreground">{content.worker.orders.detail.quoteMaterial}</dt>
          <dd className="font-bold text-foreground">{rupees(quote.material)}</dd>
        </div>
        {quote.note && (
          <p className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground">
            &ldquo;{quote.note}&rdquo;
          </p>
        )}
        <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3">
          <dt className="font-semibold text-primary-foreground">{content.worker.orders.detail.quoteTotal}</dt>
          <dd className="text-xl font-extrabold text-primary-foreground">{rupees(total)}</dd>
        </div>
      </dl>

      {resolved ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-success/15 px-4 py-2 text-sm font-semibold text-success">
          <Check className="h-4 w-4" /> Quote approved
        </div>
      ) : (
        <>
          <div className="mt-4 inline-flex items-start gap-2 rounded-2xl bg-warning/10 px-3 py-2 text-xs font-medium text-warning-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {content.employer.orders.detail.rejectNote.replace('{amount}', String(visitCharge))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onReject}
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-base font-bold text-foreground hover:bg-accent"
            >
              <X className="h-5 w-5" />
              {content.employer.orders.detail.reject}
            </button>
            <button
              type="button"
              onClick={onApprove}
              className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-5 w-5" />
              {content.employer.orders.detail.approve}
            </button>
          </div>
        </>
      )}
    </div>
  );
}