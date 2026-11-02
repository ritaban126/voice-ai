'use client';

import Link from 'next/link';
import { Phone, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content, SERVICE_META } from '../../lib/content';
import { SERVICE_ICONS } from '../../components/ui/service-chip';
import { StatusStepper, type Step } from '../../components/ui/status-stepper';
import { rupees } from '../../lib/format';
import type { Order, OrderStatus } from '@/types';

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

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  accepted: content.worker.orders.onTheWay,
  on_the_way: content.worker.orders.arrived,
  arrived: content.worker.orders.finish,
};

interface OrderCardProps {
  order: Order;
  onAction?: (order: Order) => void;
  detailHref?: string;
  showCall?: boolean;
}

export function OrderCard({ order, onAction, detailHref, showCall = true }: OrderCardProps) {
  const Icon = SERVICE_ICONS[order.skill];
  const idx = STATUS_INDEX[order.status];
  const actionLabel = ACTION_LABEL[order.status];
  const showEmployer = order.status !== 'pending' && order.customerName;

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
          <Icon className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-foreground">
              {SERVICE_META[order.skill].label}
            </h3>
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              {order.timeLabel}
            </span>
          </div>
          {showEmployer && (
            <p className="mt-0.5 text-sm font-medium text-muted-foreground">
              {order.customerName} · {order.customerArea}
            </p>
          )}
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
          <StatusStepper steps={STEPS} currentIndex={idx} />
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {showEmployer && showCall && order.status !== 'completed' && (
          <a
            href={`tel:${order.customerName}`}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-card px-4 text-base font-bold text-foreground hover:bg-accent"
          >
            <Phone className="h-4 w-4 text-primary" />
            {content.worker.orders.call}
          </a>
        )}

        {actionLabel && onAction && (
          <button
            type="button"
            onClick={() => onAction(order)}
            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            {actionLabel}
          </button>
        )}

        {order.status === 'completed' && detailHref && (
          <Link
            href={detailHref}
            className="flex min-h-14 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            {content.worker.orders.onViewDetail}
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}

        {detailHref && order.status !== 'completed' && (
          <Link
            href={detailHref}
            aria-label="View details"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-foreground hover:bg-accent"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>
    </article>
  );
}