import './env'; // must be first: loads DATABASE_URL
import { SKILL_IDS, SKILLS, suggestValue, type SkillId } from '@repo/shared';
import { db } from './client';
import { areas, user, workerProfiles, employerProfiles } from './schema';

// Coordinates are APPROXIMATE (demo only). Replace with real points for your city.
const AREAS = [
  { id: 'area_siliguri_town', name: 'Siliguri Town', lat: 26.7271, lng: 88.3953 },
  { id: 'area_pradhan_nagar', name: 'Pradhan Nagar', lat: 26.7150, lng: 88.4250 },
  { id: 'area_hakimpara', name: 'Hakimpara', lat: 26.7200, lng: 88.4150 },
  { id: 'area_sevoke_road', name: 'Sevoke Road', lat: 26.7050, lng: 88.4200 },
  { id: 'area_matigara', name: 'Matigara', lat: 26.7550, lng: 88.3800 },
  { id: 'area_champasari', name: 'Champasari', lat: 26.7000, lng: 88.3700 },
];

const NAMES = [
  'Ramesh', 'Sunil', 'Mohan', 'Dipak', 'Anwar', 'Kartik', 'Suman', 'Rafiq', 'Biswajit', 'Prakash',
  'Sita', 'Laxmi', 'Rina', 'Meena', 'Kavita', 'Joseph', 'Amit', 'Rakesh', 'Pooja', 'Nandini',
];

// Small deterministic random generator so every seed run gives the same data.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function main() {
  const rand = rng(42);
  await db.insert(areas).values(AREAS).onConflictDoNothing();

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');

  // 20 demo workers, skills spread across all 8 services
  for (let i = 0; i < NAMES.length; i++) {
    const n = pad(i + 1);
    const skill = SKILL_IDS[i % SKILL_IDS.length] as SkillId;
    const area = AREAS[i % AREAS.length]!;
    const longTerm = SKILLS[skill].mode === 'LONG_TERM';
    const userId = `seed_worker_${n}`;

    await db.insert(user).values({
      id: userId,
      name: NAMES[i]!,
      email: `seed${n}@phone.kaambol.local`,
      emailVerified: true,
      phoneNumber: `+91900000${pad(i + 1).padStart(4, '0')}`,
      phoneNumberVerified: true,
      role: 'WORKER',
      lang: ['hi', 'bn', 'ta', 'en'][i % 4]!,
    }).onConflictDoNothing();

    await db.insert(workerProfiles).values({
      id: `seed_wp_${n}`,
      userId,
      profileStatus: 'READY',
      skills: [skill],
      areaId: area.id,
      lat: area.lat + (rand() - 0.5) * 0.04, // about 2 km spread
      lng: area.lng + (rand() - 0.5) * 0.04,
      serviceCharge: longTerm ? 0 : suggestValue(skill, 'serviceCharge') ?? 0,
      dailyRate: longTerm ? null : suggestValue(skill, 'dailyRate'),
      expectedSalary: longTerm ? suggestValue(skill, 'monthlySalary') : null,
      available: rand() > 0.15,
      ratingAvg: Math.round((3.6 + rand() * 1.4) * 10) / 10,
      ratingCount: Math.floor(5 + rand() * 40),
      originalTranscript: `Main ${SKILLS[skill].label} hoon, ${area.name} mein.`,
    }).onConflictDoNothing();
  }

  // 1 demo employer
  await db.insert(user).values({
    id: 'seed_employer_01',
    name: 'Anita',
    email: 'seed_employer@phone.kaambol.local',
    emailVerified: true,
    phoneNumber: '+919000000100',
    phoneNumberVerified: true,
    role: 'EMPLOYER',
    lang: 'hi',
  }).onConflictDoNothing();
  await db.insert(employerProfiles).values({
    id: 'seed_ep_01',
    userId: 'seed_employer_01',
    profileStatus: 'READY',
    lat: AREAS[0]!.lat,
    lng: AREAS[0]!.lng,
    addressNote: 'Durgachowk mor ke samne safed ghar',
  }).onConflictDoNothing();

  console.log(`Seeded ${AREAS.length} areas, ${NAMES.length} workers, 1 employer (${now.toISOString()})`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});