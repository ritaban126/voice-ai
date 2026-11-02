import { bookingModes, longTermPhoto } from '@/lib/landing-content';
import { PhotoFrame } from './photo-frame';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function BookingModes() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="When do you need it?"
          title="Now, tomorrow, or for six months"
          body="A leaking tap cannot wait. A maid for your mother is a longer arrangement. Book for any of these the same way - by speaking."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {bookingModes.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <Reveal key={mode.title} delay={index * 100}>
              <div className="flex h-full flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#C2410C]/10 text-[#C2410C]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
                  {mode.label}
                </p>
                <h3 className="mt-2 font-display text-2xl text-neutral-900">{mode.title}</h3>
                <p className="mt-3 text-[15px] leading-normal text-neutral-600">{mode.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={150}>
        <div className="mt-10 grid items-center gap-8 rounded-3xl border border-ink/10 bg-white p-6 md:grid-cols-2 md:p-8 shadow-sm">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
              Long-term care
            </p>
            <h3 className="mt-3 font-display text-3xl leading-tight text-neutral-900">
              The same maid or aya, every day
            </h3>
            <p className="mt-4 text-[15px] leading-normal text-neutral-600">
              Hire a maid or nurse for a month, six months or longer. One person, the same hours each day. One monthly bill, with a record for both sides.
            </p>
          </div>
          <PhotoFrame
            photo={longTermPhoto}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-4/3 w-full"
          />
        </div>
      </Reveal>
    </section>
  );
}
