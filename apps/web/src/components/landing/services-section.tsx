import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services, type Service } from '@/lib/landing-content';
import { cn } from '@/lib/utils';
import { PhotoFrame } from './photo-frame';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

type ServiceCardProps = {
  service: Service;
  featured?: boolean;
  className?: string;
};

export function ServiceCard({ service, featured = false, className }: ServiceCardProps) {
  const Icon = service.icon;
  return (
    <Link
      href="/signup"
      aria-label={`Book ${service.name}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        className
      )}
    >
      <div className="relative">
        <PhotoFrame
          photo={service.photo}
          sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw'}
          className={cn('rounded-none', featured ? 'aspect-16/10' : 'aspect-4/3')}
        />
        <span className="absolute -bottom-5 left-5 grid h-11 w-11 place-items-center rounded-xl border border-ink/10 bg-white text-[#C2410C]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-9">
        <h3 className={cn('font-display leading-tight', featured ? 'text-3xl' : 'text-xl')}>
          {service.name}
        </h3>
        <p className="mt-2 text-sm leading-normal text-ink-2">{service.blurb}</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/10 pt-4">
          <p className="text-sm font-semibold">{service.startingPrice}</p>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-[#C2410C]">
            Book
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ServicesSection() {
  const [featuredOne, featuredTwo, ...compact] = services;

  return (
    <section id="services" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <SectionHeading
            eyebrow="Services"
            title="Eight jobs, one sentence away"
            body="Say the job out loud, or tap a category. Every worker is identity-checked and rated by the homes they have served."
          />
        </Reveal>
        <Reveal delay={100}>
          <p className="max-w-xs text-sm leading-normal text-ink-3">
            Starting prices are shown here. The exact price appears before you confirm.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-6">
        {[featuredOne, featuredTwo].map((service, index) => (
          <Reveal key={service.id} delay={index * 80} className="sm:col-span-2 md:col-span-3">
            <ServiceCard service={service} featured />
          </Reveal>
        ))}
        {compact.map((service, index) => (
          <Reveal key={service.id} delay={(index % 3) * 80} className="md:col-span-2">
            <ServiceCard service={service} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
