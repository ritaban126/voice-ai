'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import { MapView } from '@/components/map/map-view';
import { QuoteForm } from '@/components/worker/quote-form';
import { StatusStepper, type Step } from '@/components/ui/status-stepper';
import { content, SERVICE_META, INSPECTION_SKILLS } from '@/lib/content';
import { SERVICE_ICONS } from '@/components/ui/service-chip';
import { rupees } from '@/lib/format';
import type { Order, OrderStatus, MapMarker } from '@/types';
import { mockWorkerOrders } from '@/lib/mock-data';

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

export default function WorkerOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = mockWorkerOrders.find((o) => o.id === params.id) ?? mockWorkerOrders[0];
  const Icon = SERVICE_ICONS[order.skill];
  const isInspection = INSPECTION_SKILLS.includes(order.skill);

  const markers: MapMarker[] = [
    { id: 'home', label: order.customerName, x: 50, y: 52, home: true },
    { id: 'me', label: 'You', x: 30, y: 34 },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link
        href="/dashboard/worker/orders"
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
              {order.customerName} · {order.customerArea}
            </p>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {order.landmark}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-primary">{rupees(order.visitCharge)}</p>
            <p className="text-[11px] font-medium text-muted-foreground">visit charge</p>
          </div>
        </div>

        {order.status !== 'completed' && (
          <div className="mt-4">
            <StatusStepper steps={STEPS} currentIndex={STATUS_INDEX[order.status]} />
          </div>
        )}
      </div>

      {/* map */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
          {content.worker.orders.detail.map}
        </h2>
        <MapView markers={markers} route className="min-h-55!" />
      </div>

      {/* quote form for inspection jobs */}
      {isInspection && <QuoteForm visitCharge={order.visitCharge} />}
    </div>
  );
}