'use client';

import { Check, Smartphone, Banknote } from 'lucide-react';
import { QrCard } from '@/components/payments/qr-card';
import { content } from '../../lib/content';
import { rupees } from '../../lib/format';
import type { PaymentMode } from '@/types';

interface PaymentCardProps {
  amount: number;
  mode: PaymentMode;
  upiId?: string;
  paid?: boolean;
  onPaid?: () => void;
}

export function PaymentCard({ amount, mode, upiId, paid = false, onPaid }: PaymentCardProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <h3 className="text-lg font-bold text-foreground">
        {content.employer.orders.detail.paymentTitle}
      </h3>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-5 py-4">
        <span className="text-base font-semibold text-primary-foreground">Amount</span>
        <span className="text-2xl font-extrabold text-primary-foreground">{rupees(amount)}</span>
      </div>

      <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
        {mode === 'upi' ? <Smartphone className="h-4 w-4 text-primary" /> : <Banknote className="h-4 w-4 text-primary" />}
        {mode === 'upi' ? 'UPI' : 'Cash'}
      </p>

      {mode === 'upi' && amount > 0 && (
        <div className="mt-4">
          <QrCard title={content.employer.payments.upiTitle} upiId={upiId ?? 'kaambol@upi'} />
        </div>
      )}

      {paid ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-success/15 px-4 py-2 text-sm font-semibold text-success">
          <Check className="h-4 w-4" /> Paid
        </div>
      ) : (
        onPaid && (
          <button
            type="button"
            onClick={onPaid}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            <Check className="h-5 w-5" />
            {content.employer.orders.detail.iPaid}
          </button>
        )
      )}
    </div>
  );
}