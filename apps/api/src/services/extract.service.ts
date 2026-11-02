// PURPOSE: the AI "brain". Takes the text of what the user said (Hindi / Bengali / Tamil / English, even mixed) and returns
// a clean { intent, data } object. Uses an LLM, and a simple keyword fallback when the LLM is off or fails.
// Whatever the LLM returns is checked with the Zod schema from packages/shared, so bad output can never reach the database.
import Anthropic from '@anthropic-ai/sdk';
import { SKILL_IDS, SKILLS, detectSkill, voiceIntentSchema, type LangCode, type Role, type VoiceIntent } from '@repo/shared';
import { env } from '../env';
import { resolveWindow } from '../lib/time';

const client = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;

const ALLOWED: Record<Role, string[]> = {
  WORKER: ['SET_PROFILE', 'CHANGE_RATE', 'SET_AVAILABLE', 'UNKNOWN'],
  EMPLOYER: ['REQUEST_WORKER', 'UNKNOWN'],
};

function buildPrompt(role: Role, lang: LangCode): string {
  const skills = SKILL_IDS.map((id) => `${id} (${SKILLS[id].label}, ${SKILLS[id].mode})`).join(', ');
  const common = `You turn what a person in India said into JSON. They speak ${lang} and may mix Hindi, Bengali, Tamil and English.
Reply with ONE JSON object only, no explanation. Omit fields you do not know (never use null). Amounts are whole rupees (convert words and native digits). Skill ids: ${skills}.`;

  if (role === 'WORKER') {
    return `${common}
The speaker is a WORKER. Pick one intent:
1. SET_PROFILE: they describe their work and where they live.
   {"intent":"SET_PROFILE","data":{"skills":["plumber"],"areaText":"Durgachowk","landmark":"near the main town","serviceCharge":100,"dailyRate":600,"expectedSalary":8000}}
   (serviceCharge = visit/minimum charge, dailyRate = per day, expectedSalary = per month for maid/nurse)
2. CHANGE_RATE: they want a new rate. {"intent":"CHANGE_RATE","data":{"serviceCharge":150}}
3. SET_AVAILABLE: they want work on or off today. {"intent":"SET_AVAILABLE","data":{"available":true}}
4. UNKNOWN: anything else. {"intent":"UNKNOWN"}`;
  }
  return `${common}
The speaker is an EMPLOYER who needs a worker. Intent is REQUEST_WORKER or UNKNOWN.
{"intent":"REQUEST_WORKER","data":{"skill":"plumber","addressNote":"white house opposite Durgachowk mor","jobType":"ON_DEMAND","whenText":"abhi","description":"tap is leaking","estimatedHours":1}}
jobType: ON_DEMAND = needed now/today, SCHEDULED = tomorrow or a later time (put the words in whenText, like "kal subah"), LONG_TERM = maid or nurse for months (add durationMonths and offeredSalary per month if said).
addressNote = the home location and landmarks exactly as spoken. If no work type is clear, return {"intent":"UNKNOWN"}.`;
}

// Remove null values (LLMs sometimes write null for "unknown", Zod optional fields do not accept null)
function stripNulls(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(stripNulls);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.entries(v).filter(([, x]) => x !== null).map(([k, x]) => [k, stripNulls(x)]));
  }
  return v;
}

function parseJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try { return stripNulls(JSON.parse(text.slice(start, end + 1))); } catch { return null; }
}

async function askLlm(transcript: string, role: Role, lang: LangCode): Promise<VoiceIntent | null> {
  if (!client) return null;
  const msg = await client.messages.create({
    model: env.LLM_MODEL,
    max_tokens: 500,
    system: buildPrompt(role, lang),
    messages: [{ role: 'user', content: transcript }],
  });
  const text = msg.content.map((b) => (b.type === 'text' ? b.text : '')).join('');
  const parsed = voiceIntentSchema.safeParse(parseJson(text));
  return parsed.success && ALLOWED[role].includes(parsed.data.intent) ? parsed.data : null;
}

/* ---------------- fallback (no LLM): keywords + numbers ---------------- */
const toAsciiDigits = (s: string) =>
  s.replace(/[\u0966-\u096F\u09E6-\u09EF\u0BE6-\u0BEF]/g, (ch) => {
    const c = ch.charCodeAt(0);
    return String(c - (c >= 0xbe6 ? 0xbe6 : c >= 0x9e6 ? 0x9e6 : 0x966));
});

function ruleBasedExtract(text: string, role: Role): VoiceIntent {
  const ascii = toAsciiDigits(text);
  const nums = [...ascii.matchAll(/\d+/g)].map((m) => parseInt(m[0], 10));
  const skill = detectSkill(text);

  if (role === 'WORKER') {
    if (skill) return { intent: 'SET_PROFILE', data: { skills: [skill], areaText: text, serviceCharge: nums.find((n) => n >= 50) } };
    if (nums.length && /(rate|charge|रेट|चार्ज|রেট|চার্জ|கட்டணம்)/i.test(text)) return { intent: 'CHANGE_RATE', data: { serviceCharge: nums[0] } };
    return { intent: 'UNKNOWN' };
  }
  if (!skill) return { intent: 'UNKNOWN' };
  const longTerm = SKILLS[skill].mode === 'LONG_TERM';
  const scheduled = !longTerm && resolveWindow(text) !== null;
  return {
    intent: 'REQUEST_WORKER',
    data: { skill, addressNote: text, description: text, whenText: text, jobType: longTerm ? 'LONG_TERM' : scheduled ? 'SCHEDULED' : 'ON_DEMAND' },
  };
}

export async function extractIntent(transcript: string, role: Role, lang: LangCode): Promise<VoiceIntent> {
  const text = transcript.trim();
  if (!text) return { intent: 'UNKNOWN' };
  try {
    const fromLlm = await askLlm(text, role, lang);
    if (fromLlm) return fromLlm;
  } catch (err) {
    console.error('[extract] LLM failed, using fallback', err);
  }
  return ruleBasedExtract(text, role);
}
