import { QrCode, Banknote, Receipt, Smartphone } from 'lucide-react';
import { paymentPoints } from '@/lib/landing-content';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

const icons = [QrCode, Banknote, Receipt];

export function Payment() {
  return (
    <section className="border-y border-neutral-800 bg-[#141210] px-5 py-24 text-neutral-100 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            tone="dark"
            eyebrow="Payment"
            title="UPI QR or cash. A receipt either way."
            body="The worker shows a QR on their phone. You scan and pay, or you pay cash. Both of you get the same record."
          />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {paymentPoints.map((point, index) => {
            const Icon = icons[index];
            return (
              <Reveal key={point.title} delay={index * 100}>
                <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white/3 p-7 transition-colors hover:border-white/25">
                  <span className="mb-6 inline-block text-amber-400">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-xl text-white">{point.title}</h3>
                  <p className="mt-3 text-[15px] leading-normal text-neutral-400">{point.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={150}>
          <div className="mt-6 flex flex-col items-center gap-6 rounded-2xl border border-white/15 bg-white/3 p-7 md:flex-row md:gap-8">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-white text-neutral-900 shadow-sm">
              <Smartphone className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="text-center text-[15px] leading-normal text-neutral-300 md:text-left">
              Workers see every rupee they have earned, in one place. No more chasing payments or writing things in a notebook.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
