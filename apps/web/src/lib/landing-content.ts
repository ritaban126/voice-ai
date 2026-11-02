import {
  CalendarRange,
  Clock,
  Droplet,
  HeartPulse,
  Hammer,
  Languages,
  Navigation,
  PaintRoller,
  PlugZap,
  Scissors,
  ShieldCheck,
  Sparkles,
  SprayCan,
  Wallet,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export type Photo = {
  src: string;
  alt: string;
};

export type Service = {
  id: string;
  name: string;
  icon: LucideIcon;
  blurb: string;
  startingPrice: string;
  photo: Photo;
};

export type Step = {
  title: string;
  body: string;
};

export type ChatMessage = {
  from: 'you' | 'kaambol';
  text: string;
  note?: string;
};

export type Worker = {
  name: string;
  initials: string;
  skill: string;
  rating: number;
  jobs: number;
  distance: string;
  eta: string;
  price: string;
  area: string;
};

export type PriceItem = {
  job: string;
  price: string;
};

export type BookingMode = {
  title: string;
  label: string;
  body: string;
  icon: LucideIcon;
};

export type Quote = {
  text: string;
  name: string;
  role: string;
  initials: string;
};

export type LanguageSample = {
  code: string;
  language: string;
  native: string;
  phrase: string;
  meaning: string;
};

export const brand = {
  name: 'KaamBol',
  tagline: 'Bolo, kaam pao.',
  loginHref: '/login',
  signupHref: '/signup',
};

export const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'For workers', href: '#for-workers' },
];

export const heroContent = {
  eyebrow: 'Voice booking for home services',
  headline: 'Bolo, kaam pao.',
  subhead:
    'Tell us what broke in your own words. We find the nearest verified worker, show them on a map, and book in one tap.',
  micPrompt: 'Tap and speak. Hindi, Bengali, Tamil or English.',
  primaryCta: 'Book by voice',
  secondaryCta: 'See how it works',
  examples: [
    'Geyser kaam nahi kar raha',
    'Kal subah maid chahiye',
    'Bathroom ka nal tapak raha hai',
  ],
  photo: {
    src: 'https://images.pexels.com/photos/37330105/pexels-photo-37330105.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    alt: 'A senior Indian woman cooking in her bright home kitchen',
  },
};

export const trustPoints: { label: string; icon: LucideIcon }[] = [
  { label: 'Identity-checked workers', icon: ShieldCheck },
  { label: 'Four languages, and mixing them', icon: Languages },
  { label: 'Live location while they travel', icon: Navigation },
  { label: 'Pay by UPI QR or cash', icon: Wallet },
];

export const services: Service[] = [
  {
    id: 'plumber',
    name: 'Plumber',
    icon: Droplet,
    blurb: 'Leaking tap, geyser, blocked drain, water tank',
    startingPrice: 'from ₹149',
    photo: {
      src: 'https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Close-up of a plumber fitting steel pipes indoors',
    },
  },
  {
    id: 'electrician',
    name: 'Electrician',
    icon: PlugZap,
    blurb: 'Fan, switch, MCB trip, meter box, wiring',
    startingPrice: 'from ₹129',
    photo: {
      src: 'https://images.pexels.com/photos/9679179/pexels-photo-9679179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Technician working inside an electrical circuit breaker panel',
    },
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: Hammer,
    blurb: 'Door lock, cupboard, bed repair, wardrobe',
    startingPrice: 'from ₹199',
    photo: {
      src: 'https://images.pexels.com/photos/19127913/pexels-photo-19127913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Senior carpenter working with hand tools in a workshop',
    },
  },
  {
    id: 'painter',
    name: 'Painter',
    icon: PaintRoller,
    blurb: 'Room repaint, wall touch-up, damp patches',
    startingPrice: 'from ₹899 a room',
    photo: {
      src: 'https://images.pexels.com/photos/13714499/pexels-photo-13714499.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Worker painting the exterior wall of a building',
    },
  },
  {
    id: 'cleaning',
    name: 'Cleaning & Disinfection',
    icon: SprayCan,
    blurb: 'Deep clean, sofa and mattress, anti-germ spray',
    startingPrice: 'from ₹499',
    photo: {
      src: 'https://images.pexels.com/photos/5591900/pexels-photo-5591900.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Woman wiping a glass table with a cleaning spray',
    },
  },
  {
    id: 'maid',
    name: 'Maid',
    icon: Sparkles,
    blurb: 'Daily cooking, cleaning, utensils, laundry',
    startingPrice: 'from ₹2,400 a month',
    photo: {
      src: 'https://images.pexels.com/photos/9462663/pexels-photo-9462663.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Uniformed housekeeper holding cleaning supplies',
    },
  },
  {
    id: 'nurse',
    name: 'Nurse (Aya)',
    icon: HeartPulse,
    blurb: 'Elderly care, baby care, post-surgery help',
    startingPrice: 'from ₹3,500 a month',
    photo: {
      src: 'https://images.pexels.com/photos/8527647/pexels-photo-8527647.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Caregiver sitting beside an elderly person in bed',
    },
  },
  {
    id: 'salon',
    name: 'Salon at Home',
    icon: Scissors,
    blurb: 'Haircut, facial, threading, bridal makeup',
    startingPrice: 'from ₹249',
    photo: {
      src: 'https://images.pexels.com/photos/8834079/pexels-photo-8834079.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Hairdresser giving a haircut to a senior woman',
    },
  },
];

export const chatSample: ChatMessage[] = [
  {
    from: 'you',
    text: 'Bathroom ka geyser kaam nahi kar raha, aaj raat tak chahiye. Indiranagar, 100 feet road.',
    note: 'Spoken in Hinglish',
  },
  {
    from: 'kaambol',
    text: 'Samjha. Geyser repair, Indiranagar, aaj raat 8 baje ke aaspaas. Ravi Kumar sabse paas hain, 1.2 km door. Price ₹349. Book karun?',
  },
  {
    from: 'you',
    text: 'Haan, kar do.',
  },
  {
    from: 'kaambol',
    text: 'Booked. Ravi aapke ghar ki taraf nikal chuke hain. Live location aapke phone pe dikhegi.',
  },
];

export const howItWorks: Step[] = [
  {
    title: 'Speak',
    body: 'Tap the mic and say what is wrong, where you are and when you need it. Mix languages if you like.',
  },
  {
    title: 'Get the nearest worker',
    body: 'We pick the closest verified worker who does this job and show them on a map with distance, rating and price.',
  },
  {
    title: 'Track, then pay',
    body: 'Watch them travel to your home. Pay by UPI QR or cash and get a receipt, for you and for them.',
  },
];

export const featuredWorker: Worker = {
  name: 'Ravi Kumar',
  initials: 'RK',
  skill: 'Plumber and geyser expert',
  rating: 4.9,
  jobs: 312,
  distance: '1.2 km away',
  eta: 'Reaches in about 9 min',
  price: '₹349',
  area: 'Indiranagar, Bengaluru',
};

export const trackingSteps = [
  { label: 'Booked', time: '6:42 pm', done: true },
  { label: 'Ravi left his place', time: '6:50 pm', done: true },
  { label: 'Arriving at your door', time: '7:02 pm', done: false },
  { label: 'Work done, UPI QR shown', time: '', done: false },
];

export const bookingModes: BookingMode[] = [
  {
    title: 'Book now',
    label: 'Instant',
    body: 'Tap leaking at 10 pm? We send the nearest free worker right away.',
    icon: Zap,
  },
  {
    title: 'Pick a time',
    label: 'Scheduled',
    body: 'Book for tomorrow morning at 8. Both of you get a reminder before the visit.',
    icon: Clock,
  },
  {
    title: 'Hire for a month',
    label: 'Long-term',
    body: 'A maid or aya who comes at the same hours every day, for one month, six months or longer. One monthly bill.',
    icon: CalendarRange,
  },
];

export const inspectionSteps: Step[] = [
  {
    title: 'Worker visits',
    body: 'For wiring or plumbing problems, a visit comes first. The visit fee is ₹99.',
  },
  {
    title: 'You get a clear quote',
    body: 'The worker explains the problem and sends an itemised quote in your language.',
  },
  {
    title: 'You approve, then work starts',
    body: 'Nothing gets done until you say yes. The ₹99 visit fee is taken off the final bill.',
  },
];

export const smallJobPrices: PriceItem[] = [
  { job: 'Tap or valve washer change', price: '₹149' },
  { job: 'Switch or socket repair', price: '₹129' },
  { job: 'Ceiling fan fitting', price: '₹199' },
  { job: 'Door lock fix', price: '₹249' },
  { job: 'Blocked sink or drain clearing', price: '₹299' },
];

export const paymentPoints = [
  {
    title: 'Pay by UPI QR',
    body: 'Scan the code the worker shows on their phone. Money goes straight to them.',
  },
  {
    title: 'Or pay cash',
    body: 'Prefer cash? Mark it in the app and both of you get the same receipt.',
  },
  {
    title: 'A record for both sides',
    body: 'Customers see every receipt. Workers see every rupee they have earned, in one place.',
  },
];

export const audiences = {
  customer: {
    eyebrow: 'For customers',
    title: 'Something at home needs fixing?',
    body: 'Describe it in 30 seconds. See who is nearest on the map and confirm before you pay anything.',
    points: [
      'Speak the problem, no typing',
      'See price and distance before booking',
      'Pay by UPI or cash, with a receipt',
    ],
    cta: 'Book by voice',
    photo: {
      src: 'https://images.pexels.com/photos/14224902/pexels-photo-14224902.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'A mother and children together in a traditional kitchen',
    },
  },
  worker: {
    eyebrow: 'For workers',
    title: 'Want nearby work without the phone calls?',
    body: 'Tell us your skill and your area. Jobs near you come to your phone, and you accept them by voice.',
    points: [
      'Accept or decline jobs hands-free',
      'Jobs only from your neighbourhood',
      'Get paid by UPI, see every payment',
    ],
    cta: 'Join as a worker',
    photo: {
      src: 'https://images.pexels.com/photos/9491824/pexels-photo-9491824.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      alt: 'Construction worker in a hard hat smiling in front of a brick wall',
    },
  },
};

export const longTermPhoto: Photo = {
  src: 'https://images.pexels.com/photos/9462321/pexels-photo-9462321.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  alt: 'A housekeeper neatly making a bed in a bright bedroom',
};

export const quotes: Quote[] = [
  {
    text: 'The tap was dripping at 10 pm. I said it out loud, and a plumber was at my door in 40 minutes. I did not type a single word.',
    name: 'Sunita Devi',
    role: 'Customer, Koramangala',
    initials: 'SD',
  },
  {
    text: 'My mother needed an aya for six months. The same person came every evening, and we paid one bill at the end of the month.',
    name: 'Arjun Nair',
    role: 'Customer, Chennai',
    initials: 'AN',
  },
  {
    text: 'I do not read every message anymore. I tell the app what I can do, and the next job comes to my phone near my house.',
    name: 'Mohammed Iqbal',
    role: 'Electrician, Kolkata',
    initials: 'MI',
  },
  {
    text: 'I used to spend my mornings calling clients. Now my day fills up by voice, and I get paid by UPI the same day.',
    name: 'Kavitha R.',
    role: 'Salon at home, Chennai',
    initials: 'KR',
  },
];

export const languageSamples: LanguageSample[] = [
  {
    code: 'hi',
    language: 'Hindi',
    native: 'हिन्दी',
    phrase: 'Kal subah 8 baje maid chahiye',
    meaning: 'Need a maid tomorrow at 8 am',
  },
  {
    code: 'bn',
    language: 'Bengali',
    native: 'বাংলা',
    phrase: 'Bathroom er kol kharap, ekhuni dekhte hobe',
    meaning: 'Bathroom tap is broken, need someone now',
  },
  {
    code: 'ta',
    language: 'Tamil',
    native: 'தமிழ்',
    phrase: 'Fan work aagala, evening varuma?',
    meaning: 'Fan is not working, can someone come this evening?',
  },
  {
    code: 'en',
    language: 'English',
    native: 'English',
    phrase: 'Power socket is sparking, please check',
    meaning: 'Power socket sparks, needs an electrician',
  },
];

export const languageSwitcherOptions = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'hi', label: 'हि', name: 'Hindi' },
  { code: 'bn', label: 'বা', name: 'Bengali' },
  { code: 'ta', label: 'த', name: 'Tamil' },
] as const;

export const finalCta = {
  title: 'Got something that needs fixing?',
  body: 'Say it out loud. Your nearest verified worker will be on the map before your tea goes cold.',
  cta: 'Book by voice',
};

export const footerLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'For workers', href: '#for-workers' },
  { label: 'Log in', href: '/login' },
];
