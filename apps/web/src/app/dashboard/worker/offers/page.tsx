// 'use client';

// import * as React from 'react';
// import { Inbox } from 'lucide-react';
// import { OfferCard } from '@/components/worker/offer-card';
// import { EmptyState } from '../../../../components/ui/empty-state';
// import { ListSkeleton } from '../../../../components/ui/skeleton copy';
// import { ErrorState } from '../../../../components/ui/error-state';
// import { content } from '@/lib/content';
// import type { Offer } from '@/types';
// import { mockWorkerOffers } from '@/lib/mock-data';

// export default function WorkerOffersPage() {
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(false);
//   const [offers, setOffers] = React.useState<Offer[]>([]);

//   const load = () => {
//     setLoading(true);
//     setError(false);
//     setTimeout(() => {
//       setOffers(mockWorkerOffers);
//       setLoading(false);
//     }, 600);
//   };

//   React.useEffect(() => {
//     load();
//   }, []);

//   const handleAccept = (id: string) =>
//     setOffers((prev) => prev.filter((o) => o.id !== id));
//   const handleSkip = (id: string) =>
//     setOffers((prev) => prev.filter((o) => o.id !== id));

//   return (
//     <div className="mx-auto max-w-2xl space-y-4">
//       <h1 className="text-2xl font-extrabold text-foreground">{content.worker.offers.title}</h1>

//       {loading && <ListSkeleton count={3} />}
//       {error && <ErrorState onRetry={load} />}
//       {!loading && !error && offers.length === 0 && (
//         <EmptyState
//           icon={Inbox}
//           title={content.worker.offers.emptyTitle}
//           body={content.worker.offers.empty}
//         />
//       )}
//       {!loading && !error && offers.length > 0 && (
//         <div className="space-y-4">
//           {offers.map((offer, i) => (
//             <OfferCard
//               key={offer.id}
//               offer={offer}
//               highlighted={i === 0}
//               onAccept={() => handleAccept(offer.id)}
//               onSkip={() => handleSkip(offer.id)}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }








'use client';

import * as React from 'react';
import { Inbox } from 'lucide-react';
import { OfferCard } from '@/components/worker/offer-card';
import { EmptyState } from '../../../../components/ui/empty-state';
import { ListSkeleton } from '../../../../components/ui/skeleton copy';
import { ErrorState } from '../../../../components/ui/error-state';
import { content } from '@/lib/content';
import type { Offer } from '@/types';
import { mockWorkerOffers } from '@/lib/mock-data';


function OffersList() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [offers, setOffers] = React.useState<Offer[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setOffers(mockWorkerOffers);
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const load = () => {
    setError(false);
    setLoading(true);

    const timer = setTimeout(() => {
      setOffers(mockWorkerOffers);
      setLoading(false);
    }, 600);

    return timer;
  };

  const handleAccept = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSkip = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <>
      {loading && <ListSkeleton count={3} />}

      {error && <ErrorState onRetry={load} />}

      {!loading && !error && offers.length === 0 && (
        <EmptyState
          icon={Inbox}
          title={content.worker.offers.emptyTitle}
          body={content.worker.offers.empty}
        />
      )}

      {!loading && !error && offers.length > 0 && (
        <div className="space-y-4">
          {offers.map((offer, i) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              highlighted={i === 0}
              onAccept={() => handleAccept(offer.id)}
              onSkip={() => handleSkip(offer.id)}
            />
          ))}
        </div>
      )}
    </>
  );
}


export default function WorkerOffersPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-foreground">
        {content.worker.offers.title}
      </h1>

      <OffersList />
    </div>
  );
}
