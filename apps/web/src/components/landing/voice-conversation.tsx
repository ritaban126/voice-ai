import { Mic } from 'lucide-react';
import { chatSample } from '@/lib/landing-content';
import { cn } from '@/lib/utils';

export function VoiceConversation() {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-5 md:p-7 shadow-sm">
      <div className="flex items-center justify-between border-b border-ink/10 pb-4">
        <p className="font-semibold text-neutral-900">Booking by voice</p>
        <p className="flex items-center gap-2 text-sm text-neutral-500">
          <span className="h-2 w-2 rounded-full bg-emerald-600" aria-hidden="true" />
          Listening
        </p>
      </div>

      <ol className="mt-6 space-y-4" aria-label="Sample voice booking conversation">
        {chatSample.map((message) => {
          const isYou = message.from === 'you';
          return (
            <li key={message.text} className={cn('flex', isYou ? 'justify-end' : 'justify-start')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-normal',
                  isYou
                    ? 'rounded-br-md bg-neutral-900 text-white'
                    : 'rounded-bl-md bg-[#F4EFE6] text-neutral-900'
                )}
              >
                <p>{message.text}</p>
                {message.note && (
                  <p className="mt-1.5 text-xs font-medium text-white/70">{message.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-center gap-3 rounded-full bg-[#F4EFE6] py-2 pl-2 pr-5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#C2410C] text-white">
          <Mic className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-sm text-neutral-600">Didn&apos;t hear that right? Say it again.</p>
      </div>
    </div>
  );
}
