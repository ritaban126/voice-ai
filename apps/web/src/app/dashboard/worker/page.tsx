'use client';

import * as React from 'react';
import Link from 'next/link';
import { Briefcase, Star, Wallet, CalendarDays, Check, ChevronRight } from 'lucide-react';
import { VoiceCard } from '@/components/voice/voice-card';
import { TranscriptChip } from '@/components/voice/transcript-chip';
import { AiMessage } from '@/components/voice/ai-message';
import { OfferCard } from '@/components/worker/offer-card';
import { StatCard } from '../../../components/ui/stat-card';
import { ServiceChip } from '@/components/ui/service-chip';
import { useVoice } from '@/hooks/use-voice';
import { useRole } from '@/hooks/use-role';
import { content, SERVICE_META } from '@/lib/content';
import { rupees } from '@/lib/format';
import {
  workerUser,
  workerSkillChips,
  mockWorkerOffers,
  mockWorkerOrders,
  mockWorkerStats,
} from '@/lib/mock-data';

export default function WorkerHomePage() {
  const { voiceReplies } = useRole();
  const [available, setAvailable] = React.useState(true);
  const voice = useVoice();

  const greeting = content.worker.home.greeting(
    workerUser.name,
    SERVICE_META[workerUser.skill ?? 'plumber'].label,
    workerUser.area
  );

  const handleMic = () => {
    voice.start('My rate is 150', 'Got it, your rate is now Rs 150 per visit.', {
      speaking: true,
    });
  };

  const ongoing = mockWorkerOrders.find((o) => o.status === 'on_the_way' || o.status === 'accepted');
  const topOffer = mockWorkerOffers[0];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* greeting + availability */}
      <section className="rounded-3xl border border-border bg-card p-5">
        <p className="text-sm font-medium text-muted-foreground">Welcome back</p>
        <h1 className="text-xl font-extrabold text-foreground">{greeting}</h1>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-accent px-4 py-3">
          <div>
            <p className="text-base font-bold text-foreground">
              {content.worker.home.needWork}
            </p>
            <p className="text-sm text-muted-foreground">
              {available ? content.worker.home.needWorkOn : content.worker.home.needWorkOff}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={available}
            onClick={() => setAvailable((v) => !v)}
            className={`relative h-8 w-14 rounded-full transition-colors ${available ? 'bg-primary' : 'bg-input'}`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${available ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>
      </section>

      {/* voice */}
      <section>
        <VoiceCard
          state={voice}
          hint={content.voice.micHintWorker}
          onMicClick={handleMic}
          onReplay={() => voice.setStatus('speaking')}
          muted={!voiceReplies}
        />
        {voice.transcript && (
          <div className="mt-4 space-y-3">
            <TranscriptChip transcript={voice.transcript} onSayAgain={voice.reset} />
            {voice.aiReply && (
              <AiMessage message={voice.aiReply} onReplay={() => voice.setStatus('speaking')} muted={!voiceReplies} />
            )}
          </div>
        )}
      </section>

      {/* new offer */}
      {available && topOffer && (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex h-6 items-center rounded-full bg-primary px-2.5 text-xs font-bold text-primary-foreground">
              NEW OFFER
            </span>
          </div>
          <OfferCard offer={topOffer} highlighted onAccept={() => {}} onSkip={() => {}} />
        </section>
      )}

      {/* ongoing order strip */}
      {ongoing && (
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              {content.worker.home.ongoing}
            </p>
            <Link
              href="/dashboard/worker/orders"
              className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary"
            >
              View <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary text-sm font-bold">
              {ongoing.customerName.slice(0, 2)}
            </span>
            <div className="flex-1">
              <p className="text-base font-bold text-foreground">{ongoing.customerName}</p>
              <p className="text-sm text-muted-foreground">
                {SERVICE_META[ongoing.skill].label} · {ongoing.customerArea}
              </p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold capitalize text-primary">
              {ongoing.status.replace('_', ' ')}
            </span>
          </div>
        </section>
      )}

      {/* stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label={content.worker.home.stats.ordersToday} value={mockWorkerStats.ordersToday} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label={content.worker.home.stats.ordersMonth} value={mockWorkerStats.ordersMonth} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard
          label={content.worker.home.stats.rating}
          value={`${mockWorkerStats.ratingValue}`}
          icon={<Star className="h-4 w-4" />}
          accent
        />
        <StatCard label={content.worker.home.stats.earnedWeek} value={rupees(mockWorkerStats.earnedWeek)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label={content.worker.home.stats.earnedMonth} value={rupees(mockWorkerStats.earnedMonth)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label={`${mockWorkerStats.ratingCount} ${content.common.ratings}`} value={`${mockWorkerStats.ratingValue}★`} icon={<Star className="h-4 w-4" />} />
      </section>

      {/* skill chips */}
      <section>
        <p className="mb-2 text-sm font-semibold text-muted-foreground">My skills</p>
        <div className="flex flex-wrap gap-2">
          {workerSkillChips.map((s) => (
            <ServiceChip key={s} skill={s} compact />
          ))}
        </div>
      </section>
    </div>
  );
}