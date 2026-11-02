// 'use client';

// import * as React from 'react';
// import { Mic, Loader2, Volume2, RotateCcw } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { content } from '../../lib/content';
// import type { VoiceState } from '@/types';

// interface VoiceCardProps {
//   state: VoiceState;
//   hint?: string;
//   onMicClick?: () => void;
//   onReplay?: () => void;
//   large?: boolean;
//   className?: string;
//   muted?: boolean;
// }

// export function VoiceCard({
//   state,
//   hint,
//   onMicClick,
//   onReplay,
//   large = true,
//   className,
//   muted = false,
// }: VoiceCardProps) {
//   const { status } = state;
//   const [seconds, setSeconds] = React.useState(0);

//   React.useEffect(() => {
//     if (status === 'recording') {
//       setSeconds(0);
//       const t = setInterval(() => setSeconds((s) => s + 1), 1000);
//       return () => clearInterval(t);
//     }
//     setSeconds(0);
//   }, [status]);

//   const labelMap: Record<VoiceState['status'], string> = {
//     idle: content.voice.idle,
//     recording: content.voice.recording,
//     processing: content.voice.processing,
//     speaking: content.voice.speaking,
//   };

//   const size = large ? 'h-28 w-28' : 'h-20 w-20';

//   return (
//     <div
//       className={cn(
//         'flex flex-col items-center justify-center rounded-3xl border border-accent bg-accent/50 px-6 py-8 text-center',
//         className
//       )}
//     >
//       <div className="relative grid place-items-center">
//         {status === 'recording' && (
//           <span
//             className={cn(
//               'absolute rounded-full bg-primary/30 animate-pulse-ring',
//               size
//             )}
//           />
//         )}

//         <button
//           type="button"
//           onClick={onMicClick}
//           aria-label={labelMap[status]}
//           className={cn(
//             'relative grid place-items-center rounded-full text-primary-foreground shadow-lg transition-transform active:scale-95',
//             size,
//             status === 'idle' && 'bg-primary hover:bg-primary/90',
//             status === 'recording' && 'bg-primary',
//             status === 'processing' && 'bg-primary/80',
//             status === 'speaking' && 'bg-primary/90'
//           )}
//         >
//           {status === 'idle' && <Mic className={large ? 'h-10 w-10' : 'h-7 w-7'} strokeWidth={2.5} />}
//           {status === 'recording' && (
//             <div className="flex items-end gap-1" aria-hidden>
//               {[0, 1, 2, 3, 4].map((i) => (
//                 <span
//                   key={i}
//                   className="w-1.5 rounded-full bg-primary-foreground animate-wave-bar"
//                   style={{
//                     height: large ? 32 : 22,
//                     animationDelay: `${i * 0.12}s`,
//                   }}
//                 />
//               ))}
//             </div>
//           )}
//           {status === 'processing' && (
//             <Loader2 className={large ? 'h-10 w-10' : 'h-7 w-7'} strokeWidth={2.5} />
//           )}
//           {status === 'speaking' && (
//             <Volume2
//               className={cn(large ? 'h-10 w-10' : 'h-7 w-7', 'animate-speaker-pulse')}
//               strokeWidth={2.5}
//             />
//           )}
//         </button>
//       </div>

//       <p className="mt-5 text-lg font-semibold text-foreground">
//         {status === 'recording' ? `${seconds}s` : labelMap[status]}
//       </p>

//       {hint && status === 'idle' && (
//         <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
//       )}

//       {status === 'speaking' && state.aiReply && !muted && onReplay && (
//         <button
//           type="button"
//           onClick={onReplay}
//           className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
//         >
//           <RotateCcw className="h-4 w-4" />
//           {content.voice.replay}
//         </button>
//       )}
//     </div>
//   );
// }







'use client';

import * as React from 'react';
import { Mic, Loader2, Volume2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { content } from '../../lib/content';
import type { VoiceState } from '@/types';

interface VoiceCardProps {
  state: VoiceState;
  hint?: string;
  onMicClick?: () => void;
  onReplay?: () => void;
  large?: boolean;
  className?: string;
  muted?: boolean;
}

function RecordingTimer() {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{seconds}s</>;
}

export function VoiceCard({
  state,
  hint,
  onMicClick,
  onReplay,
  large = true,
  className,
  muted = false,
}: VoiceCardProps) {
  const { status } = state;

  const labelMap: Record<VoiceState['status'], string> = {
    idle: content.voice.idle,
    recording: content.voice.recording,
    processing: content.voice.processing,
    speaking: content.voice.speaking,
  };

  const size = large ? 'h-28 w-28' : 'h-20 w-20';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-accent bg-accent/50 px-6 py-8 text-center',
        className
      )}
    >
      <div className="relative grid place-items-center">
        {status === 'recording' && (
          <span
            className={cn(
              'absolute rounded-full bg-primary/30 animate-pulse-ring',
              size
            )}
          />
        )}

        <button
          type="button"
          onClick={onMicClick}
          aria-label={labelMap[status]}
          className={cn(
            'relative grid place-items-center rounded-full text-primary-foreground shadow-lg transition-transform active:scale-95',
            size,
            status === 'idle' && 'bg-primary hover:bg-primary/90',
            status === 'recording' && 'bg-primary',
            status === 'processing' && 'bg-primary/80',
            status === 'speaking' && 'bg-primary/90'
          )}
        >
          {status === 'idle' && (
            <Mic
              className={large ? 'h-10 w-10' : 'h-7 w-7'}
              strokeWidth={2.5}
            />
          )}

          {status === 'recording' && (
            <div className="flex items-end gap-1" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-primary-foreground animate-wave-bar"
                  style={{
                    height: large ? 32 : 22,
                    animationDelay: `${i * 0.12}s`,
                  }}
                />
              ))}
            </div>
          )}

          {status === 'processing' && (
            <Loader2
              className={large ? 'h-10 w-10' : 'h-7 w-7'}
              strokeWidth={2.5}
            />
          )}

          {status === 'speaking' && (
            <Volume2
              className={cn(
                large ? 'h-10 w-10' : 'h-7 w-7',
                'animate-speaker-pulse'
              )}
              strokeWidth={2.5}
            />
          )}
        </button>
      </div>

      <p className="mt-5 text-lg font-semibold text-foreground">
        {status === 'recording' ? <RecordingTimer /> : labelMap[status]}
      </p>

      {hint && status === 'idle' && (
        <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
      )}

      {status === 'speaking' && state.aiReply && !muted && onReplay && (
        <button
          type="button"
          onClick={onReplay}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          {content.voice.replay}
        </button>
      )}
    </div>
  );
}
