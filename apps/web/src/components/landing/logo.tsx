import { AudioLines } from 'lucide-react';
import { brand } from '@/lib/landing-content';

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#C2410C] text-white shadow-sm">
        <AudioLines className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="font-display text-xl tracking-tight text-neutral-900">{brand.name}</span>
    </span>
  );
}
