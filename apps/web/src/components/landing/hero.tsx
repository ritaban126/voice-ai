import { AudioLines } from 'lucide-react';
import { heroContent, featuredWorker, brand } from '@/lib/landing-content';
import { BookingCard } from './booking-card';
import { ButtonLink } from './button-link';
import { MicButton } from './mic-button';
import { PhotoFrame } from './photo-frame';
import { Reveal } from './reveal';

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-16 px-5 pb-24 pt-12 md:grid-cols-12 md:gap-10 md:px-8 md:pb-32 md:pt-20">
      <Reveal className="md:col-span-7 md:pt-4">
        {/* Fixed background tint for eyebrow badge */}
        <p className="inline-flex items-center gap-2 rounded-full bg-[#C2410C]/10 px-3.5 py-1.5 text-sm font-semibold text-[#C2410C]">
          <span className="h-2 w-2 rounded-full bg-[#C2410C]" aria-hidden="true" />
          {heroContent.eyebrow}
        </p>

        <h1 className="mt-6 font-display text-6xl leading-[1.02] tracking-[-0.02em] md:text-8xl">
          Bolo,
          <br />
          <span className="text-[#C2410C]">kaam pao.</span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-normal text-ink-2 md:text-xl">
          {heroContent.subhead}
        </p>

        <div className="mt-10 flex flex-col gap-6 rounded-3xl border border-ink/10 bg-white p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6">
          <MicButton />
          <div>
            <p className="text-lg font-semibold">Tap and speak</p>
            <p className="mt-1 text-sm leading-normal text-ink-3">{heroContent.micPrompt}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Things people say">
              {heroContent.examples.map((example) => (
                <li
                  key={example}
                  // Fixed background tint for speech example pills
                  className="rounded-full bg-[#C2410C]/5 px-3 py-1.5 text-sm font-medium text-[#C2410C]"
                >
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href={brand.signupHref} variant="secondary" icon={AudioLines}>
            {heroContent.primaryCta}
          </ButtonLink>
          <a
            href="#how-it-works"
            className="text-[15px] font-semibold text-ink underline decoration-[#C2410C] decoration-2 underline-offset-8 hover:text-[#C2410C]"
          >
            {heroContent.secondaryCta}
          </a>
        </div>
      </Reveal>

      <Reveal delay={150} className="relative md:col-span-5 md:mt-6">
        <PhotoFrame
          photo={heroContent.photo}
          sizes="(min-width: 768px) 40vw, 100vw"
          priority
          className="aspect-4/5 w-full"
        />
        <p className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white shadow-md">
          <AudioLines className="h-4 w-4 text-amber-400" aria-hidden="true" />
          Listening in Hindi
        </p>
        <div className="relative z-10 -mt-24 ml-4 mr-0 md:-mt-28 md:-ml-16 md:mr-0 md:w-[88%]">
          <BookingCard worker={featuredWorker} />
        </div>
      </Reveal>
    </section>
  );
}
