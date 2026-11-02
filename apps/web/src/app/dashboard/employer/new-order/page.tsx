'use client';

import * as React from 'react';
import { Zap, CalendarClock, Users } from 'lucide-react';
import { VoiceCard } from '@/components/voice/voice-card';
import { TranscriptChip } from '@/components/voice/transcript-chip';
import { AiMessage } from '@/components/voice/ai-message';
import { LoadingMessage } from '@/components/voice/loading-message';
import { WorkerCard } from '@/components/employer/worker-card';
import { StepperInput } from '@/components/ui/stepper-input';
import { useVoice } from '@/hooks/use-voice';
import { useRole } from '@/hooks/use-role';
import { content } from '@/lib/content';
import { rupees } from '@/lib/format';
import type { When } from '@/types';
import { mockMonthlyWorkers, monthlySalaries } from '@/lib/mock-data';

const WHEN_CHIPS: { key: When; label: string; hint: string; icon: typeof Zap }[] = [
  { key: 'now', label: content.employer.newOrder.whenNow, hint: content.employer.newOrder.whenNowHint, icon: Zap },
  { key: 'tomorrow', label: content.employer.newOrder.whenTomorrow, hint: content.employer.newOrder.whenTomorrowHint, icon: CalendarClock },
  { key: 'monthly', label: content.employer.newOrder.whenMonthly, hint: content.employer.newOrder.whenMonthlyHint, icon: Users },
];

export default function EmployerNewOrderPage() {
  const { voiceReplies } = useRole();
  const voice = useVoice();
  const [when, setWhen] = React.useState<When>('monthly');
  const [months, setMonths] = React.useState(1);
  const [stage, setStage] = React.useState<'idle' | 'listening' | 'results'>('idle');

  const startFlow = () => {
    voice.start('I need a maid for 3 months', 'Looking for maids near you...', { speaking: false });
    setStage('listening');
    setTimeout(() => setStage('results'), 4500);
  };

  const selectedSalary = monthlySalaries['m1'] ?? 6500;
  const totalSalary = selectedSalary * months;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-extrabold text-foreground">{content.employer.newOrder.title}</h1>

      {/* when chips */}
      <section className="grid grid-cols-3 gap-3">
        {WHEN_CHIPS.map((chip) => {
          const active = when === chip.key;
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => setWhen(chip.key)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-4 text-center transition-colors ${
                active ? 'border-primary bg-accent' : 'border-border bg-card hover:bg-accent/50'
              }`}
            >
              <chip.icon className={`h-6 w-6 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-base font-bold text-foreground">{chip.label}</span>
              <span className="text-[11px] text-muted-foreground">{chip.hint}</span>
            </button>
          );
        })}
      </section>

      {/* voice */}
      <section>
        <VoiceCard
          state={voice}
          hint={content.voice.micHintEmployer}
          onMicClick={startFlow}
          onReplay={() => voice.setStatus('speaking')}
          muted={!voiceReplies}
        />
        {stage !== 'idle' && voice.transcript && (
          <div className="mt-4 space-y-3">
            <TranscriptChip transcript={voice.transcript} onSayAgain={() => { voice.reset(); setStage('idle'); }} />
            {voice.aiReply && (
              <AiMessage message={voice.aiReply} onReplay={() => voice.setStatus('speaking')} muted={!voiceReplies} />
            )}
          </div>
        )}
        {stage === 'listening' && (
          <div className="mt-4">
            <LoadingMessage text="Please wait, I am looking for maids near you..." />
          </div>
        )}
      </section>

      {/* monthly: worker cards + hire summary */}
      {when === 'monthly' && stage === 'results' && (
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {mockMonthlyWorkers.map((w) => (
              <WorkerCard
                key={w.id}
                worker={w}
                monthlySalary={monthlySalaries[w.id]}
                selected={w.id === 'm1'}
                onChoose={() => {}}
                actionLabel={content.employer.newOrder.hire}
              />
            ))}
          </div>

          <div className="rounded-3xl border border-primary/30 bg-card p-5 ring-2 ring-primary/15">
            <h3 className="text-lg font-bold text-foreground">{content.employer.newOrder.hireSummary}</h3>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-semibold text-muted-foreground">
                {content.employer.newOrder.months}
              </label>
              <StepperInput value={months} onChange={setMonths} step={1} min={1} max={12} prefix="" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-5 py-4">
              <span className="text-base font-semibold text-primary-foreground">
                {rupees(selectedSalary)} × {months} {content.employer.newOrder.months}
              </span>
              <span className="text-2xl font-extrabold text-primary-foreground">{rupees(totalSalary)}</span>
            </div>
          </div>
        </section>
      )}

      {(when === 'now' || when === 'tomorrow') && stage === 'results' && (
        <section className="rounded-3xl border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            {when === 'now'
              ? 'Tap the mic above to speak your order. Workers near you will appear on a map.'
              : 'Choose a time slot and tap the mic to book for tomorrow.'}
          </p>
        </section>
      )}
    </div>
  );
}