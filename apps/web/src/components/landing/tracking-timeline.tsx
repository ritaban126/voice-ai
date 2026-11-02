// import { trackingSteps } from '@/lib/landing-content';
// import { cn } from '@/lib/utils';

// type StepStatus = 'done' | 'current' | 'upcoming';

// export function TrackingTimeline() {
//   const currentIndex = trackingSteps.findIndex((step) => !step.done);
//   const lastIndex = trackingSteps.length - 1;

//   return (
//     <div className="rounded-2xl border border-ink/10 bg-white p-6">
//       <div className="flex items-center justify-between">
//         <p className="font-semibold">Ravi is on the way</p>
//         <span className="rounded-full bg-moss-50 px-3 py-1 text-xs font-semibold text-moss-500">
//           Live
//         </span>
//       </div>

//       <ol className="mt-6" aria-label="Worker travel progress">
//         {trackingSteps.map((step, index) => {
//           const status: StepStatus = step.done
//             ? 'done'
//             : index === currentIndex
//               ? 'current'
//               : 'upcoming';
//           return (
//             <li key={step.label} className="flex gap-4">
//               <div className="flex flex-col items-center">
//                 <span
//                   aria-hidden="true"
//                   className={cn(
//                     'mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2',
//                     status === 'done' && 'border-accent bg-accent',
//                     status === 'current' && 'border-accent bg-white ring-4 ring-accent-50',
//                     status === 'upcoming' && 'border-ink/20 bg-white'
//                   )}
//                 />
//                 {index < lastIndex && <span className="my-1 w-px flex-1 bg-ink/15" aria-hidden="true" />}
//               </div>
//               <div className={cn('pb-6', index === lastIndex && 'pb-0')}>
//                 <p
//                   className={cn(
//                     'text-[15px] leading-tight',
//                     status === 'upcoming' ? 'text-ink-3' : 'font-semibold text-ink'
//                   )}
//                 >
//                   {step.label}
//                 </p>
//                 {step.time && <p className="mt-1 text-sm text-ink-3">{step.time}</p>}
//               </div>
//             </li>
//           );
//         })}
//       </ol>
//     </div>
//   );
// }






import { trackingSteps } from '@/lib/landing-content';
import { cn } from '@/lib/utils';

type StepStatus = 'done' | 'current' | 'upcoming';

export function TrackingTimeline() {
  const currentIndex = trackingSteps.findIndex((step) => !step.done);
  const lastIndex = trackingSteps.length - 1;

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-neutral-900">Ravi is on the way</p>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>

      <ol className="mt-6" aria-label="Worker travel progress">
        {trackingSteps.map((step, index) => {
          const status: StepStatus = step.done
            ? 'done'
            : index === currentIndex
              ? 'current'
              : 'upcoming';
          return (
            <li key={step.label} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors',
                    status === 'done' && 'border-[#C2410C] bg-[#C2410C]',
                    status === 'current' && 'border-[#C2410C] bg-white ring-4 ring-[#C2410C]/20',
                    status === 'upcoming' && 'border-neutral-300 bg-white'
                  )}
                />
                {index < lastIndex && (
                  <span className="my-1 w-px flex-1 bg-neutral-200" aria-hidden="true" />
                )}
              </div>
              <div className={cn('pb-6', index === lastIndex && 'pb-0')}>
                <p
                  className={cn(
                    'text-[15px] leading-tight',
                    status === 'upcoming' ? 'text-neutral-400' : 'font-semibold text-neutral-900'
                  )}
                >
                  {step.label}
                </p>
                {step.time && <p className="mt-1 text-sm text-neutral-500">{step.time}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}