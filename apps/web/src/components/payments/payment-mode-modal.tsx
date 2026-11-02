'use client';

import * as React from 'react';
import { Smartphone, Banknote } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';
import type { PaymentMode } from '@/types';
import { rupees } from '../../lib/format';

interface PaymentModeModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  amount: number;
  onConfirm: (mode: PaymentMode) => void;
}

export function PaymentModeModal({
  open,
  onOpenChange,
  amount,
  onConfirm,
}: PaymentModeModalProps) {
  const [mode, setMode] = React.useState<PaymentMode>('upi');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold">
            {content.employer.home.payMode}
          </DialogTitle>
          <DialogDescription className="text-base">
            {content.employer.home.payNow.replace('{amount}', String(amount))}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode('upi')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-colors',
              mode === 'upi'
                ? 'border-primary bg-accent'
                : 'border-border bg-card hover:bg-accent/50'
            )}
          >
            <Smartphone className="h-8 w-8 text-primary" strokeWidth={2} />
            <span className="text-lg font-bold text-foreground">UPI</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('cash')}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-colors',
              mode === 'cash'
                ? 'border-primary bg-accent'
                : 'border-border bg-card hover:bg-accent/50'
            )}
          >
            <Banknote className="h-8 w-8 text-primary" strokeWidth={2} />
            <span className="text-lg font-bold text-foreground">Cash</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(mode)}
          className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
        >
          {content.employer.home.payNow.replace('{amount}', String(amount))}
        </button>
      </DialogContent>
    </Dialog>
  );
}