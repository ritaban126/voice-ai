// import Link from 'next/link';
// import { LogIn } from 'lucide-react';
// import { brand, navLinks } from '@/lib/landing-content';
// import { ButtonLink } from './button-link';
// import { LanguageSwitcher } from './language-switcher';
// import { Logo } from './logo';

// export function SiteHeader() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper">
//       <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
//         <Link
//           href="/"
//           aria-label={`${brand.name} home`}
//           className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
//         >
//           <Logo />
//         </Link>

//         <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className="text-[15px] font-semibold text-ink-2 transition-colors duration-200 hover:text-ink"
//             >
//               {link.label}
//             </a>
//           ))}
//         </nav>

//         <div className="flex items-center gap-3">
//           <div className="hidden lg:block">
//             <LanguageSwitcher />
//           </div>
//           <ButtonLink
//             href={brand.loginHref}
//             variant="secondary"
//             icon={LogIn}
//             className="h-10 px-4 text-sm"
//           >
//             Log in
//           </ButtonLink>
//           <ButtonLink href={brand.signupHref} className="h-10 px-5 text-sm">
//             <span className="sm:hidden">Book</span>
//             <span className="hidden sm:inline">Book by voice</span>
//           </ButtonLink>
//         </div>
//       </div>

//       <nav
//         aria-label="Sections"
//         className="flex gap-6 overflow-x-auto whitespace-nowrap border-t border-ink/10 px-5 py-3 md:hidden"
//       >
//         {navLinks.map((link) => (
//           <a
//             key={link.href}
//             href={link.href}
//             className="text-sm font-semibold text-ink-2 hover:text-ink"
//           >
//             {link.label}
//           </a>
//         ))}
//       </nav>
//     </header>
//   );
// }







// import Link from 'next/link';
// import { LogIn } from 'lucide-react';
// import { brand, navLinks } from '@/lib/landing-content';
// import { ButtonLink } from './button-link';
// import { LanguageSwitcher } from './language-switcher';
// import { Logo } from './logo';

// export function SiteHeader() {
//   return (
//     <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#FDFBF7]/95 backdrop-blur-md">
//       <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
//         <Link
//           href="/"
//           aria-label={`${brand.name} home`}
//           className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
//         >
//           <Logo />
//         </Link>

//         <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
//           {navLinks.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               className="text-[15px] font-semibold text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
//             >
//               {link.label}
//             </a>
//           ))}
//         </nav>

//         <div className="flex items-center gap-3">
//           <div className="hidden lg:block">
//             <LanguageSwitcher />
//           </div>
//           <ButtonLink
//             href={brand.loginHref}
//             variant="secondary"
//             icon={LogIn}
//             className="h-10 px-4 text-sm border-neutral-300 text-neutral-900 hover:bg-neutral-100"
//           >
//             Log in
//           </ButtonLink>
//           <ButtonLink 
//             href={brand.signupHref} 
//             className="h-10 px-5 text-sm bg-[#C2410C] hover:bg-[#9A3412] text-white"
//           >
//             <span className="sm:hidden">Book</span>
//             <span className="hidden sm:inline">Book by voice</span>
//           </ButtonLink>
//         </div>
//       </div>

//       <nav
//         aria-label="Sections"
//         className="flex gap-6 overflow-x-auto whitespace-nowrap border-t border-ink/10 px-5 py-3 md:hidden bg-[#FDFBF7]"
//       >
//         {navLinks.map((link) => (
//           <a
//             key={link.href}
//             href={link.href}
//             className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
//           >
//             {link.label}
//           </a>
//         ))}
//       </nav>
//     </header>
//   );
// }







// final siteheader deisgn with route 
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import { brand, navLinks } from '@/lib/landing-content';
import { BookServiceButton } from '@/components/auth/AuthModal';
import { LanguageSwitcher } from './language-switcher';
import { Logo } from './logo';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-[#FDFBF7]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:h-20 md:px-8">
        <Link
          href="/"
          aria-label={`${brand.name} home`}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-neutral-600 transition-colors duration-200 hover:text-neutral-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher />
          </div>

          <BookServiceButton className="inline-flex h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C]">
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Log in
          </BookServiceButton>

          <BookServiceButton className="inline-flex h-10 items-center rounded-full bg-[#C2410C] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#9A3412] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C2410C] focus-visible:ring-offset-2">
            <span className="sm:hidden">Book</span>
            <span className="hidden sm:inline">Book by voice</span>
          </BookServiceButton>
        </div>
      </div>

      <nav
        aria-label="Sections"
        className="flex gap-6 overflow-x-auto whitespace-nowrap border-t border-ink/10 px-5 py-3 md:hidden bg-[#FDFBF7]"
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}