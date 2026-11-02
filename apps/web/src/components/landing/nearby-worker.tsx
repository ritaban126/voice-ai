// import { MapPin, Star, Navigation } from 'lucide-react';
// import { featuredWorker } from '@/lib/landing-content';
// import { BookingCard } from './booking-card';
// import { NearbyMap } from './nearby-map';
// import { Reveal } from './reveal';
// import { SectionHeading } from './section-heading';
// import { TrackingTimeline } from './tracking-timeline';

// export function NearbyWorker() {
//   return (
//     <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
//       <Reveal>
//         <SectionHeading
//           eyebrow="Nearest worker"
//           title="The right person, already on the map"
//           body="We auto-pick the closest verified worker for your job and show them travelling to you. Distance, rating, price - all before you confirm."
//         />
//       </Reveal>

//       <div className="mt-14 grid gap-6 md:grid-cols-12">
//         <Reveal className="md:col-span-7">
//           <div className="relative overflow-hidden rounded-3xl border border-ink/10">
//             <NearbyMap />
//             <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-sm shadow-sm backdrop-blur-sm">
//               <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
//               <span className="font-semibold text-ink">{featuredWorker.area}</span>
//             </div>
//             <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-ink px-3.5 py-2 text-sm text-paper">
//               <Navigation className="h-4 w-4 text-marigold-400" aria-hidden="true" />
//               <span>9 min away</span>
//             </div>
//           </div>
//         </Reveal>

//         <Reveal delay={100} className="flex flex-col gap-6 md:col-span-5">
//           <BookingCard worker={featuredWorker} />
//           <TrackingTimeline />
//           <p className="flex items-center gap-2 text-sm text-ink-3">
//             <Star className="h-4 w-4 fill-marigold-400 text-marigold-400" aria-hidden="true" />
//             Rated by {featuredWorker.jobs} homes in your area
//           </p>
//         </Reveal>
//       </div>
//     </section>
//   );
// }







import { MapPin, Star, Navigation } from 'lucide-react';
import { featuredWorker } from '@/lib/landing-content';
import { BookingCard } from './booking-card';
import { NearbyMap } from './nearby-map';
import { Reveal } from './reveal';
import { SectionHeading } from './section-heading';
import { TrackingTimeline } from './tracking-timeline';

export function NearbyWorker() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
      <Reveal>
        <SectionHeading
          eyebrow="Nearest worker"
          title="The right person, already on the map"
          body="We auto-pick the closest verified worker for your job and show them travelling to you. Distance, rating, price - all before you confirm."
        />
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-7">
          <div className="relative overflow-hidden rounded-3xl border border-ink/10">
            <NearbyMap />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-sm shadow-sm backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-[#C2410C]" aria-hidden="true" />
              <span className="font-semibold text-neutral-900">{featuredWorker.area}</span>
            </div>
            <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-sm text-white shadow-md">
              <Navigation className="h-4 w-4 text-amber-400" aria-hidden="true" />
              <span>9 min away</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="flex flex-col gap-6 md:col-span-5">
          <BookingCard worker={featuredWorker} />
          <TrackingTimeline />
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
            Rated by {featuredWorker.jobs} homes in your area
          </p>
        </Reveal>
      </div>
    </section>
  );
}