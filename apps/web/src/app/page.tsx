import { Audiences } from '@/components/landing/audiences';
import { BookingModes } from '@/components/landing/booking-modes';
import { FinalCtaFooter } from '@/components/landing/final-cta-footer';
import { Hero } from '@/components/landing/hero';
import { HowItWorks } from '@/components/landing/how-it-works';
import { Languages_ } from '@/components/landing/languages-section';
import { NearbyWorker } from '@/components/landing/nearby-worker';
import { Payment } from '@/components/landing/payment';
import { Pricing } from '@/components/landing/pricing';
import { Quotes } from '@/components/landing/quotes';
import { ServicesSection } from '@/components/landing/services-section';
import { SiteHeader } from '@/components/landing/site-header';
import { TrustStrip } from '@/components/landing/trust-strip';

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TrustStrip />
        <ServicesSection />
        <HowItWorks />
        <NearbyWorker />
        <Pricing />
        <BookingModes />
        <Payment />
        <Languages_ />
        <Audiences />
        <Quotes />
        <FinalCtaFooter />
      </main>
    </>
  );
}