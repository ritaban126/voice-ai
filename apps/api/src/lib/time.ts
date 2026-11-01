// PURPOSE: date helpers in Indian time (IST), for "today / this week / this month" stats and "kal subah" bookings.
const IST_MS = 330 * 60 * 1000; // UTC+5:30
const pad = (n: number) => String(n).padStart(2, '0');

function parts(d: Date) {
  const t = new Date(d.getTime() + IST_MS);
  return { y: t.getUTCFullYear(), m: t.getUTCMonth(), day: t.getUTCDate(), dow: t.getUTCDay(), hour: t.getUTCHours() };
}
// A real moment (UTC Date) for "y-m-day hour:00" in IST. Day overflow (day+1, day-3) is handled by Date.UTC.
const make = (y: number, m: number, day: number, hour = 0) => new Date(Date.UTC(y, m, day, hour) - IST_MS);

export const startOfTodayIST = (now = new Date()) => { const p = parts(now); return make(p.y, p.m, p.day); };
export const startOfWeekIST = (now = new Date()) => { const p = parts(now); return make(p.y, p.m, p.day - ((p.dow + 6) % 7)); }; // Monday
export const startOfMonthIST = (now = new Date()) => { const p = parts(now); return make(p.y, p.m, 1); };
export const monthKeyIST = (now = new Date()) => { const p = parts(now); return `${p.y}-${pad(p.m + 1)}`; };
export const hourIST = (d: Date) => parts(d).hour;

export interface TimeWindow { start: Date; end: Date }

// Default slot for "kal subah": tomorrow 6am to 10am
export function tomorrowWindowIST(startHour = 6, endHour = 10, now = new Date()): TimeWindow {
  const p = parts(now);
  return { start: make(p.y, p.m, p.day + 1, startHour), end: make(p.y, p.m, p.day + 1, endHour) };
}

const TOMORROW = /\b(tomorrow|kal)\b|कल|কাল|நாளை/i;
const MORNING = /\b(morning|subah)\b|सुबह|সকাল|காலை/i;
const AFTERNOON = /\b(afternoon|dopahar)\b|दोपहर|দুপুর|மதியம்/i;
const EVENING = /\b(evening|shaam)\b|शाम|সন্ধ্যা|সন্ধে|மாலை/i;

// "kal subah" -> tomorrow 6-10. "aaj shaam" -> today 16-20. "abhi" -> null (means now).
export function resolveWindow(whenText?: string | null, now = new Date()): TimeWindow | null {
  if (!whenText) return null;
  const tomorrow = TOMORROW.test(whenText);
  const slot = AFTERNOON.test(whenText) ? [12, 16] : EVENING.test(whenText) ? [16, 20] : MORNING.test(whenText) || tomorrow ? [6, 10] : null;
  if (!slot) return null;
  const p = parts(now);
  let start = make(p.y, p.m, p.day + (tomorrow ? 1 : 0), slot[0]!);
  let end = make(p.y, p.m, p.day + (tomorrow ? 1 : 0), slot[1]!);
  if (start.getTime() < now.getTime()) { // that slot is already over today
    start = new Date(start.getTime() + 86400000);
    end = new Date(end.getTime() + 86400000);
  }
  return { start, end };
}
