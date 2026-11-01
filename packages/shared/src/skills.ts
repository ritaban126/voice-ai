// First-version services. Add a skill here and everything else (schemas, price bands, matching) picks it up.
export const SKILL_IDS = [
  'plumber',
  'electrician',
  'carpenter',
  'painter',
  'cleaning', // Cleaning & Disinfection
  'maid',
  'nurse', // Nurse (Aya)
  'salon', // Salon at Home
] as const;
export type SkillId = (typeof SKILL_IDS)[number];

export type SkillMode = 'ON_DEMAND' | 'LONG_TERM';
// INSPECTION_NEEDED: worker visits first (visit charge), then sends a quote the employer approves.
export type SkillPricing = 'FIXED' | 'INSPECTION_NEEDED';

export interface SkillDef {
  id: SkillId;
  label: string;
  icon: string; // lucide-react icon name
  mode: SkillMode;
  pricing: SkillPricing;
  synonyms: string[]; // fallback keyword match; the LLM does the main normalising
}

export const SKILLS: Record<SkillId, SkillDef> = {
  plumber: {
    id: 'plumber', label: 'Plumber', icon: 'Wrench', mode: 'ON_DEMAND', pricing: 'INSPECTION_NEEDED',
    synonyms: ['plumber', 'plumbing', 'nal wala', 'nalwala', 'pipe wala', 'pipe', 'प्लंबर', 'नल', 'पाइप', 'প্লাম্বার', 'নল', 'পাইপ', 'பிளம்பர்', 'குழாய்'],
  },
  electrician: {
    id: 'electrician', label: 'Electrician', icon: 'Zap', mode: 'ON_DEMAND', pricing: 'INSPECTION_NEEDED',
    synonyms: ['electrician', 'electric', 'bijli', 'wiring', 'meter box', 'mcb', 'fuse', 'इलेक्ट्रीशियन', 'बिजली', 'ইলেকট্রিশিয়ান', 'বিদ্যুৎ', 'বিজলি', 'எலக்ட்ரீஷியன்', 'மின்சாரம்'],
  },
  carpenter: {
    id: 'carpenter', label: 'Carpenter', icon: 'Hammer', mode: 'ON_DEMAND', pricing: 'INSPECTION_NEEDED',
    synonyms: ['carpenter', 'carpentry', 'furniture', 'badhai', 'बढ़ई', 'कारपेंटर', 'কাঠমিস্ত্রি', 'ছুতার', 'தச்சர்'],
  },
  painter: {
    id: 'painter', label: 'Painter', icon: 'PaintRoller', mode: 'ON_DEMAND', pricing: 'INSPECTION_NEEDED',
    synonyms: ['painter', 'paint', 'पेंटर', 'पेंट', 'रंगाई', 'পেইন্টার', 'রঙ', 'பெயிண்டர்'],
  },
  cleaning: {
    id: 'cleaning', label: 'Cleaning & Disinfection', icon: 'SprayCan', mode: 'ON_DEMAND', pricing: 'FIXED',
    synonyms: ['cleaning', 'cleaner', 'disinfection', 'sanitize', 'sanitization', 'safai', 'सफाई', 'डिसइन्फेक्शन', 'পরিষ্কার', 'ক্লিনিং', 'சுத்தம்', 'கிளீனிங்'],
  },
  maid: {
    id: 'maid', label: 'Maid', icon: 'Home', mode: 'LONG_TERM', pricing: 'FIXED',
    synonyms: ['maid', 'housemaid', 'kaamwali', 'kaam wali', 'मेड', 'कामवाली', 'কাজের মাসি', 'ঝি', 'வேலைக்காரி', 'பணிப்பெண்'],
  },
  nurse: {
    id: 'nurse', label: 'Nurse (Aya)', icon: 'HeartPulse', mode: 'LONG_TERM', pricing: 'FIXED',
    synonyms: ['nurse', 'nursing', 'aya', 'aaya', 'patient care', 'नर्स', 'आया', 'নার্স', 'আয়া', 'நர்ஸ்', 'ஆயா'],
  },
  salon: {
    id: 'salon', label: 'Salon at Home', icon: 'Scissors', mode: 'ON_DEMAND', pricing: 'FIXED',
    synonyms: ['salon', 'parlour', 'parlor', 'beautician', 'haircut', 'facial', 'waxing', 'सैलून', 'पार्लर', 'ब्यूटीशियन', 'সেলুন', 'পার্লার', 'বিউটিশিয়ান', 'சலூன்'],
  },
};

export const isLongTerm = (id: SkillId) => SKILLS[id].mode === 'LONG_TERM';
export const needsInspection = (id: SkillId) => SKILLS[id].pricing === 'INSPECTION_NEEDED';

const isAscii = (s: string) => /^[\x00-\x7F]+$/.test(s);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Cheap keyword fallback when the LLM returns nothing usable.
export function detectSkill(text: string): SkillId | null {
  const t = text.toLowerCase();
  for (const id of SKILL_IDS) {
    const hit = SKILLS[id].synonyms.some((syn) =>
      isAscii(syn) ? new RegExp(`\\b${escapeRe(syn)}\\b`, 'i').test(t) : t.includes(syn),
    );
    if (hit) return id;
  }
  return null;
}