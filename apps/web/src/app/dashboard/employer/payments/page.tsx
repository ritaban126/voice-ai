'use client';

import * as React from 'react';
import { Wallet, TrendingUp } from 'lucide-react';
import { StatCard } from '../../../../components/ui/stat-card';
import { PaymentStatusBadge } from '@/components/payments/payment-status-badge';
import { QrCard } from '@/components/payments/qr-card';
import { ListSkeleton } from '../../../../components/ui/skeleton copy';
import { EmptyState } from '../../../../components/ui/empty-state';
import { SERVICE_ICONS } from '@/components/ui/service-chip';
import { content } from '@/lib/content';
import { rupees } from '@/lib/format';
import { mockEmployerPayments } from '@/lib/mock-data';

export default function EmployerPaymentsPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const spentMonth = mockEmployerPayments
    .filter((p) => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pending = mockEmployerPayments
    .filter((p) => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold text-foreground">{content.employer.payments.title}</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label={content.employer.payments.spentMonth} value={rupees(spentMonth)} icon={<TrendingUp className="h-4 w-4" />} accent />
        <StatCard label={content.employer.payments.pending} value={rupees(pending)} icon={<Wallet className="h-4 w-4" />} />
      </div>

      <QrCard title={content.employer.payments.upiTitle} upiId="kaambol@upi" />

      <div className="space-y-3">
        {loading ? (
          <ListSkeleton count={3} />
        ) : mockEmployerPayments.length === 0 ? (
          <EmptyState icon={Wallet} title={content.employer.payments.empty} />
        ) : (
          mockEmployerPayments.map((p) => {
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}