// 'use client';

// import * as React from 'react';
// import { Star } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { cn } from '@/lib/utils';
// import { content } from '../../lib/content';

// interface RateWorkerModalProps {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   workerName: string;
//   onSubmit: (rating: number) => void;
// }

// export function RateWorkerModal({
//   open,
//   onOpenChange,
//   workerName,
//   onSubmit,
// }: RateWorkerModalProps) {
//   const [rating, setRating] = React.useState(0);
//   const [hover, setHover] = React.useState(0);

//   React.useEffect(() => {
//     if (open) {
//       setRating(0);
//       setHover(0);
//     }
//   }, [open]);

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="rounded-3xl sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-extrabold">
//             {content.employer.orders.detail.rateTitle}
//           </DialogTitle>
//           <DialogDescription className="text-base">
//             {workerName} — {content.employer.orders.detail.rateHint}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="mt-4 flex justify-center gap-3">
//           {[1, 2, 3, 4, 5].map((n) => (
//             <button
//               key={n}
//               type="button"
//               onClick={() => setRating(n)}
//               onMouseEnter={() => setHover(n)}
//               onMouseLeave={() => setHover(0)}
//               aria-label={`${n} star`}
//               className="p-1"
//             >
//               <Star
//                 className={cn(
//                   'h-10 w-10 transition-colors',
//                   (hover || rating) >= n
//                     ? 'fill-primary text-primary'
//                     : 'fill-none text-muted-foreground'
//                 )}
//               />
//             </button>
//           ))}
//         </div>

//         <button
//           type="button"
//           disabled={rating === 0}
//           onClick={() => onSubmit(rating)}
//           className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
//         >
//           {content.employer.orders.detail.submitRating}
//         </button>
//       </DialogContent>
//     </Dialog>
//   );
// }







'use client';

import * as React from 'react';
import { Star } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';

interface RateWorkerModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  workerName: string;
  onSubmit: (rating: number) => void;
}

interface RateWorkerModalContentProps {
  workerName: string;
  onSubmit: (rating: number) => void;
}

function RateWorkerModalContent({
  workerName,
  onSubmit,
}: RateWorkerModalContentProps) {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl font-extrabold">
          {content.employer.orders.detail.rateTitle}
        </DialogTitle>
        <DialogDescription className="text-base">
          {workerName} — {content.employer.orders.detail.rateHint}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex justify-center gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star`}
            className="p-1"
          >
            <Star
              className={cn(
                'h-10 w-10 transition-colors',
                (hover || rating) >= n
                  ? 'fill-primary text-primary'
                  : 'fill-none text-muted-foreground'
              )}
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={rating === 0}
        onClick={() => onSubmit(rating)}
        className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {content.employer.orders.detail.submitRating}
      </button>
    </>
  );
}

export function RateWorkerModal({
  open,
  onOpenChange,
  workerName,
  onSubmit,
}: RateWorkerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl sm:max-w-md">
        {open && (
          <RateWorkerModalContent
            key={workerName}
            workerName={workerName}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
