import { IndianRupee, BadgeCheck, ClipboardCheck } from 'lucide-react';
import { inspectionSteps, smallJobPrices } from '@/lib/landing-content';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Pricing() {
  return (
    <section
      id="pricing"
      className="border-y border-ink/10 bg-[#FDFBF7] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Pricing"
            title="Small job, small bill. No surprises."
            body="You see the price before you book. For jobs that need a look first, the worker visits for a small fee and sends a quote you approve."
          />
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-5">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 md:p-8 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
                <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                Inspection first
              </p>
              <ol className="mt-6 space-y-8">
                {inspectionSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="font-display text-2xl leading-none text-[#C2410C]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
                      <p className="mt-1.5 text-[15px] leading-normal text-neutral-600">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-[#C2410C]/10 px-5 py-4">
                <BadgeCheck className="h-5 w-5 shrink-0 text-[#C2410C]" aria-hidden="true" />
                <p className="text-sm font-semibold text-[#C2410C]">
                  The ₹99 visit fee is taken off the final bill.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="md:col-span-7">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 md:p-8 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
                <IndianRupee className="h-4 w-4" aria-hidden="true" />
                Small jobs, fixed prices
              </p>
              <p className="mt-3 text-[15px] leading-normal text-neutral-600">
                These are starting prices for common small jobs. The final price is shown before you confirm.
              </p>

              <ul className="mt-6 divide-y divide-ink/10">
                {smallJobPrices.map((item) => (
                  <li
                    key={item.job}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <span className="text-[15px] text-neutral-700">{item.job}</span>
                    <span className="font-display text-xl text-neutral-900">{item.price}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-neutral-500">
                Bigger jobs like full-room painting or a month of maid service are priced per job or per month, shown before you book.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
