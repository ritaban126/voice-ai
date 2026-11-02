'use client';

import * as React from 'react';
import { Wallet, TrendingUp, Check, X } from 'lucide-react';
import { StatCard } from '../../../../components/ui/stat-card';
import { PaymentStatusBadge } from '@/components/payments/payment-status-badge';
import { QrCard } from '@/components/payments/qr-card';
import { ListSkeleton } from '../../../../components/ui/skeleton copy';
import { EmptyState } from '../../../../components/ui/empty-state';
import { SERVICE_ICONS } from '@/components/ui/service-chip';
import { content } from '@/lib/content';
import { rupees } from '@/lib/format';
import type { PaymentStatus } from '@/types';
import { mockWorkerPayments, workerUser } from '@/lib/mock-data';

export default function WorkerPaymentsPage() {
  const [loading, setLoading] = React.useState(true);
  const [payments, setPayments] = React.useState(mockWorkerPayments);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const pendingTotal = payments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const receivedMonth = payments
    .filter((p) => p.status === 'paid' || p.status === 'marked_paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const setStatus = (id: string, status: PaymentStatus) =>
    setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold text-foreground">{content.worker.payments.title}</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={content.worker.payments.pending} value={rupees(pendingTotal)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label={content.worker.payments.receivedMonth} value={rupees(receivedMonth)} icon={<TrendingUp className="h-4 w-4" />} accent />
      </div>

      <QrCard
        title={content.worker.payments.upiTitle}
        note={content.worker.payments.upiNote}
        upiId={workerUser.upiId}
      />

      <div className="space-y-3">
        {loading ? (
          <ListSkeleton count={3} />
        ) : payments.length === 0 ? (
          <EmptyState icon={Wallet} title={content.worker.payments.empty} />
        ) : (
          payments.map((p) => {
            const Icon = SERVICE_ICONS[p.skill];
            return (
              <div key={p.id} className="rounded-3xl border border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-foreground">{p.party}</p>
                      <PaymentStatusBadge status={p.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">{p.date} · {p.mode.toUpperCase()}</p>
                    <p className="mt-1 text-lg font-extrabold text-primary">{rupees(p.amount)}</p>
                  </div>
                </div>

                {p.status === 'pending' && (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(p.id, 'disputed')}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card text-sm font-bold text-foreground hover:bg-accent"
                    >
                      <X className="h-4 w-4" />
                      {content.worker.payments.notReceived}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(p.id, 'marked_paid')}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90"
                    >
                      <Check className="h-4 w-4" />
                      {content.worker.payments.moneyReceived}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}