'use client';

import * as React from 'react';
import {
  Bell,
  CheckCircle,
  CreditCard,
  XCircle,
  UserCheck,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { content } from '@/lib/content';
import type { AppNotification, NotificationType } from '@/types';
import { EmptyState } from '../../components/ui/empty-state';

const ICONS: Record<NotificationType, LucideIcon> = {
  new_order: Bell,
  quote_approved: CheckCircle,
  quote_received: FileText,
  payment_marked: CreditCard,
  payment_received: CreditCard,
  order_update: Bell,
  worker_assigned: UserCheck,
  order_cancelled: XCircle,
};

interface NotificationsListProps {
  items: AppNotification[];
}

export function NotificationsList({ items }: NotificationsListProps) {
  const [list, setList] = React.useState(items);

  const markAll = () => setList((prev) => prev.map((n) => ({ ...n, read: true })));

  if (list.length === 0) {
    return <EmptyState icon={Bell} title={content.notifications.empty} />;
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={markAll}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
        >
          <CheckCircle className="h-4 w-4 text-primary" />
          {content.notifications.markAllRead}
        </button>
      </div>
      <ul className="space-y-3">
        {list.map((n) => {
          const Icon = ICONS[n.type];
          return (
            <li
              key={n.id}
              className={cn(
                'flex items-start gap-3 rounded-3xl border bg-card p-4',
                n.read ? 'border-border' : 'border-primary/30'
              )}
            >
              <span className="relative mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
                {!n.read && (
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full bg-primary ring-2 ring-card" />
                )}
              </span>
              <div className="flex-1">
                <p className="text-base font-bold text-foreground">{n.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-xs font-medium text-muted-foreground">{n.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}