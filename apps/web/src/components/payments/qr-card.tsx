import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QrCardProps {
  title: string;
  note?: string;
  upiId?: string;
  className?: string;
}

export function QrCard({ title, note, upiId, className }: QrCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-3xl border border-border bg-card p-6 text-center',
        className
      )}
    >
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <div className="my-4 grid h-40 w-40 place-items-center rounded-2xl border-2 border-dashed border-border bg-secondary/50">
        {/* placeholder QR pattern */}
        <svg viewBox="0 0 100 100" className="h-32 w-32 text-foreground/80" fill="none">
          <rect x="6" y="6" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="4" />
          <rect x="14" y="14" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="66" y="6" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="4" />
          <rect x="74" y="14" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="6" y="66" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="4" />
          <rect x="14" y="74" width="12" height="12" rx="1" fill="currentColor" />
          <rect x="42" y="10" width="6" height="6" fill="currentColor" />
          <rect x="54" y="10" width="6" height="6" fill="currentColor" />
          <rect x="42" y="22" width="6" height="6" fill="currentColor" />
          <rect x="58" y="40" width="6" height="6" fill="currentColor" />
          <rect x="46" y="52" width="6" height="6" fill="currentColor" />
          <rect x="62" y="58" width="6" height="6" fill="currentColor" />
          <rect x="40" y="70" width="6" height="6" fill="currentColor" />
          <rect x="54" y="78" width="6" height="6" fill="currentColor" />
          <rect x="72" y="70" width="6" height="6" fill="currentColor" />
          <rect x="84" y="84" width="6" height="6" fill="currentColor" />
        </svg>
      </div>
      {upiId && (
        <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-foreground">
          <QrCode className="h-4 w-4 text-primary" /> {upiId}
        </p>
      )}
      {note && <p className="mt-2 text-sm text-muted-foreground">{note}</p>}
    </div>
  );
}