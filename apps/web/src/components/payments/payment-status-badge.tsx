import { cn } from '@/lib/utils';
import { content } from '../../lib/content';
import type { PaymentStatus } from '@/types';

const STYLES: Record<PaymentStatus, string> = {
  pending: 'bg-warning/15 text-warning-foreground border-warning/30',
  marked_paid: 'bg-accent text-accent-foreground border-accent-foreground/20',
  paid: 'bg-success/15 text-success border-success/30',
  disputed: 'bg-destructive/10 text-destructive border-destructive/30',
};

const LABELS: Record<PaymentStatus, string> = {
  pending: content.common.pending,
  marked_paid: content.common.markedPaid,
  paid: content.common.paid,
  disputed: content.common.disputed,
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold',
        STYLES[status]
      )}
    >
      {LABELS[status]}
    </span>
  );
}