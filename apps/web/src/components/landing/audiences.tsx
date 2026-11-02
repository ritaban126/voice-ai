// import { Check, ArrowRight } from 'lucide-react';
// import { audiences, brand } from '@/lib/landing-content';
// import { ButtonLink } from './button-link';
// import { PhotoFrame } from './photo-frame';
// import { Reveal } from './reveal';
// import { SectionHeading } from './section-heading';

// type AudienceBlockProps = {
//   variant: 'customer' | 'worker';
// };

// function AudienceBlock({ variant }: AudienceBlockProps) {
//   const data = audiences[variant];
//   const isWorker = variant === 'worker';

//   return (
//     <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
//       <div className={isWorker ? 'md:order-2' : ''}>
//         <PhotoFrame
//           photo={data.photo}
//           sizes="(min-width: 768px) 45vw, 100vw"
//           className="aspect-[4/3] w-full"
//         />
//       </div>
//       <div className={isWorker ? 'md:order-1' : ''}>
//         <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
//           {data.eyebrow}
//         </p>
//         <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl">{data.title}</h3>
//         <p className="mt-4 text-lg leading-[1.5] text-ink-2">{data.body}</p>
//         <ul className="mt-6 space-y-3">
//           {data.points.map((point) => (
//             <li key={point} className="flex items-center gap-3 text-[15px] text-ink">
//               <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-moss-50 text-moss-500">
//                 <Check className="h-3.5 w-3.5" aria-hidden="true" />
//               </span>
//               {point}
//             </li>
//           ))}
//         </ul>
//         <div className="mt-8">
//           <ButtonLink href={brand.signupHref} variant="secondary" icon={ArrowRight}>
//             {data.cta}
//           </ButtonLink>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function Audiences() {
//   return (
//     <section id="for-workers" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
//       <Reveal>
//         <SectionHeading
//           eyebrow="Two ways in"
//           title="Whether you need work done, or want to find work"
//           body="Customers book by voice. Workers find nearby jobs by voice. Both have their own way in."
//         />
//       </Reveal>
//       <div className="mt-16 space-y-24">
//         <Reveal>
//           <AudienceBlock variant="customer" />
//         </Reveal>
//         <Reveal delay={100}>
//           <AudienceBlock variant="worker" />
//         </Reveal>
//       </div>
//     </section>
//   );
// }








import { Check, ArrowRight } from 'lucide-react';
import { audiences, brand } from '@/lib/landing-content';
import { ButtonLink } from './button-link';
import { PhotoFrame } from './photo-frame';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';

type AudienceBlockProps = {
  variant: 'customer' | 'worker';
};

function AudienceBlock({ variant }: AudienceBlockProps) {
  const data = audiences[variant];
  const isWorker = variant === 'worker';

  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
      <div className={isWorker ? 'md:order-2' : ''}>
        <PhotoFrame
          photo={data.photo}
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-4/3 w-full"
        />
      </div>
      <div className={isWorker ? 'md:order-1' : ''}>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#C2410C]">
          {data.eyebrow}
        </p>
        <h3 className="mt-3 font-display text-3xl leading-tight md:text-4xl text-neutral-900">{data.title}</h3>
        <p className="mt-4 text-lg leading-normal text-neutral-600">{data.body}</p>
        <ul className="mt-6 space-y-3">
          {data.points.map((point) => (
            <li key={point} className="flex items-center gap-3 text-[15px] text-neutral-800">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <ButtonLink href={brand.signupHref} variant="secondary" icon={ArrowRight}>
            {data.cta}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function Audiences() {
  return (
    <section id="for-workers" className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Two ways in"
          title="Whether you need work done, or want to find work"
          body="Customers book by voice. Workers find nearby jobs by voice. Both have their own way in."
        />
      </Reveal>
      <div className="mt-16 space-y-24">
        <Reveal>
          <AudienceBlock variant="customer" />
        </Reveal>
        <Reveal delay={100}>
          <AudienceBlock variant="worker" />
        </Reveal>
      </div>
    </section>
  );
}