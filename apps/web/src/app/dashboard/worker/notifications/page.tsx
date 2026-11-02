import { NotificationsList } from '../../../../components/ui/notifications-list';
import { mockWorkerNotifications } from '@/lib/mock-data';

export default function WorkerNotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <NotificationsList items={mockWorkerNotifications} />
    </div>
  );
}