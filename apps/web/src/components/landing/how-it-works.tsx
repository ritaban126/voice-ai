import { howItWorks } from '@/lib/landing-content';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { VoiceConversation } from './voice-conversation';

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-ink/10 bg-[#FDFBF7] px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal>
            <SectionHeading
              eyebrow="How it works"
              title="Three steps. No forms."
              body="Booking should take less time than making tea. You speak, we handle the rest."
            />
          </Reveal>

          <ol className="mt-12 space-y-10">
            {howItWorks.map((step, index) => (
              <Reveal key={step.title} delay={index * 100}>
                <li className="flex gap-5">
                  <span className="font-display text-4xl leading-none text-[#C2410C]">
                    0{index + 1}
                  </span>
                  <div className="border-l border-ink/15 pl-5">
                    <h3 className="text-xl font-semibold text-neutral-900">{step.title}</h3>
                    <p className="mt-2 leading-normal text-neutral-600">{step.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal delay={150} className="md:col-span-6 md:col-start-7 md:self-center">
          <VoiceConversation />
        </Reveal>
      </div>
    </section>
  );
}
