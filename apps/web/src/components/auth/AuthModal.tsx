'use client';

import {
  useCallback, useEffect, useRef, useState,
  type KeyboardEvent as ReactKeyEvent, type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, Bot, Check, Home, Loader2, MapPin, Mic, ShieldCheck, Square, Volume2, Wrench, X,
} from 'lucide-react';
import { requestOtp, verifyOtp, saveLanguage } from '@repo/auth/client';
import { AUTH_STEPS, OTP_RESEND_SECONDS, nextStep, prevStep, voiceGuideFor, type AuthStep } from '@repo/auth';
import { DEFAULT_LANG, LANGUAGE_LIST, isLang, micGuideKey, phoneSchema, type LangCode, type Role } from '@repo/shared';

/* ------------------------------------------------------------------ *
 *  KaamBol sign-in modal: PHONE > OTP > LANGUAGE > ROLE > VOICE
 *  Use:  <BookServiceButton />  (put it in the navbar)
 * ------------------------------------------------------------------ */

/* ---------- screen text in 4 languages (language step changes the whole modal live) ---------- */
const T = {
  phoneTitle: { en: 'Enter your mobile number', hi: 'अपना मोबाइल नंबर डालिए', bn: 'আপনার মোবাইল নম্বর দিন', ta: 'உங்கள் மொபைல் எண்ணை உள்ளிடுங்கள்' },
  phoneHint: { en: 'We will send a 6-digit OTP', hi: 'हम 6 अंकों का OTP भेजेंगे', bn: 'আমরা ৬ সংখ্যার OTP পাঠাব', ta: 'நாங்கள் 6 இலக்க OTP அனுப்புவோம்' },
  sendOtp: { en: 'Send OTP', hi: 'OTP भेजें', bn: 'OTP পাঠান', ta: 'OTP அனுப்பு' },
  otpTitle: { en: 'Enter the OTP', hi: 'OTP डालिए', bn: 'OTP দিন', ta: 'OTP ஐ உள்ளிடுங்கள்' },
  otpSentTo: { en: 'Sent to', hi: 'भेजा गया:', bn: 'পাঠানো হয়েছে:', ta: 'அனுப்பப்பட்டது:' },
  resendIn: { en: 'Resend in', hi: 'दोबारा भेजें:', bn: 'আবার পাঠান:', ta: 'மீண்டும் அனுப்ப:' },
  resend: { en: 'Resend OTP', hi: 'OTP दोबारा भेजें', bn: 'OTP আবার পাঠান', ta: 'OTP மீண்டும் அனுப்பு' },
  changeNumber: { en: 'Change number', hi: 'नंबर बदलें', bn: 'নম্বর বদলান', ta: 'எண்ணை மாற்று' },
  verifying: { en: 'Checking...', hi: 'जाँच रहे हैं...', bn: 'যাচাই হচ্ছে...', ta: 'சரிபார்க்கிறது...' },
  langTitle: { en: 'Choose your language', hi: 'अपनी भाषा चुनिए', bn: 'আপনার ভাষা বেছে নিন', ta: 'உங்கள் மொழியைத் தேர்ந்தெடுங்கள்' },
  next: { en: 'Continue', hi: 'आगे बढ़ें', bn: 'এগিয়ে যান', ta: 'தொடரவும்' },
  roleTitle: { en: 'Who are you?', hi: 'आप कौन हैं?', bn: 'আপনি কে?', ta: 'நீங்கள் யார்?' },
  workerTitle: { en: 'I want work', hi: 'काम चाहिए', bn: 'কাজ চাই', ta: 'வேலை வேண்டும்' },
  workerDesc: { en: 'Plumber, electrician, maid, nurse and more', hi: 'प्लंबर, इलेक्ट्रीशियन, मेड, नर्स और अन्य', bn: 'প্লাম্বার, ইলেকট্রিশিয়ান, মেইড, নার্স এবং আরও', ta: 'பிளம்பர், எலக்ட்ரீஷியன், பணிப்பெண், நர்ஸ் மற்றும் பலர்' },
  employerTitle: { en: 'Need work done', hi: 'काम करवाना है', bn: 'কাজ করাতে চাই', ta: 'வேலை செய்ய ஆள் வேண்டும்' },
  employerDesc: { en: 'Find a trusted worker near you', hi: 'अपने पास भरोसेमंद वर्कर ढूँढिए', bn: 'আপনার কাছের ভরসাযোগ্য কর্মী খুঁজুন', ta: 'உங்கள் அருகில் நம்பகமான பணியாளரைத் தேடுங்கள்' },
  roleLocked: { en: 'You can choose this only once', hi: 'यह चुनाव सिर्फ एक बार होता है', bn: 'এটি শুধু একবারই বাছা যায়', ta: 'இதை ஒரு முறை மட்டுமே தேர்ந்தெடுக்க முடியும்' },
  voiceTitle: { en: 'Tell me with your voice', hi: 'आवाज़ से बताइए', bn: 'গলার স্বরে বলুন', ta: 'குரலில் சொல்லுங்கள்' },
  example: { en: 'For example', hi: 'जैसे', bn: 'যেমন', ta: 'உதாரணம்' },
  tapSpeak: { en: 'Tap and speak', hi: 'दबाइए और बोलिए', bn: 'চেপে বলুন', ta: 'அழுத்தி பேசுங்கள்' },
  listening: { en: 'Listening... tap to stop', hi: 'सुन रहा हूँ... रोकने के लिए दबाइए', bn: 'শুনছি... থামাতে চাপুন', ta: 'கேட்கிறேன்... நிறுத்த அழுத்துங்கள்' },
  understanding: { en: 'Understanding...', hi: 'समझ रहा हूँ...', bn: 'বুঝছি...', ta: 'புரிந்துகொள்கிறேன்...' },
  heard: { en: 'I heard', hi: 'मैंने सुना', bn: 'আমি শুনেছি', ta: 'நான் கேட்டது' },
  sayAgain: { en: 'Tap the mic and say it again', hi: 'माइक दबाकर फिर से बोलिए', bn: 'মাইক চেপে আবার বলুন', ta: 'மைக்கை அழுத்தி மீண்டும் சொல்லுங்கள்' },
  done: { en: 'Done! Opening your dashboard...', hi: 'हो गया! डैशबोर्ड खुल रहा है...', bn: 'হয়ে গেছে! ড্যাশবোর্ড খুলছে...', ta: 'முடிந்தது! டாஷ்போர்டு திறக்கிறது...' },
  micDenied: { en: 'Microphone is blocked. Allow it in your browser, or skip for now.', hi: 'माइक बंद है। ब्राउज़र में इजाज़त दीजिए, या अभी छोड़ दीजिए।', bn: 'মাইক বন্ধ আছে। ব্রাউজারে অনুমতি দিন, অথবা এখন বাদ দিন।', ta: 'மைக் தடுக்கப்பட்டுள்ளது. உலாவியில் அனுமதியுங்கள், அல்லது இப்போது தவிர்க்கவும்.' },
  skip: { en: 'Skip for now', hi: 'अभी छोड़ें', bn: 'এখন বাদ দিন', ta: 'இப்போது தவிர்' },
  allowLocation: { en: 'Allow location', hi: 'लोकेशन की इजाज़त दें', bn: 'লোকেশনের অনুমতি দিন', ta: 'இருப்பிட அனுமதி' },
  locationWhy: { en: 'Needed to match you with people nearby', hi: 'आस-पास के लोगों से जोड़ने के लिए ज़रूरी', bn: 'কাছের মানুষের সাথে মেলাতে দরকার', ta: 'அருகிலுள்ளவர்களுடன் இணைக்க தேவை' },
  locationOk: { en: 'Location saved', hi: 'लोकेशन मिल गई', bn: 'লোকেশন পাওয়া গেছে', ta: 'இருப்பிடம் கிடைத்தது' },
  listenGuide: { en: 'Listen again', hi: 'फिर से सुनिए', bn: 'আবার শুনুন', ta: 'மீண்டும் கேளுங்கள்' },
  badPhone: { en: 'Enter a valid 10-digit mobile number', hi: 'सही 10 अंकों का मोबाइल नंबर डालिए', bn: 'সঠিক ১০ সংখ্যার মোবাইল নম্বর দিন', ta: 'சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' },
  badOtp: { en: 'Wrong OTP. Please try again.', hi: 'OTP गलत है। फिर से कोशिश करें।', bn: 'OTP ভুল। আবার চেষ্টা করুন।', ta: 'OTP தவறு. மீண்டும் முயற்சிக்கவும்.' },
  errorGeneric: { en: 'Something went wrong. Please try again.', hi: 'कुछ गड़बड़ हुई। कृपया फिर से कोशिश करें।', bn: 'কিছু ভুল হয়েছে। আবার চেষ্টা করুন।', ta: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.' },
  back: { en: 'Back', hi: 'पीछे', bn: 'পেছনে', ta: 'பின்னே' },
  close: { en: 'Close', hi: 'बंद करें', bn: 'বন্ধ করুন', ta: 'மூடு' },
  book: { en: 'Book a service', hi: 'सर्विस बुक करें', bn: 'সার্ভিস বুক করুন', ta: 'சேவையை முன்பதிவு செய்' },
} as const satisfies Record<string, Record<LangCode, string>>;
type UiKey = keyof typeof T;

/* ---------- types and small helpers ---------- */
interface MeResponse {
  user: { role: Role | null; lang: string };
  hasProfile: boolean;
  resumeStep: AuthStep | 'DONE';
}
interface VoiceResponse {
  transcript: string;
  intent: string;
  replyKey: string;
  replyText: string;
  audioBase64?: string;
  mimeType?: string;
  data?: { requestId?: string };
  error?: string;
}
interface ReplyPayload { replyText: string; audioBase64?: string; mimeType?: string }

class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) { super(message); }
}

// Same-origin call to the Express API (Next.js rewrites /api/* to it). Cookies carry the login session.
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, { credentials: 'include', ...init });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const e = (body as { error?: { code?: string; message?: string } } | null)?.error;
    throw new ApiError(e?.message ?? 'Request failed', res.status, e?.code);
  }
  return body as T;
}
const postJson = <T,>(path: string, data: unknown) =>
  api<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });

const dashboardPath = (role: Role, requestId?: string) =>
  `/dashboard/${role.toLowerCase()}${requestId ? `?request=${requestId}` : ''}`;

const EMPTY_OTP = ['', '', '', '', '', ''];
const MAX_RECORD_SECONDS = 15;
const EXAMPLE_RE = /(For example:|जैसे:|যেমন:|உதாரணம்:)/;

// The AI guide message holds an example sentence after "For example:". Show it in its own box.
function splitExample(text: string): [string, string] {
  const m = EXAMPLE_RE.exec(text);
  if (!m) return [text, ''];
  return [text.slice(0, m.index).trim(), text.slice(m.index + m[0].length).trim()];
}

/* ---------- shared look (white + orange) ---------- */
const primaryBtn =
  'flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-orange-600 text-xl font-bold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:cursor-not-allowed disabled:bg-orange-200';
const linkBtn = 'text-base font-semibold text-orange-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 rounded';

/* ---------- microphone recorder (browser MediaRecorder) ---------- */
function useRecorder(onFinished: (blob: Blob) => void) {
  const recRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const finished = useRef(onFinished);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => { finished.current = onFinished; });

  const release = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    recRef.current = null;
  }, []);

  useEffect(() => () => {
    if (recRef.current?.state === 'recording') { recRef.current.onstop = null; recRef.current.stop(); }
    release();
  }, [release]);

  const start = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // throws if the user blocks the mic
    streamRef.current = stream;
    const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    chunks.current = [];
    rec.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: rec.mimeType || 'audio/webm' });
      release();
      finished.current(blob);
    };
    rec.start();
    recRef.current = rec;
    setSeconds(0);
    let n = 0;
    timer.current = setInterval(() => {
      n += 1;
      setSeconds(n);
      if (n >= MAX_RECORD_SECONDS && rec.state === 'recording') rec.stop(); // clips stay short
    }, 1000);
  }, [release]);

  const stop = useCallback(() => {
    if (recRef.current?.state === 'recording') recRef.current.stop();
  }, []);

  return { start, stop, seconds };
}

/* ================================================================== *
 *  The modal
 * ================================================================== */
export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  // keep the latest router / onClose in refs, so the callbacks below stay stable and the open-effect runs only when `open` changes
  const routerRef = useRef(router);
  const onCloseRef = useRef(onClose);
  useEffect(() => { routerRef.current = router; onCloseRef.current = onClose; });

  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true); // true until /api/me answers (no form flash)
  const [step, setStep] = useState<AuthStep>('PHONE');
  const [lang, setLang] = useState<LangCode>(DEFAULT_LANG);
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState('');
  const [e164, setE164] = useState('');
  const [otp, setOtp] = useState<string[]>(EMPTY_OTP);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [resendLeft, setResendLeft] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const langRefs = useRef<Partial<Record<LangCode, HTMLButtonElement | null>>>({});

  const t = useCallback((k: UiKey) => T[k][lang], [lang]);
  const bilingual = (step === 'PHONE' || step === 'OTP') && lang !== 'en'; // language not chosen yet: show English under Hindi

//   useEffect(() => setMounted(true), []);
useEffect(() => {
  const timer = setTimeout(() => setMounted(true), 0);
  return () => clearTimeout(timer);
}, []);

  const goToDashboard = useCallback((r: Role, requestId?: string) => {
    onCloseRef.current();
    routerRef.current.push(dashboardPath(r, requestId));
  }, []);

  // Where should this person continue? (answer comes from GET /api/me, which uses getResumeStep from @repo/auth)
  const applyMe = useCallback((me: MeResponse) => {
    if (isLang(me.user.lang)) setLang(me.user.lang);
    if (me.user.role) setRole(me.user.role);
    if (me.resumeStep === 'DONE' && me.user.role) return goToDashboard(me.user.role);
    setStep(me.resumeStep === 'DONE' ? 'LANGUAGE' : me.resumeStep);
  }, [goToDashboard]);

  // On open: already logged in? resume. Not logged in (401)? start at PHONE.
//   useEffect(() => {
//     if (!open) { setChecking(true); return; } // next time it opens, start with the spinner
//     let cancelled = false;
//     setError('');
//     setOtp(EMPTY_OTP);
//     api<MeResponse>('/api/me')
//       .then((me) => { if (!cancelled) applyMe(me); })
//       .catch(() => { if (!cancelled) setStep('PHONE'); })
//       .finally(() => { if (!cancelled) setChecking(false); });
//     return () => { cancelled = true; };
//   }, [open, applyMe]);

useEffect(() => {
  let cancelled = false;

  if (!open) {
    const timer = setTimeout(() => {
      if (!cancelled) setChecking(true);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }

  const timer = setTimeout(() => {
    if (cancelled) return;

    setError('');
    setOtp(EMPTY_OTP);
  }, 0);

  api<MeResponse>('/api/me')
    .then((me) => {
      if (!cancelled) applyMe(me);
    })
    .catch(() => {
      if (!cancelled) setStep('PHONE');
    })
    .finally(() => {
      if (!cancelled) setChecking(false);
    });

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
}, [open, applyMe]);

  // Lock page scroll and close with Escape
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [open]);

  // "Resend in 30s" countdown
  useEffect(() => {
    if (resendLeft <= 0) return;
    const id = setTimeout(() => setResendLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendLeft]);

  const advance = (from: AuthStep) => {
    const n = nextStep(from);
    if (n !== 'DONE') setStep(n);
  };

  /* ----- step 1: phone -> OTP ----- */
  const sendOtp = async () => {
    const parsed = phoneSchema.safeParse(phone);
    if (!parsed.success) return setError(t('badPhone'));
    setBusy(true);
    setError('');
    try {
      setE164(await requestOtp(parsed.data));
      setOtp(EMPTY_OTP);
      setResendLeft(OTP_RESEND_SECONDS);
      if (step === 'PHONE') advance('PHONE');
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setBusy(false);
    }
  };

  /* ----- step 2: verify OTP (new number = account is created here) ----- */
  const submitOtp = async (code: string) => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await verifyOtp(e164, code);
    } catch {
      setError(t('badOtp'));
      setOtp(EMPTY_OTP);
      setBusy(false);
      otpRefs.current[0]?.focus();
      return;
    }
    try {
      applyMe(await api<MeResponse>('/api/me'));
    } catch {
      setStep('LANGUAGE'); // logged in, but could not read the profile: continue signup
    }
    setBusy(false);
  };

  const setDigits = (i: number, raw: string) => {
    const d = raw.replace(/\D/g, '');
    const next = [...otp];
    if (!d) next[i] = '';
    else if (d.length <= 2 && otp[i]) next[i] = d.slice(-1); // typed over a filled box
    else d.slice(0, 6 - i).split('').forEach((ch, k) => { next[i + k] = ch; }); // paste / SMS autofill
    setOtp(next);
    if (d) otpRefs.current[Math.min(5, i + (d.length <= 2 && otp[i] ? 1 : d.length))]?.focus();
    if (next.every(Boolean)) void submitOtp(next.join(''));
  };
  const otpKey = (i: number, e: ReactKeyEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  /* ----- step 3: language (whole modal switches language live) ----- */
  const pickLanguage = (l: LangCode) => {
    setLang(l);
    langRefs.current[l]?.scrollIntoView?.({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };
  const confirmLanguage = async () => {
    setBusy(true);
    setError('');
    try {
      await saveLanguage(lang);
      advance('LANGUAGE');
    } catch {
      setError(t('errorGeneric'));
    } finally {
      setBusy(false);
    }
  };

  /* ----- step 4: role (saved once, locked by the API) ----- */
  const pickRole = async (r: Role) => {
    setBusy(true);
    setError('');
    try {
      await postJson('/api/me/onboard', { lang, role: r });
      setRole(r);
      advance('ROLE');
    } catch (err) {
      setError(err instanceof ApiError && err.code === 'ROLE_LOCKED' ? err.message : t('errorGeneric'));
    } finally {
      setBusy(false);
    }
  };

  const canGoBack = step === 'OTP' || step === 'ROLE'; // after login there is no way back to phone / language
  const goBack = () => {
    setError('');
    setStep(prevStep(step));
  };
  const stepIndex = AUTH_STEPS.indexOf(step);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="max-h-[94dvh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:max-w-md sm:rounded-3xl"
      >
        {/* header: back, progress dots, close */}
        <div className="flex items-center justify-between px-5 pt-5">
          {canGoBack ? (
            <button type="button" onClick={goBack} aria-label={t('back')} className="grid h-11 w-11 place-items-center rounded-full text-slate-700 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
              <ArrowLeft className="h-6 w-6" />
            </button>
          ) : <span className="h-11 w-11" />}
          <ol className="flex items-center gap-2" aria-label={`${stepIndex + 1} / ${AUTH_STEPS.length}`}>
            {AUTH_STEPS.map((s, i) => (
              <li key={s} className={`h-2 rounded-full transition-all ${i === stepIndex ? 'w-6 bg-orange-600' : i < stepIndex ? 'w-2 bg-orange-600' : 'w-2 bg-orange-200'}`} />
            ))}
          </ol>
          <button type="button" onClick={onClose} aria-label={t('close')} className="grid h-11 w-11 place-items-center rounded-full text-slate-700 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 px-5 pb-7 pt-3">
          {checking ? (
            <div className="grid place-items-center py-16 text-orange-600"><Loader2 className="h-10 w-10 animate-spin" aria-label={t('verifying')} /></div>
          ) : (
            <>
              {step === 'PHONE' && (
                <>
                  <div>
                    <h2 id="auth-title" className="text-2xl font-bold text-slate-900">{t('phoneTitle')}</h2>
                    {bilingual && <p className="text-sm text-slate-500">{T.phoneTitle.en}</p>}
                  </div>
                  <div className="flex h-16 items-center overflow-hidden rounded-2xl border-2 border-slate-200 bg-white focus-within:border-orange-600">
                    <span className="flex h-full items-center border-r border-slate-200 bg-orange-50 px-4 text-lg font-bold text-slate-800">+91</span>
                    <input
                      autoFocus
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-label={t('phoneTitle')}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter' && phone.length === 10) void sendOtp(); }}
                      className="h-full w-full bg-transparent px-4 text-2xl font-semibold tracking-wider text-slate-900 outline-none placeholder:text-slate-300"
                    />
                  </div>
                  <p className="flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-5 w-5 shrink-0 text-orange-600" />{t('phoneHint')}</p>
                  <button type="button" onClick={() => void sendOtp()} disabled={busy || phone.length !== 10} className={primaryBtn}>
                    {busy && <Loader2 className="h-6 w-6 animate-spin" />}{t('sendOtp')}
                  </button>
                </>
              )}

              {step === 'OTP' && (
                <>
                  <div>
                    <h2 id="auth-title" className="text-2xl font-bold text-slate-900">{t('otpTitle')}</h2>
                    {bilingual && <p className="text-sm text-slate-500">{T.otpTitle.en}</p>}
                    <p className="mt-1 text-base text-slate-600">{t('otpSentTo')} <span className="font-semibold text-slate-900">{e164}</span></p>
                  </div>
                  <div className="flex justify-between gap-2" role="group" aria-label={t('otpTitle')}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        autoFocus={i === 0}
                        inputMode="numeric"
                        autoComplete={i === 0 ? 'one-time-code' : 'off'}
                        aria-label={`${i + 1} / 6`}
                        value={digit}
                        disabled={busy}
                        onChange={(e) => setDigits(i, e.target.value)}
                        onKeyDown={(e) => otpKey(i, e)}
                        onPaste={(e) => {
                          const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                          if (text) { e.preventDefault(); setDigits(0, text); }
                        }}
                        className="h-14 w-full min-w-0 rounded-xl border-2 border-slate-200 bg-white text-center text-2xl font-bold text-slate-900 outline-none focus:border-orange-600 disabled:bg-slate-50"
                      />
                    ))}
                  </div>
                  {busy && <p className="flex items-center justify-center gap-2 text-base text-orange-700"><Loader2 className="h-5 w-5 animate-spin" />{t('verifying')}</p>}
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={goBack} className={linkBtn}>{t('changeNumber')}</button>
                    {resendLeft > 0 ? (
                      <span className="text-base text-slate-500">{t('resendIn')} {resendLeft}s</span>
                    ) : (
                      <button type="button" onClick={() => void sendOtp()} disabled={busy} className={linkBtn}>{t('resend')}</button>
                    )}
                  </div>
                </>
              )}

              {step === 'LANGUAGE' && (
                <>
                  <h2 id="auth-title" className="text-2xl font-bold text-slate-900">{t('langTitle')}</h2>
                  <div role="radiogroup" aria-label={t('langTitle')} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2">
                    {LANGUAGE_LIST.map((l) => {
                      const on = l.code === lang;
                      return (
                        <button
                          key={l.code}
                          ref={(el) => { langRefs.current[l.code] = el; }}
                          type="button"
                          role="radio"
                          aria-checked={on}
                          onClick={() => pickLanguage(l.code)}
                          className={`relative flex h-32 w-40 shrink-0 snap-center flex-col items-start justify-end rounded-2xl border-2 p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 ${on ? 'border-orange-600 bg-orange-50' : 'border-slate-200 bg-white hover:border-orange-300'}`}
                        >
                          {on && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-orange-600 text-white"><Check className="h-4 w-4" /></span>}
                          <span className="text-3xl font-bold text-slate-900">{l.nativeLabel}</span>
                          <span className="text-sm text-slate-500">{l.englishLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button type="button" onClick={() => void confirmLanguage()} disabled={busy} className={primaryBtn}>
                    {busy && <Loader2 className="h-6 w-6 animate-spin" />}{t('next')}
                  </button>
                </>
              )}

              {step === 'ROLE' && (
                <>
                  <h2 id="auth-title" className="text-2xl font-bold text-slate-900">{t('roleTitle')}</h2>
                  <div className="space-y-3">
                    {([
                      { r: 'WORKER' as const, title: t('workerTitle'), desc: t('workerDesc'), Icon: Wrench },
                      { r: 'EMPLOYER' as const, title: t('employerTitle'), desc: t('employerDesc'), Icon: Home },
                    ]).map(({ r, title, desc, Icon }) => (
                      <button
                        key={r}
                        type="button"
                        disabled={busy}
                        onClick={() => void pickRole(r)}
                        className="flex w-full items-center gap-4 rounded-2xl border-2 border-slate-200 bg-white p-4 text-left transition hover:border-orange-600 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:opacity-60"
                      >
                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-orange-100 text-orange-700"><Icon className="h-7 w-7" /></span>
                        <span>
                          <span className="block text-xl font-bold text-slate-900">{title}</span>
                          <span className="block text-sm text-slate-600">{desc}</span>
                        </span>
                        {busy && <Loader2 className="ml-auto h-6 w-6 animate-spin text-orange-600" />}
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-sm text-slate-500">{t('roleLocked')}</p>
                </>
              )}

              {step === 'VOICE' && role && (
                <VoiceStep
                  role={role}
                  lang={lang}
                  onDone={(requestId) => goToDashboard(role, requestId)}
                  onSkip={() => goToDashboard(role)}
                />
              )}

              {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">{error}</p>}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ================================================================== *
 *  Step 5: first voice input (worker: profile, employer: first order)
 * ================================================================== */
type VoiceState = 'idle' | 'recording' | 'processing' | 'success' | 'retry';

// function VoiceStep({ role, lang, onDone, onSkip }: {
//   role: Role;
//   lang: LangCode;
//   onDone: (requestId?: string) => void;
//   onSkip: () => void;
// }) {
//   const t = (k: UiKey) => T[k][lang];
//   const [intro, example] = splitExample(voiceGuideFor(role, lang));
function VoiceStep({ role, lang, onDone, onSkip }: {
  role: Role;
  lang: LangCode;
  onDone: (requestId?: string) => void;
  onSkip: () => void;
}) {
    const t = (k: UiKey): string => {
    const translations: Record<LangCode, string> = T[k];
    return translations[lang];
  };

  const [intro, example] = splitExample(voiceGuideFor(role, lang));

  const [state, setState] = useState<VoiceState>('idle');
  const [heard, setHeard] = useState('');
  const [aiText, setAiText] = useState('');
  const [micBlocked, setMicBlocked] = useState(false);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [loc, setLoc] = useState<'idle' | 'asking' | 'ok' | 'denied'>('idle');
  const [typed, setTyped] = useState('');
  const coords = useRef<{ lat: number; lng: number } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const playAudio = useCallback((b64: string, mime = 'audio/wav') => {
    audio.current?.pause();
    const a = new Audio(`data:${mime};base64,${b64}`);
    audio.current = a;
    a.onended = () => setSpeaking(false);
    a.onerror = () => setSpeaking(false);
    setSpeaking(true);
    a.play().catch(() => setSpeaking(false)); // browser may block autoplay: the text is always shown too
  }, []);

  // AI reads out the guide (text + voice). If voice is off or fails, only the text shows.
  const speakGuide = useCallback(async () => {
    try {
      const r = await postJson<ReplyPayload>('/api/voice/speak', { key: micGuideKey(role) });
      if (r.audioBase64) playAudio(r.audioBase64, r.mimeType);
    } catch { /* text is enough */ }
  }, [role, playAudio]);

//   useEffect(() => {
//     void speakGuide();
//     return () => {
//       audio.current?.pause();
//       if (doneTimer.current) clearTimeout(doneTimer.current);
//     };
//   }, [speakGuide]);
useEffect(() => {
  const timer = setTimeout(() => {
    void speakGuide();
  }, 0);

  return () => {
    clearTimeout(timer);
    audio.current?.pause();
    if (doneTimer.current) {
      clearTimeout(doneTimer.current);
    }
  };
}, [speakGuide]);

  const requestLocation = () => {
    if (!navigator.geolocation) return setLoc('denied');
    setLoc('asking');
    navigator.geolocation.getCurrentPosition(
      (p) => { coords.current = { lat: p.coords.latitude, lng: p.coords.longitude }; setLoc('ok'); },
      () => setLoc('denied'),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  // The API answer: what the AI heard, what it says back (text + voice), and whether we are finished
  const handleResult = (res: VoiceResponse) => {
    setHeard(res.transcript);
    setAiText(res.replyText);
    if (res.audioBase64) playAudio(res.audioBase64, res.mimeType);
    const ok = role === 'WORKER' ? res.replyKey === 'accountCreatedWorker' : res.replyKey === 'orderSearching';
    if (ok) {
      setState('success');
      doneTimer.current = setTimeout(() => onDone(res.data?.requestId), 3000);
    } else {
      setState('retry');
    }
  };

  const extra = () => (coords.current ? { lat: coords.current.lat, lng: coords.current.lng } : {});

  const sendAudio = async (blob: Blob) => {
    setState('processing');
    setError('');
    try {
      const ext = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
      const fd = new FormData();
      fd.append('audio', blob, `speech.${ext}`);
      fd.append('mode', 'ONBOARDING');
      Object.entries(extra()).forEach(([k, v]) => fd.append(k, String(v)));
      handleResult(await api<VoiceResponse>('/api/voice/command', { method: 'POST', body: fd }));
    } catch {
      setError(t('errorGeneric'));
      setState('retry');
    }
  };

  // Only while developing: type the sentence (works even before Gnani speech-to-text is set up)
  const sendTyped = async () => {
    setState('processing');
    setError('');
    try {
      handleResult(await postJson<VoiceResponse>('/api/voice/text', { text: typed, mode: 'ONBOARDING', ...extra() }));
    } catch {
      setError(t('errorGeneric'));
      setState('retry');
    }
  };

  const recorder = useRecorder((blob) => { void sendAudio(blob); });

  const onMic = async () => {
    if (state === 'recording') return recorder.stop();
    if (state === 'processing' || state === 'success') return;
    audio.current?.pause();
    setSpeaking(false);
    setError('');
    setHeard('');
    setAiText('');
    setMicBlocked(false);
    if (!coords.current && loc === 'idle') requestLocation(); // ask while the person speaks
    try {
      await recorder.start();
      setState('recording');
    } catch {
      setMicBlocked(true);
    }
  };

  const label =
    state === 'recording' ? `${t('listening')} (${recorder.seconds}s)`
    : state === 'processing' ? t('understanding')
    : state === 'success' ? t('done')
    : t('tapSpeak');

  return (
    <>
      <h2 id="auth-title" className="text-2xl font-bold text-slate-900">{t('voiceTitle')}</h2>

      {/* AI message with replay */}
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-600 text-white"><Bot className="h-6 w-6" /></span>
        <p className="rounded-2xl rounded-tl-sm bg-orange-50 px-4 py-3 text-base leading-relaxed text-slate-800">{intro}</p>
        <button type="button" onClick={() => void speakGuide()} aria-label={t('listenGuide')} className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-orange-200 text-orange-700 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${speaking ? 'animate-pulse' : ''}`}>
          <Volume2 className="h-5 w-5" />
        </button>
      </div>

      {example && (
        <div className="rounded-2xl border-2 border-dashed border-orange-300 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-orange-700">{t('example')}</p>
          <p className="text-base text-slate-800">“{example}”</p>
        </div>
      )}

      {/* location (the API uses it to find work and workers near you) */}
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
        <span className="flex items-center gap-2 text-sm text-slate-700">
          <MapPin className="h-5 w-5 shrink-0 text-orange-600" />
          {loc === 'ok' ? t('locationOk') : t('locationWhy')}
        </span>
        {loc === 'ok' ? <Check className="h-5 w-5 text-green-600" /> : (
          <button type="button" onClick={requestLocation} disabled={loc === 'asking'} className={linkBtn}>
            {loc === 'asking' ? <Loader2 className="h-5 w-5 animate-spin" /> : t('allowLocation')}
          </button>
        )}
      </div>

      {/* big mic */}
      <div className="flex flex-col items-center gap-3 py-2">
        <div className="relative grid place-items-center">
          {state === 'recording' && <span className="absolute h-28 w-28 animate-ping rounded-full bg-orange-300/60" />}
          <button
            type="button"
            onClick={() => void onMic()}
            aria-label={label}
            disabled={state === 'processing' || state === 'success'}
            className="relative grid h-24 w-24 place-items-center rounded-full bg-orange-600 text-white shadow-lg transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300 disabled:bg-orange-300"
          >
            {state === 'recording' ? <Square className="h-9 w-9 fill-white" />
              : state === 'processing' ? <Loader2 className="h-10 w-10 animate-spin" />
              : state === 'success' ? <Check className="h-11 w-11" />
              : <Mic className="h-11 w-11" />}
          </button>
        </div>
        <p className="text-center text-lg font-semibold text-slate-800" aria-live="polite">{label}</p>
      </div>

      {micBlocked && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-base text-amber-900">{t('micDenied')}</p>}

      {heard && (
        <p className="rounded-xl bg-slate-100 px-4 py-3 text-base text-slate-800">
          <span className="font-semibold">{t('heard')}:</span> “{heard}”
        </p>
      )}
      {aiText && (
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange-600 text-white"><Bot className="h-5 w-5" /></span>
          <p className="rounded-2xl rounded-tl-sm bg-orange-50 px-4 py-3 text-base text-slate-800">{aiText}</p>
        </div>
      )}
      {state === 'retry' && !error && <p className="text-center text-base font-medium text-orange-700">{t('sayAgain')}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-base font-medium text-red-700">{error}</p>}

      {process.env.NODE_ENV !== 'production' && (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) void sendTyped(); }}>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="DEV: type what you would say" className="h-11 w-full rounded-xl border border-dashed border-slate-300 px-3 text-sm outline-none focus:border-orange-600" />
          <button type="submit" className="h-11 shrink-0 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white">Send</button>
        </form>
      )}

      {state !== 'success' && (
        <div className="text-center">
          <button type="button" onClick={onSkip} className={linkBtn}>{t('skip')}</button>
        </div>
      )}
    </>
  );
}

/* ================================================================== *
 *  Navbar button: opens the modal
 *    <BookServiceButton />                      (default look)
 *    <BookServiceButton className="...">Book now</BookServiceButton>
 * ================================================================== */
export function BookServiceButton({ className, children }: { className?: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className ?? 'inline-flex h-12 items-center justify-center rounded-full bg-orange-600 px-6 text-lg font-bold text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300'}
      >
        {children ?? 'Book a service'}
      </button>
      <AuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}