import { Quote } from 'lucide-react';
import { quotes } from '@/lib/landing-content';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Quotes() {
  return (
    <section className="border-y border-ink/10 bg-[#FDFBF7] px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Real stories"
            title="From homes and workers who use it"
          />
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {quotes.map((item, index) => (
            <Reveal key={item.name} delay={(index % 2) * 100}>
              <figure className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 md:p-8 shadow-sm">
                <Quote className="h-7 w-7 text-[#C2410C]" aria-hidden="true" />
                <blockquote className="mt-4 text-lg leading-normal text-neutral-900">
                  {item.text}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-ink/10 pt-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-50 font-semibold text-emerald-700">
                    {item.initials}
                  </span>
                  <div>
                    <p className="font-semibold leading-tight text-neutral-900">{item.name}</p>
                    <p className="mt-0.5 text-sm text-neutral-500">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
