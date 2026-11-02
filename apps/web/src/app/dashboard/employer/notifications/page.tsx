import { NotificationsList } from '../../../../components/ui/notifications-list';
import { mockEmployerNotifications } from '@/lib/mock-data';

export default function EmployerNotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <NotificationsList items={mockEmployerNotifications} />
    </div>
  );
}