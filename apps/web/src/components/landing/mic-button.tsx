// import Link from 'next/link';
// import { Mic } from 'lucide-react';
// import { brand } from '@/lib/landing-content';
// import { cn } from '@/lib/utils';

// const tones = {
//   accent: {
//     ring: 'bg-accent/35',
//     core: 'bg-accent text-white group-hover:bg-accent-700',
//   },
//   light: {
//     ring: 'bg-white/40',
//     core: 'bg-white text-accent group-hover:bg-paper',
//   },
// } as const;

// type MicButtonProps = {
//   tone?: keyof typeof tones;
//   className?: string;
// };

// export function MicButton({ tone = 'accent', className }: MicButtonProps) {
//   const palette = tones[tone];
//   return (
//     <Link
//       href={brand.signupHref}
//       aria-label="Start voice booking"
//       className={cn(
//         'group relative grid h-24 w-24 shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-paper',
//         className
//       )}
//     >
//       <span
//         aria-hidden="true"
//         className={cn('mic-ring absolute inset-0 rounded-full', palette.ring)}
//       />
//       <span
//         aria-hidden="true"
//         className={cn(
//           'mic-ring mic-ring-delay absolute inset-0 rounded-full',
//           palette.ring
//         )}
//       />
//       <span
//         className={cn(
//           'relative grid h-20 w-20 place-items-center rounded-full transition-colors duration-200',
//           palette.core
//         )}
//       >
//         <Mic className="h-8 w-8" aria-hidden="true" />
//       </span>
//     </Link>
//   );
// }









import Link from 'next/link';
import { Mic } from 'lucide-react';
import { brand } from '@/lib/landing-content';
import { cn } from '@/lib/utils';

const tones = {
  accent: {
    ring: 'bg-[#C2410C]/20', // Soft terracotta ring tint
    core: 'bg-[#C2410C] text-white group-hover:bg-[#9A3412]', // Rich terracotta core with darker hover
  },
  light: {
    ring: 'bg-[#C2410C]/10',
    core: 'bg-[#C2410C] text-white group-hover:bg-[#9A3412]',
  },
} as const;

type MicButtonProps = {
  tone?: keyof typeof tones;
  className?: string;
};

export function MicButton({
  tone = 'accent',
  className,
}: MicButtonProps) {
  const palette = tones[tone];

  return (
    <Link
      href={brand.signupHref}
      aria-label="Start voice booking"
      className={cn(
        'group relative grid h-24 w-24 shrink-0 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-4 focus-visible:ring-offset-paper',
        className
      )}
    >
      {/* Animated rings */}
      <span
        aria-hidden="true"
        className={cn(
          'mic-ring absolute inset-0 rounded-full',
          palette.ring
        )}
      />

      <span
        aria-hidden="true"
        className={cn(
          'mic-ring mic-ring-delay absolute inset-0 rounded-full',
          palette.ring
        )}
      />

      {/* Microphone button core */}
      <span
        className={cn(
          'relative grid h-20 w-20 place-items-center rounded-full shadow-lg shadow-orange-900/10 transition-all duration-200 group-hover:scale-105',
          palette.core
        )}
      >
        <Mic className="h-8 w-8" strokeWidth={2.2} aria-hidden="true" />
      </span>
    </Link>
  );
}
