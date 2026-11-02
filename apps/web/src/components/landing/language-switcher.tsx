// 'use client';

// import { useState } from 'react';
// import { languageSwitcherOptions } from '@/lib/landing-content';
// import { cn } from '@/lib/utils';

// export function LanguageSwitcher() {
//   const [active, setActive] = useState<string>('en');

//   return (
//     <div
//       role="group"
//       aria-label="Choose language"
//       className="inline-flex items-center rounded-full border border-ink/15 bg-white p-1"
//     >
//       {languageSwitcherOptions.map((option) => {
//         const isActive = active === option.code;
//         return (
//           <button
//             key={option.code}
//             type="button"
//             aria-label={option.name}
//             aria-pressed={isActive}
//             onClick={() => setActive(option.code)}
//             className={cn(
//               'h-8 min-w-9 rounded-full px-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
//               isActive ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-paper-2 hover:text-ink'
//             )}
//           >
//             {option.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }







'use client';

import { useState } from 'react';
import { languageSwitcherOptions } from '@/lib/landing-content';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const [active, setActive] = useState<string>('en');

  return (
    <div
      role="group"
      aria-label="Choose language"
      className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
    >
      {languageSwitcherOptions.map((option) => {
        const isActive = active === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-label={option.name}
            aria-pressed={isActive}
            onClick={() => setActive(option.code)}
            className={cn(
              'h-8 min-w-9 rounded-full px-2.5 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]',
              isActive ? 'bg-[#C2410C] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}