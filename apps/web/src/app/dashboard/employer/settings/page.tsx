'use client';

import * as React from 'react';
import { MapPin, Languages, Volume2, Phone } from 'lucide-react';
import { MapView } from '../../../../components/map/map-view';
import { useRole } from '@/hooks/use-role';
import { content, LANGUAGES } from '@/lib/content';
import type { MapMarker } from '@/types';
import { employerUser } from '@/lib/mock-data';

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary">
          {icon}
        </span>
        <span className="text-base font-semibold text-foreground">{label}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function EmployerSettingsPage() {
  const { voiceReplies, setVoiceReplies, language, setLanguage } = useRole();
  const markers: MapMarker[] = [
    { id: 'home', label: 'Home', x: 50, y: 52, home: true },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold text-foreground">{content.employer.settings.title}</h1>

      {/* home address */}
      <section className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{content.employer.settings.homeAddress}</p>
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-base font-bold text-foreground">{employerUser.landmark}</p>
          <p className="text-sm text-muted-foreground">{employerUser.area}</p>
        </div>
        <MapView markers={markers} className="min-h-45!" />
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-base font-bold text-primary hover:bg-accent"
        >
          <MapPin className="h-5 w-5" />
          {content.employer.settings.useCurrent}
        </button>
      </section>

      {/* phone */}
      <Row icon={<Phone className="h-5 w-5" />} label={content.employer.settings.phone}>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
          {employerUser.phone}
        </span>
      </Row>

      {/* language */}
      <Row icon={<Languages className="h-5 w-5" />} label={content.employer.settings.language}>
        <div className="flex gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setLanguage(l.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                language === l.id
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card text-foreground hover:bg-accent'
              }`}
            >
              {l.native}
            </button>
          ))}
        </div>
      </Row>

      {/* voice replies */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
            <Volume2 className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-foreground">
            {content.employer.settings.voiceReplies}
          </span>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={voiceReplies}
          onClick={() => setVoiceReplies(!voiceReplies)}
          className={`relative h-7 w-12 rounded-full transition-colors ${voiceReplies ? 'bg-primary' : 'bg-input'}`}
        >
          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${voiceReplies ? 'left-6' : 'left-1'}`} />
        </button>
      </div>
    </div>
  );
}