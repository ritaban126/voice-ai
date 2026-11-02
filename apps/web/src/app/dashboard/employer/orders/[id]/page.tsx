'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { MapView } from '@/components/map/map-view';
import { StatusStepper, type Step } from '@/components/ui/status-stepper';
import { QuoteApprovalCard } from '@/components/employer/quote-approval-card';
import { PaymentCard } from '@/components/employer/payment-card';
import { RateWorkerModal } from '@/components/payments/rate-worker-modal';
import { content, SERVICE_META, INSPECTION_SKILLS } from '@/lib/content';
import { SERVICE_ICONS } from '@/components/ui/service-chip';
// import { rupees } from '@/lib/format';
import type { MapMarker, OrderStatus, Quote } from '@/types';
import { mockEmployerOrders } from '@/lib/mock-data';

const STEPS: Step[] = [
  { key: 'accepted', label: content.worker.orders.steps.accepted },
  { key: 'on_the_way', label: content.worker.orders.steps.onTheWay },
  { key: 'arrived', label: content.worker.orders.steps.arrived },
  { key: 'completed', label: content.worker.orders.steps.completed },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  pending: 0,
  accepted: 0,
  on_the_way: 1,
  arrived: 2,
  completed: 3,
  tomorrow: 0,
  cancelled: 0,
};

export default function EmployerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = mockEmployerOrders.find((o) => o.id === params.id) ?? mockEmployerOrders[0];
  const Icon = SERVICE_ICONS[order.skill];
  const isInspection = INSPECTION_SKILLS.includes(order.skill);

  const [quoteResolved, setQuoteResolved] = React.useState<'approved' | 'rejected' | null>(
    order.status === 'completed' ? 'approved' : null
  );
  const [paid, setPaid] = React.useState(order.status === 'completed');
  const [rateOpen, setRateOpen] = React.useState(false);
  const [submittedRating, setSubmittedRating] = React.useState<number | null>(
    order.rating ?? null
  );

  const sampleQuote: Quote = {
    labour: 350,
    material: 200,
    note: 'Need to replace the tap and add a new PVC pipe.',
    status: 'sent',
  };

  const markers: MapMarker[] = [
    { id: 'home', label: 'Home', x: 50, y: 52, home: true },
    { id: 'worker', label: order.workerName ?? 'Worker', x: 30, y: 34 },
  ];

  const totalAmount = order.totalAmount ?? (sampleQuote.labour + sampleQuote.material + order.visitCharge);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/dashboard/employer/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.worker.orders.detail.back}
      </Link>

      {/* order header */}
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
            <Icon className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-foreground">
              {SERVICE_META[order.skill].label}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-muted-foreground">
              {order.workerName ?? 'Pending'} · {order.timeLabel}
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {order.landmark}
            </p>
          </div>
        </div>

        {order.status !== 'completed' && (
          <div className="mt-4">
            <StatusStepper steps={STEPS} currentIndex={STATUS_INDEX[order.status]} />
          </div>
        )}
      </div>

      {/* tracking map */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
          {content.employer.orders.detail.tracking}
        </h2>
        <MapView markers={markers} route className="min-h-50!" />
      </div>

      {/* quote approval */}
      {isInspection && (
        <QuoteApprovalCard
          quote={sampleQuote}
          visitCharge={order.visitCharge}
          resolved={quoteResolved === 'approved'}
          onApprove={() => setQuoteResolved('approved')}
          onReject={() => setQuoteResolved('rejected')}
        />
      )}

      {/* payment */}
      <PaymentCard
        amount={totalAmount}
        mode={order.paymentMode}
        paid={paid}
        onPaid={() => {
          setPaid(true);
          if (order.status === 'completed') setRateOpen(true);
        }}
      />

      {/* rating */}
      {submittedRating !== null && (
        <div className="rounded-3xl border border-border bg-card p-5 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Your rating</p>
          <div className="mt-2 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-7 w-7 ${n <= submittedRating ? 'fill-primary text-primary' : 'fill-none text-muted-foreground'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* rate button for completed orders without rating */}
      {order.status === 'completed' && submittedRating === null && (
        <button
          type="button"
          onClick={() => setRateOpen(true)}
          className="flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
        >
          <Star className="h-5 w-5" />
          {content.employer.orders.detail.rateTitle}
        </button>
      )}

      <RateWorkerModal
        open={rateOpen}
        onOpenChange={setRateOpen}
        workerName={order.workerName ?? 'Worker'}
        onSubmit={(rating) => {
          setSubmittedRating(rating);
          setRateOpen(false);
        }}
      />
    </div>
  );
}