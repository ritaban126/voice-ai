'use client';

import * as React from 'react';
import {
  Wrench,
  Wallet,
  Clock,
  MapPin,
  QrCode,
  Volume2,
  Languages,
  Mic,
  User,
  Check,
} from 'lucide-react';
import { StepperInput } from '@/components/ui/stepper-input';
import { ServiceChip } from '@/components/ui/service-chip';
import { VoiceCard } from '@/components/voice/voice-card';
import { TranscriptChip } from '@/components/voice/transcript-chip';
import { MapView } from '@/components/map/map-view';
import { useVoice } from '@/hooks/use-voice';
import { useRole } from '@/hooks/use-role';
import { content, SERVICE_META, LANGUAGES } from '@/lib/content';
import { rupees } from '@/lib/format';
import type { MapMarker } from '@/types';
import { workerUser, workerSkillChips } from '@/lib/mock-data';

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

export default function WorkerSettingsPage() {
  const { voiceReplies, setVoiceReplies, language, setLanguage } = useRole();
  const [visitCharge, setVisitCharge] = React.useState(workerUser.visitCharge);
  const [dailyRate, setDailyRate] = React.useState(workerUser.dailyRate ?? 600);
  const [radius, setRadius] = React.useState(workerUser.serviceRadiusKm);
  const [available, setAvailable] = React.useState(workerUser.available);
  const voice = useVoice();

  const markers: MapMarker[] = [
    { id: 'home', label: 'Home', x: 50, y: 52, home: true },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-extrabold text-foreground">{content.worker.settings.title}</h1>

      {/* profile header */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
            {workerUser.avatarInitials}
          </span>
          <div>
            <p className="text-xl font-extrabold text-foreground">{workerUser.name}</p>
            <p className="text-sm text-muted-foreground">{workerUser.area}</p>
            <p className="text-sm font-medium text-primary">
              {workerUser.rating} ★ · {workerUser.ratingCount} {content.common.ratings}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">
            {content.worker.settings.skills}
          </p>
          <div className="flex flex-wrap gap-2">
            {workerSkillChips.map((s) => (
              <ServiceChip key={s} skill={s} compact active />
            ))}
          </div>
        </div>
      </section>

      <p className="text-xs font-medium text-muted-foreground">{content.worker.settings.applyNote}</p>

      {/* rate steppers */}
      <section className="space-y-3">
        <div>
          <Row icon={<Wallet className="h-5 w-5" />} label={content.worker.settings.visitCharge}>
            <StepperInput value={visitCharge} onChange={setVisitCharge} step={10} min={0} max={500} />
          </Row>
          <p className="mt-1 px-1 text-xs text-muted-foreground">
            {content.worker.settings.range.replace('{min}', '0').replace('{max}', '500')} · {content.worker.settings.step.replace('{step}', '10')}
          </p>
        </div>
        <div>
          <Row icon={<Wrench className="h-5 w-5" />} label={content.worker.settings.dailyRate}>
            <StepperInput value={dailyRate} onChange={setDailyRate} step={50} min={100} max={3000} />
          </Row>
          <p className="mt-1 px-1 text-xs text-muted-foreground">
            {content.worker.settings.range.replace('{min}', '100').replace('{max}', '3000')} · {content.worker.settings.step.replace('{step}', '50')}
          </p>
        </div>
        <div>
          <Row icon={<MapPin className="h-5 w-5" />} label={content.worker.settings.serviceRadius}>
            <StepperInput
              value={radius}
              onChange={setRadius}
              step={1}
              min={1}
              max={25}
              prefix=""
            />
          </Row>
        </div>
      </section>

      {/* availability + working hours */}
      <section className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
              <Check className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold text-foreground">
              {content.worker.settings.availability}
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={available}
            onClick={() => setAvailable((v) => !v)}
            className={`relative h-7 w-12 rounded-full transition-colors ${available ? 'bg-primary' : 'bg-input'}`}
          >
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${available ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
        <Row icon={<Clock className="h-5 w-5" />} label={content.worker.settings.workingHours}>
          <span className="text-base font-semibold text-foreground">{workerUser.workingHours}</span>
        </Row>
      </section>

      {/* home location */}
      <section className="space-y-2">
        <p className="text-sm font-semibold text-foreground">{content.worker.settings.homeLocation}</p>
        <MapView markers={markers} className="min-h-45!" />
        <button
          type="button"
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card text-base font-bold text-primary hover:bg-accent"
        >
          <MapPin className="h-5 w-5" />
          {content.worker.settings.useCurrent}
        </button>
      </section>

      {/* UPI ID */}
      <Row icon={<QrCode className="h-5 w-5" />} label={content.worker.settings.upiId}>
        <span className="rounded-full bg-secondary px-3 py-1.5 text-sm font-semibold text-foreground">
          {workerUser.upiId}
        </span>
      </Row>

      {/* voice replies */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
            <Volume2 className="h-5 w-5" />
          </span>
          <span className="text-base font-semibold text-foreground">
            {content.worker.settings.voiceReplies}
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

      {/* language */}
      <Row icon={<Languages className="h-5 w-5" />} label={content.worker.settings.language}>
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

      {/* voice commands */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary">
            <Mic className="h-5 w-5" />
          </span>
          <div>
            <p className="text-base font-semibold text-foreground">
              {content.worker.settings.voiceCommands}
            </p>
            <p className="text-xs text-muted-foreground">
              {content.worker.settings.voiceCmdHint}
            </p>
          </div>
        </div>
        <VoiceCard
          state={voice}
          hint={content.worker.settings.voiceCmdHint}
          onMicClick={() =>
            voice.start('Make my rate 150', 'Done, your rate is now Rs 150.', { speaking: true })
          }
          onReplay={() => voice.setStatus('speaking')}
          large={false}
        />
        {voice.transcript && (
          <div className="mt-3">
            <TranscriptChip transcript={voice.transcript} onSayAgain={voice.reset} />
          </div>
        )}
      </section>
    </div>
  );
}