'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Inbox,
  Briefcase,
  CreditCard,
  Settings as SettingsIcon,
  PlusCircle,
  Bell,
  ChevronDown,
  Volume2,
  VolumeX,
  UserRound,
  Languages,
  Check,
} from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';
import { useRole } from '@/hooks/use-role';
import type { Role } from '@/types';
import { LANGUAGES } from '../../lib/content';
import { employerUser, workerUser } from '../../lib/mock-data';

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
}

const WORKER_NAV: NavItem[] = [
  { href: '/dashboard/worker', label: content.nav.worker.home, icon: Home },
  { href: '/dashboard/worker/offers', label: content.nav.worker.offers, icon: Inbox },
  { href: '/dashboard/worker/orders', label: content.nav.worker.orders, icon: Briefcase },
  { href: '/dashboard/worker/payments', label: content.nav.worker.payments, icon: CreditCard },
  { href: '/dashboard/worker/settings', label: content.nav.worker.settings, icon: SettingsIcon },
];

const EMPLOYER_NAV: NavItem[] = [
  { href: '/dashboard/employer', label: content.nav.employer.home, icon: Home },
  { href: '/dashboard/employer/new-order', label: content.nav.employer.newOrder, icon: PlusCircle },
  { href: '/dashboard/employer/orders', label: content.nav.employer.orders, icon: Briefcase },
  { href: '/dashboard/employer/payments', label: content.nav.employer.payments, icon: CreditCard },
  { href: '/dashboard/employer/settings', label: content.nav.employer.settings, icon: SettingsIcon },
];

export function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const items = role === 'worker' ? WORKER_NAV : EMPLOYER_NAV;

  const isActive = (href: string) =>
    href === `/dashboard/${role}`
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="px-5 pt-6 pb-4">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1.5 px-3 py-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-base font-semibold transition-colors',
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href={`/dashboard/${role}/notifications`}
          className={cn(
            'flex items-center gap-3 rounded-2xl px-3.5 py-3 text-base font-semibold transition-colors',
            pathname.startsWith(`/dashboard/${role}/notifications`)
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent'
          )}
        >
          <Bell className="h-5 w-5" strokeWidth={2} />
          {content.nav.notifications}
        </Link>
      </div>
    </aside>
  );
}

export function BottomTabBar() {
  const { role } = useRole();
  const pathname = usePathname();
  const items = role === 'worker' ? WORKER_NAV : EMPLOYER_NAV;

  const isActive = (href: string) =>
    href === `/dashboard/${role}`
      ? pathname === href
      : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-card/95 backdrop-blur lg:hidden">
      {items.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function usePageTitle(role: Role): string {
  const pathname = usePathname();
  const map: Record<string, string> = {
    [`/dashboard/${role}`]: content.nav[role].home === content.nav.worker.home ? (role === 'worker' ? content.worker.home.greeting(workerUser.name, '', '').split(',')[0] : content.employer.home.greeting(employerUser.name).split(',')[0]) : content.nav[role].home,
  };
  return map[pathname] ?? '';
}

export function TopBar() {
  const { role, setRole, voiceReplies, setVoiceReplies, language, setLanguage } = useRole();
  const pathname = usePathname();
  const router = useRouter();
  const user = role === 'worker' ? workerUser : employerUser;
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [langOpen, setLangOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const langRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pageTitle = React.useMemo(() => {
    const parts = pathname.split('/');
    const last = parts[parts.length - 1] || parts[parts.length - 2];
    const titles: Record<string, string> = {
      worker: content.nav.worker.home,
      employer: content.nav.employer.home,
      offers: content.worker.offers.title,
      orders: content.nav.worker.orders,
      payments: content.nav.worker.payments,
      settings: content.nav.worker.settings,
      notifications: content.notifications.title,
      'new-order': content.nav.employer.newOrder,
    };
    return titles[last] ?? '';
  }, [pathname]);

  const langLabel = LANGUAGES.find((l) => l.id === language)?.native ?? 'English';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:px-8">
      <h1 className="truncate text-lg font-extrabold text-foreground sm:text-xl">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* language chip */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => setLangOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground hover:bg-accent"
          >
            <Languages className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">{langLabel}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lg">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setLanguage(l.id);
                    setLangOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium',
                    language === l.id ? 'bg-accent text-foreground' : 'text-foreground hover:bg-accent/60'
                  )}
                >
                  <span>{l.native}</span>
                  <span className="text-xs text-muted-foreground">{l.label}</span>
                  {language === l.id && <Check className="h-4 w-4 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* notifications */}
        <Link
          href={`/dashboard/${role}/notifications`}
          aria-label={content.topbar.notifications}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground hover:bg-accent"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            2
          </span>
        </Link>

        {/* avatar menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-1.5 pr-3 hover:bg-accent"
            aria-label="Account menu"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.avatarInitials}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-border bg-popover shadow-lg">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </div>
              <div className="p-1.5">
                <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {content.topbar.previewAs}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const nextRole = role === 'worker' ? 'employer' : 'worker';
                    setRole(nextRole);
                    setMenuOpen(false);
                    router.push(`/dashboard/${nextRole}`);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <UserRound className="h-4 w-4 text-primary" />
                  {role === 'worker' ? content.topbar.switchToEmployer : content.topbar.switchToWorker}
                </button>
                <div className="my-1 h-px bg-border" />
                <div className="flex items-center justify-between rounded-xl px-3 py-2">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                    {voiceReplies ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
                    {content.topbar.voiceReplies}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={voiceReplies}
                    onClick={() => setVoiceReplies(!voiceReplies)}
                    className={cn(
                      'relative h-6 w-11 rounded-full transition-colors',
                      voiceReplies ? 'bg-primary' : 'bg-input'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                        voiceReplies ? 'left-5.5' : 'left-0.5'
                      )}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}