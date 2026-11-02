'use client';

import * as React from 'react';
import { Briefcase } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderCard } from '@/components/worker/order-card';
import { EmptyState } from '../../../../components/ui/empty-state';
import { ListSkeleton } from '../../../../components/ui/skeleton copy';
import { content } from '@/lib/content';
import type { Order, OrderStatus } from '@/types';
import { mockWorkerOrders } from '@/lib/mock-data';

export default function WorkerOrdersPage() {
  const [loading, setLoading] = React.useState(true);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      setOrders(mockWorkerOrders);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const advance = (order: Order) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== order.id) return o;
        const next: Record<OrderStatus, OrderStatus> = {
          pending: 'accepted',
          accepted: 'on_the_way',
          on_the_way: 'arrived',
          arrived: 'completed',
          completed: 'completed',
          tomorrow: 'accepted',
          cancelled: 'cancelled',
        };
        return { ...o, status: next[o.status] };
      })
    );
  };

  const active = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completed = orders.filter((o) => o.status === 'completed');

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">{content.worker.orders.title}</h1>
      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            {content.worker.orders.active} ({active.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            {content.worker.orders.completed} ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <ListSkeleton count={2} />
          ) : active.length === 0 ? (
            <EmptyState icon={Briefcase} title={content.worker.orders.emptyActive} />
          ) : (
            active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAction={advance}
                detailHref={`/dashboard/worker/orders/${order.id}`}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <ListSkeleton count={2} />
          ) : completed.length === 0 ? (
            <EmptyState icon={Briefcase} title={content.worker.orders.emptyCompleted} />
          ) : (
            completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                detailHref={`/dashboard/worker/orders/${order.id}`}
                showCall={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}