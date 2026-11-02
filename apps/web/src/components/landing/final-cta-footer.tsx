import { AudioLines, ArrowRight } from 'lucide-react';
import { finalCta, brand, footerLinks } from "../../lib/landing-content";
import { ButtonLink } from './button-link';
import { MicButton } from './mic-button';
import { Reveal } from './reveal';
import { Logo } from './logo';

export function FinalCtaFooter() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
        <Reveal>
          <div className="flex flex-col items-center gap-8 rounded-3xl border border-ink/10 bg-white px-6 py-16 text-center md:px-12 md:py-20 shadow-sm">
            <MicButton />
            <h2 className="max-w-2xl font-display text-4xl leading-[1.1] md:text-5xl text-neutral-900">
              {finalCta.title}
            </h2>
            <p className="max-w-xl text-lg leading-normal text-neutral-600">{finalCta.body}</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink 
                href={brand.signupHref} 
                icon={ArrowRight}
                className="bg-[#C2410C] hover:bg-[#9A3412] text-white"
              >
                {finalCta.cta}
              </ButtonLink>
              <ButtonLink 
                href={brand.loginHref} 
                variant="secondary"
                className="border-neutral-200 text-neutral-900 hover:bg-neutral-50"
              >
                Log in
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="bg-neutral-900 text-white">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="**:text-white">
                <Logo />
              </div>
              <p className="mt-4 flex items-center gap-2 text-[15px] text-neutral-300">
                <AudioLines className="h-4 w-4 text-amber-400" aria-hidden="true" />
                Bolo, kaam pao.
              </p>
              <p className="mt-3 text-sm leading-normal text-neutral-400">
                Voice-first booking for trusted, verified home-service workers across India.
              </p>
            </div>

            <nav aria-label="Footer" className="flex flex-wrap gap-x-10 gap-y-3">
              {footerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[15px] font-semibold text-neutral-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 KaamBol. Made in India.</p>
            <p className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Hindi · Bengali · Tamil · English
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
