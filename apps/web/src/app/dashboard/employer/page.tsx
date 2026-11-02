'use client';

import * as React from 'react';
import {
  Briefcase,
  CalendarDays,
  Wallet,
  ChevronRight,
  Clock,
  Phone,
} from 'lucide-react';
import { VoiceCard } from '@/components/voice/voice-card';
import { TranscriptChip } from '@/components/voice/transcript-chip';
import { AiMessage } from '@/components/voice/ai-message';
import { LoadingMessage } from '@/components/voice/loading-message';
import { MapView } from '@/components/map/map-view';
import { ServiceChip } from '@/components/ui/service-chip';
import { WorkerPopupCard } from '@/components/employer/worker-popup-card';
import { WorkerCard } from '@/components/employer/worker-card';
import { TrackingCard } from '@/components/employer/tracking-card';
import { PaymentModeModal } from '@/components/payments/payment-mode-modal';
import { StatCard } from '../../../components/ui/stat-card';
import { useVoice } from '@/hooks/use-voice';
import { useRole } from '@/hooks/use-role';
import { content, SERVICE_META } from '@/lib/content';
import { rupees } from '@/lib/format';
import type { MapMarker, PaymentMode, WorkerPin } from '@/types';
import {
  employerUser,
  employerSkillChips,
  mockWorkerPins,
  mockEmployerOrders,
  mockEmployerStats,
} from '@/lib/mock-data';

type Flow = 'idle' | 'listening' | 'searching' | 'results' | 'confirmed' | 'noWorker';

export default function EmployerHomePage() {
  const { voiceReplies } = useRole();
  const voice = useVoice();
  const [flow, setFlow] = React.useState<Flow>('idle');
  const [selectedId, setSelectedId] = React.useState<string>('w1');
  const [popupId, setPopupId] = React.useState<string | null>(null);
  const [payOpen, setPayOpen] = React.useState(false);
  const [progress, setProgress] = React.useState(0.3);
  const [rejected, setRejected] = React.useState<string[]>([]);

  const homeMarker: MapMarker = { id: 'home', label: 'Home', x: 50, y: 52, home: true };
  const workerMarkers: MapMarker[] = mockWorkerPins.map((w) => ({
    id: w.id,
    label: w.name,
    x: w.x,
    y: w.y,
    selected: w.id === selectedId,
  }));

  const activeWorkers = mockWorkerPins.filter((w) => !rejected.includes(w.id));
  const bestWorker = activeWorkers[0] ?? mockWorkerPins[0];
  const alternatives = activeWorkers.slice(1);
  const popupWorker = mockWorkerPins.find((w) => w.id === popupId);
  const confirmedWorker = mockWorkerPins[0];

  const startFlow = () => {
    voice.start(
      'I need a plumber, white house opposite Durgachowk mor, right now',
      'Order noted, please wait a minute',
      { speaking: false }
    );
    setFlow('listening');
    setTimeout(() => setFlow('searching'), 4200);
    setTimeout(() => {
      setFlow('results');
      setSelectedId(bestWorker.id);
    }, 6200);
  };

  const handleReject = (id: string) => {
    setRejected((prev) => [...prev, id]);
    const remaining = activeWorkers.filter((w) => w.id !== id);
    if (remaining.length > 0) {
      setSelectedId(remaining[0].id);
    } else {
      setFlow('noWorker');
    }
  };

  const handleAccept = () => {
    setPayOpen(true);
  };

  const handlePayConfirm = (_mode: PaymentMode) => {
    setPayOpen(false);
    setFlow('confirmed');
    voice.setStatus('speaking');
    // simulate tracking progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 1) {
          clearInterval(interval);
          return 1;
        }
        return p + 0.1;
      });
    }, 1500);
  };

  const activeOrders = mockEmployerOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* greeting + voice */}
      <section>
        <h1 className="text-xl font-extrabold text-foreground">
          {content.employer.home.greeting(employerUser.name)}
        </h1>
        <div className="mt-4">
          <VoiceCard
            state={voice}
            hint={content.voice.micHintEmployer}
            onMicClick={startFlow}
            onReplay={() => voice.setStatus('speaking')}
            muted={!voiceReplies}
          />
        </div>

        {flow !== 'idle' && voice.transcript && (
          <div className="mt-4 space-y-3">
            <TranscriptChip transcript={voice.transcript} onSayAgain={() => { voice.reset(); setFlow('idle'); }} />
            {voice.aiReply && (
              <AiMessage message={voice.aiReply} onReplay={() => voice.setStatus('speaking')} muted={!voiceReplies} />
            )}
          </div>
        )}

        {flow === 'searching' && (
          <div className="mt-4">
            <LoadingMessage text="Please wait, I am looking for a plumber near you..." />
          </div>
        )}
      </section>

      {/* service chips */}
      <section>
        <div className="flex flex-wrap gap-2">
          {employerSkillChips.map((s) => (
            <ServiceChip key={s} skill={s} compact />
          ))}
        </div>
      </section>

      {/* results: map + side panel */}
      {(flow === 'results' || flow === 'confirmed') && (
        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="relative">
            <MapView
              markers={[homeMarker, ...workerMarkers]}
              selectedId={selectedId}
              onSelect={(id) => setPopupId(id)}
              route
            />
            {popupWorker && popupWorker.id !== selectedId && (
              <div className="absolute left-4 top-4 z-10">
                <WorkerPopupCard
                  worker={popupWorker}
                  onAccept={() => {
                    setSelectedId(popupWorker.id);
                    setPopupId(null);
                  }}
                  onReject={() => {
                    handleReject(popupWorker.id);
                    setPopupId(null);
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-3">
            {flow === 'results' && (
              <>
                <p className="text-sm font-bold text-primary">{content.employer.home.bestMatch}</p>
                <WorkerPopupCard worker={bestWorker} variant="panel" onAccept={handleAccept} onReject={() => handleReject(bestWorker.id)} />
                {alternatives.length > 0 && (
                  <>
                    <p className="pt-2 text-sm font-bold text-muted-foreground">
                      {content.employer.home.alternatives}
                    </p>
                    {alternatives.map((w) => (
                      <WorkerCard
                        key={w.id}
                        worker={w}
                        onChoose={() => setSelectedId(w.id)}
                        actionLabel={content.employer.home.choose}
                      />
                    ))}
                  </>
                )}
                {rejected.length > 0 && activeWorkers.length > 0 && (
                  <AiMessage message={content.employer.home.rejectMsg} muted={!voiceReplies} />
                )}
              </>
            )}
          </div>
        </section>
      )}

      {/* no worker state */}
      {flow === 'noWorker' && (
        <section className="rounded-3xl border border-border bg-card p-6 text-center">
          <h3 className="text-lg font-bold text-foreground">{content.employer.home.noWorkerTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{content.employer.home.noWorkerBody}</p>
          <button
            type="button"
            onClick={() => setFlow('idle')}
            className="mt-4 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-lg font-bold text-primary-foreground hover:bg-primary/90"
          >
            {content.employer.home.bookTomorrow}
          </button>
        </section>
      )}

      {/* confirmed: tracking */}
      {flow === 'confirmed' && (
        <section className="space-y-3">
          <AiMessage message={content.employer.home.confirmMsg} muted={!voiceReplies} />
          <TrackingCard worker={confirmedWorker} progress={progress} onCancel={() => setFlow('idle')} />
        </section>
      )}

      {/* stats */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={content.employer.home.stats.ordersToday} value={mockEmployerStats.ordersToday} icon={<Briefcase className="h-4 w-4" />} />
        <StatCard label={content.employer.home.stats.ordersMonth} value={mockEmployerStats.ordersMonth} icon={<CalendarDays className="h-4 w-4" />} />
        <StatCard label={content.employer.home.stats.spentWeek} value={rupees(mockEmployerStats.spentWeek)} icon={<Wallet className="h-4 w-4" />} />
        <StatCard label={content.employer.home.stats.spentMonth} value={rupees(mockEmployerStats.spentMonth)} icon={<Wallet className="h-4 w-4" />} accent />
      </section>

      {/* my orders */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">{content.employer.home.myOrders}</h2>
        </div>
        <div className="space-y-3">
          {mockEmployerOrders.map((order) => {
            const statusChip =
              order.status === 'on_the_way'
                ? content.employer.home.statusChips.onTheWay
                : order.status === 'tomorrow'
                ? content.employer.home.statusChips.tomorrow
                : content.employer.home.statusChips.completed;
            const chipColor =
              order.status === 'on_the_way'
                ? 'bg-primary text-primary-foreground'
                : order.status === 'tomorrow'
                ? 'bg-warning/15 text-warning-foreground'
                : 'bg-success/15 text-success';
            return (
              <div key={order.id} className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-accent text-primary text-sm font-bold">
                  {order.workerInitials ?? 'KA'}
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">
                    {SERVICE_META[order.skill].label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.workerName ?? 'Pending'} · {order.timeLabel}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${chipColor}`}>
                  {statusChip}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <PaymentModeModal
        open={payOpen}
        onOpenChange={setPayOpen}
        amount={bestWorker.visitCharge}
        onConfirm={handlePayConfirm}
      />
    </div>
  );
}