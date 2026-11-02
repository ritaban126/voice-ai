// 'use client';

// import * as React from 'react';
// import { Mic, Send, Info } from 'lucide-react';
// import { StepperInput } from '../../components/ui/stepper-input';
// import { VoiceCard } from '@/components/voice/voice-card';
// import { TranscriptChip } from '@/components/voice/transcript-chip';
// import { useVoice } from '../../hooks/use-voice';
// import { content } from '../../lib/content';
// import { rupees } from '../../lib/format';

// interface QuoteFormProps {
//   visitCharge: number;
//   onSend?: (labour: number, material: number, note: string) => void;
// }

// export function QuoteForm({ visitCharge, onSend }: QuoteFormProps) {
//   const [labour, setLabour] = React.useState(150);
//   const [material, setMaterial] = React.useState(0);
//   const [note, setNote] = React.useState('');
//   const voice = useVoice();

//   const total = labour + material;

//   const handleMic = () => {
//     voice.start('Need new PVC pipe, 2 feet', 'Note saved', { speaking: true });
//   };

//   React.useEffect(() => {
//     if (voice.status === 'idle' && voice.transcript) {
//       setNote(voice.transcript);
//     }
//   }, [voice.status, voice.transcript]);

//   return (
//     <div className="rounded-3xl border border-border bg-card p-5">
//       <div className="mb-4 inline-flex items-start gap-2 rounded-2xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
//         <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
//         {content.worker.orders.detail.visitNote.replace('{amount}', String(visitCharge))}
//       </div>

//       <div className="space-y-4">
//         <div>
//           <label className="mb-1.5 block text-sm font-semibold text-foreground">
//             {content.worker.orders.detail.quoteLabour}
//           </label>
//           <StepperInput value={labour} onChange={setLabour} step={50} min={0} max={5000} />
//         </div>
//         <div>
//           <label className="mb-1.5 block text-sm font-semibold text-foreground">
//             {content.worker.orders.detail.quoteMaterial}
//           </label>
//           <StepperInput value={material} onChange={setMaterial} step={10} min={0} max={10000} />
//         </div>
//       </div>

//       <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-5 py-4">
//         <span className="text-base font-semibold text-primary-foreground">
//           {content.worker.orders.detail.quoteTotal}
//         </span>
//         <span className="text-2xl font-extrabold text-primary-foreground">
//           {rupees(total)}
//         </span>
//       </div>

//       <div className="mt-5">
//         <p className="mb-2 text-sm font-semibold text-foreground">
//           {content.worker.orders.detail.quoteNote}
//         </p>
//         <VoiceCard
//           state={voice}
//           onMicClick={handleMic}
//           onReplay={() => voice.setStatus('speaking')}
//           large={false}
//         />
//         {voice.transcript && (
//           <div className="mt-3">
//             <TranscriptChip transcript={voice.transcript} onSayAgain={voice.reset} />
//           </div>
//         )}
//         {note && (
//           <p className="mt-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm text-foreground">
//             {note}
//           </p>
//         )}
//       </div>

//       <button
//         type="button"
//         onClick={() => onSend?.(labour, material, note)}
//         className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
//       >
//         <Send className="h-5 w-5" />
//         {content.worker.orders.detail.sendQuote}
//       </button>
//     </div>
//   );
// }










'use client';

import * as React from 'react';
import { Mic, Send, Info } from 'lucide-react';
import { StepperInput } from '../../components/ui/stepper-input';
import { VoiceCard } from '@/components/voice/voice-card';
import { TranscriptChip } from '@/components/voice/transcript-chip';
import { useVoice } from '../../hooks/use-voice';
import { content } from '../../lib/content';
import { rupees } from '../../lib/format';

interface QuoteFormProps {
  visitCharge: number;
  onSend?: (labour: number, material: number, note: string) => void;
}

export function QuoteForm({ visitCharge, onSend }: QuoteFormProps) {
  const [labour, setLabour] = React.useState(150);
  const [material, setMaterial] = React.useState(0);
  const voice = useVoice();

  const note = voice.transcript || '';
  const total = labour + material;

  const handleMic = () => {
    voice.start('Need new PVC pipe, 2 feet', 'Note saved', { speaking: true });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="mb-4 inline-flex items-start gap-2 rounded-2xl bg-accent px-3 py-2 text-sm font-medium text-accent-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        {content.worker.orders.detail.visitNote.replace('{amount}', String(visitCharge))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            {content.worker.orders.detail.quoteLabour}
          </label>
          <StepperInput value={labour} onChange={setLabour} step={50} min={0} max={5000} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            {content.worker.orders.detail.quoteMaterial}
          </label>
          <StepperInput value={material} onChange={setMaterial} step={10} min={0} max={10000} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-primary px-5 py-4">
        <span className="text-base font-semibold text-primary-foreground">
          {content.worker.orders.detail.quoteTotal}
        </span>
        <span className="text-2xl font-extrabold text-primary-foreground">
          {rupees(total)}
        </span>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm font-semibold text-foreground">
          {content.worker.orders.detail.quoteNote}
        </p>

        <VoiceCard
          state={voice}
          onMicClick={handleMic}
          onReplay={() => voice.setStatus('speaking')}
          large={false}
        />

        {voice.transcript && (
          <div className="mt-3">
            <TranscriptChip transcript={voice.transcript} onSayAgain={voice.reset} />
          </div>
        )}

        {note && (
          <p className="mt-2 rounded-2xl bg-secondary px-4 py-2.5 text-sm text-foreground">
            {note}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSend?.(labour, material, note)}
        className="mt-5 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
      >
        <Send className="h-5 w-5" />
        {content.worker.orders.detail.sendQuote}
      </button>
    </div>
  );
}




