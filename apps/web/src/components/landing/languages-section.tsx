import { Languages, Globe } from 'lucide-react';
import { languageSamples } from '@/lib/landing-content';
import { LanguageSwitcher } from './language-switcher';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

export function Languages_() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="grid gap-16 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-5">
          <Reveal>
            <SectionHeading
              eyebrow="Languages"
              title="Speak the way you actually speak"
              body="Hindi, Bengali, Tamil and English. Mix them mid-sentence if that is how you talk - the app understands."
            />
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-8 flex items-center gap-3">
              <Languages className="h-5 w-5 text-[#C2410C]" aria-hidden="true" />
              <LanguageSwitcher />
            </div>
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <ul className="grid gap-4 sm:grid-cols-2">
            {languageSamples.map((sample, index) => (
              <Reveal key={sample.code} delay={index * 80}>
                <li className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-neutral-900">{sample.language}</p>
                    <p className="text-lg font-medium text-[#C2410C]">{sample.native}</p>
                  </div>
                  <p className="mt-4 text-[15px] leading-normal text-neutral-800">{sample.phrase}</p>
                  <p className="mt-2 text-sm text-neutral-500">{sample.meaning}</p>
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={200}>
            <p className="mt-6 flex items-center gap-2 text-sm text-neutral-600">
              <Globe className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
              More languages coming. The mic works even when you mix two in one sentence.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
