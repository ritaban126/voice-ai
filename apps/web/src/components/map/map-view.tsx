'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { MapMarker } from '@/types';

export interface MapViewProps {
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  route?: boolean;
  className?: string;
  homePinLabel?: string;
  movingPinId?: string;
  movingProgress?: number;
}

export function MapView({
  markers,
  selectedId,
  onSelect,
  route = false,
  className,
  homePinLabel,
  movingPinId,
  movingProgress = 0,
}: MapViewProps) {
  const home = markers.find((m) => m.home);
  const workers = markers.filter((m) => !m.home);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-3xl border border-border bg-[#eef1f4]',
        className
      )}
      style={{ minHeight: 280 }}
      role="img"
      aria-label="Map showing your home and nearby workers"
    >
      {/* soft road grid */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d8dee6" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* main roads */}
        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#c9d2dc" strokeWidth="14" />
        <line x1="55%" y1="0" x2="55%" y2="100%" stroke="#c9d2dc" strokeWidth="14" />
        <line x1="0" y1="78%" x2="100%" y2="78%" stroke="#c9d2dc" strokeWidth="8" />
        <line x1="22%" y1="0" x2="22%" y2="100%" stroke="#c9d2dc" strokeWidth="8" />
        {/* park block */}
        <rect x="62%" y="46%" width="30%" height="26%" rx="10" fill="#d7ead7" opacity="0.7" />
        {/* water block */}
        <rect x="4%" y="48%" width="14%" height="24%" rx="10" fill="#c9e0ec" opacity="0.8" />
      </svg>

      {/* route line */}
      {route && home && workers[0] && (
        <svg className="absolute inset-0 h-full w-full" aria-hidden>
          <line
            x1={`${workers[0].x}%`}
            y1={`${workers[0].y}%`}
            x2={`${home.x}%`}
            y2={`${home.y}%`}
            stroke="#ea580c"
            strokeWidth="3"
            strokeDasharray="8 6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* moving pin */}
      {movingPinId &&
        home &&
        (() => {
          const m = markers.find((mk) => mk.id === movingPinId);
          if (!m) return null;
          const p = Math.min(Math.max(movingProgress, 0), 1);
          const x = m.x + (home.x - m.x) * p;
          const y = m.y + (home.y - m.y) * p;
          return <Pin x={x} y={y} label={m.label} orange small moving />;
        })()}

      {/* worker pins */}
      {workers.map((m) => {
        if (m.id === movingPinId) return null;
        const selected = selectedId === m.id;
        return (
          <Pin
            key={m.id}
            x={m.x}
            y={m.y}
            label={m.label}
            orange={selected}
            selected={selected}
            onClick={onSelect ? () => onSelect(m.id) : undefined}
          />
        );
      })}

      {/* home pin */}
      {home && (
        <Pin x={home.x} y={home.y} label={homePinLabel ?? 'Home'} home onClick={onSelect ? () => onSelect(home.id) : undefined} />
      )}

      {/* legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
        <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Worker
        <span className="mx-1 h-3 w-px bg-border" />
        <span className="h-2.5 w-2.5 rounded-sm bg-foreground" /> Home
      </div>
    </div>
  );
}

function Pin({
  x,
  y,
  label,
  orange,
  selected,
  home,
  small,
  moving,
  onClick,
}: {
  x: number;
  y: number;
  label?: string;
  orange?: boolean;
  selected?: boolean;
  home?: boolean;
  small?: boolean;
  moving?: boolean;
  onClick?: () => void;
}) {
  if (home) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-label={label}
      >
        <span className="block h-5 w-5 rounded-md bg-foreground ring-4 ring-foreground/15" />
        {label && (
          <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full bg-background px-2 py-0.5 text-[11px] font-semibold text-foreground shadow-sm">
            {label}
          </span>
        )}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 transition-transform',
        selected && 'scale-125',
        onClick && 'cursor-pointer hover:scale-110'
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-label={label}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          small ? 'h-7 w-7' : 'h-9 w-9',
          moving && 'drop-shadow-lg'
        )}
        fill={orange ? '#ea580c' : '#f97316'}
      >
        <path d="M12 2C7.6 2 4 5.6 4 10c0 5.5 7 12 8 12s8-6.5 8-12c0-4.4-3.6-8-8-8Z" />
        <circle cx="12" cy="10" r="3.2" fill="#fff" />
      </svg>
      {label && selected && (
        <span className="absolute left-1/2 -top-0.5 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background shadow-sm">
          {label}
        </span>
      )}
    </button>
  );
}