'use client';

import * as React from 'react';
import { Briefcase } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderCard } from '@/components/worker/order-card';
import { EmptyState } from '../../../../components/ui/empty-state';
import { ListSkeleton } from '../../../../components/ui/skeleton copy';
import { content } from '@/lib/content';
import { mockEmployerOrders } from '@/lib/mock-data';

export default function EmployerOrdersPage() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const active = mockEmployerOrders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completed = mockEmployerOrders.filter((o) => o.status === 'completed');

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">{content.nav.employer.orders}</h1>
      <Tabs defaultValue="active">
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            {content.employer.orders.active} ({active.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            {content.employer.orders.completed} ({completed.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <ListSkeleton count={2} />
          ) : active.length === 0 ? (
            <EmptyState icon={Briefcase} title={content.employer.orders.emptyActive} />
          ) : (
            active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                detailHref={`/dashboard/employer/orders/${order.id}`}
                showCall={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            <ListSkeleton count={2} />
          ) : completed.length === 0 ? (
            <EmptyState icon={Briefcase} title={content.employer.orders.emptyCompleted} />
          ) : (
            completed.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                detailHref={`/dashboard/employer/orders/${order.id}`}
                showCall={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}