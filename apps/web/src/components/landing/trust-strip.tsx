import { trustPoints } from '@/lib/landing-content';

export function TrustStrip() {
  return (
    <section aria-label="Highlights" className="bg-neutral-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {trustPoints.map(({ label, icon: Icon }) => (
            <div 
              key={label} 
              className="flex items-center gap-3.5 rounded-xl bg-white/5 p-4 sm:bg-transparent sm:p-0"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#C2410C]/20 text-amber-400">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="text-[15px] font-medium leading-snug text-neutral-200">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
