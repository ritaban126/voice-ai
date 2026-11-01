// import type { LangCode } from './languages';
// import type { Role } from './orderStatus';

// // Everything the AI says. Fixed templates keep replies fast, cheap to speak (audio can be cached) and predictable.
// // Native script is used on purpose so text-to-speech pronounces it properly.
// export const REPLIES = {
//   // Signup, last step: what to say into the mic
//   micGuideWorker: {
//     en: 'Tap the mic and tell me what work you do, where you live, and your service charge. For example: I am a plumber, I live near Durgachowk, my visit charge is 100 rupees.',
//     hi: 'माइक दबाकर बताइए कि आप कौन सा काम करते हैं, कहाँ रहते हैं और आपका सर्विस चार्ज कितना है। जैसे: मैं प्लंबर हूँ, दुर्गाचौक के पास रहता हूँ, मेरा विज़िट चार्ज 100 रुपये है।',
//     bn: 'মাইক চেপে বলুন আপনি কী কাজ করেন, কোথায় থাকেন এবং আপনার সার্ভিস চার্জ কত। যেমন: আমি প্লাম্বার, দুর্গাচকের কাছে থাকি, আমার ভিজিট চার্জ ১০০ টাকা।',
//     ta: 'மைக்கை அழுத்தி நீங்கள் என்ன வேலை செய்கிறீர்கள், எங்கே இருக்கிறீர்கள், உங்கள் சேவைக் கட்டணம் எவ்வளவு என்று சொல்லுங்கள். உதாரணம்: நான் பிளம்பர், துர்காசௌக் அருகில் இருக்கிறேன், என் விசிட் கட்டணம் 100 ரூபாய்.',
//   },
//   micGuideEmployer: {
//     en: 'Tap the mic and tell me what work you need and where your home is. For example: I need a plumber, white house opposite Durgachowk mor, right now.',
//     hi: 'माइक दबाकर बताइए कि आपको कौन सा काम करवाना है और आपका घर कहाँ है। जैसे: मुझे प्लंबर चाहिए, दुर्गाचौक मोड़ के सामने सफ़ेद घर, अभी।',
//     bn: 'মাইক চেপে বলুন কোন কাজের জন্য লোক লাগবে এবং আপনার বাড়ি কোথায়। যেমন: আমার একজন প্লাম্বার লাগবে, দুর্গাচক মোড়ের সামনে সাদা বাড়ি, এখনই।',
//     ta: 'மைக்கை அழுத்தி உங்களுக்கு என்ன வேலைக்கு ஆள் வேண்டும், உங்கள் வீடு எங்கே என்று சொல்லுங்கள். உதாரணம்: எனக்கு ஒரு பிளம்பர் வேண்டும், துர்காசௌக் மோட்டின் எதிரே வெள்ளை வீடு, இப்போதே.',
//   },
//   // After the first voice input
//   accountCreatedWorker: {
//     en: 'Your account is ready. You can now find work on this app.',
//     hi: 'आपका अकाउंट बन गया है। अब आप इस ऐप से काम ढूँढ सकते हैं।',
//     bn: 'আপনার অ্যাকাউন্ট তৈরি হয়ে গেছে। এখন আপনি এই অ্যাপ থেকে কাজ খুঁজতে পারবেন।',
//     ta: 'உங்கள் கணக்கு உருவாக்கப்பட்டது. இப்போது இந்த ஆப் மூலம் வேலை தேடலாம்.',
//   },
//   accountCreatedEmployer: {
//     en: 'Your account is ready. Tell me what work you need.',
//     hi: 'आपका अकाउंट बन गया है। बताइए आपको कौन सा काम करवाना है।',
//     bn: 'আপনার অ্যাকাউন্ট তৈরি হয়ে গেছে। বলুন কোন কাজ করাতে চান।',
//     ta: 'உங்கள் கணக்கு உருவாக்கப்பட்டது. உங்களுக்கு என்ன வேலை வேண்டும் என்று சொல்லுங்கள்.',
//   },
//   // Employer order flow
//   orderSearching: {
//     en: 'Your order is confirmed. Please wait a minute while I find a worker very close to you.',
//     hi: 'आपका ऑर्डर कन्फर्म हो गया है। एक मिनट रुकिए, मैं आपके बहुत नज़दीक कोई वर्कर ढूँढकर बताता हूँ।',
//     bn: 'আপনার অর্ডার কনফার্ম হয়েছে। এক মিনিট অপেক্ষা করুন, আমি আপনার খুব কাছের একজন কর্মী খুঁজে দিচ্ছি।',
//     ta: 'உங்கள் ஆர்டர் உறுதியானது. ஒரு நிமிடம் காத்திருங்கள், உங்களுக்கு மிக அருகில் உள்ள ஒருவரைத் தேடிச் சொல்கிறேன்.',
//   },
//   workersFound: {
//     en: 'Here is your worker. Please check the details on the map.',
//     hi: 'ये रहा आपका वर्कर। मैप पर डिटेल्स देख लीजिए।',
//     bn: 'এই যে আপনার কর্মী। ম্যাপে বিবরণ দেখে নিন।',
//     ta: 'இதோ உங்கள் பணியாளர். வரைபடத்தில் விவரங்களைப் பாருங்கள்.',
//   },
//   orderAccepted: {
//     en: 'Your order is confirmed and the worker is coming to you. Please wait a little, you can watch on the map.',
//     hi: 'आपका ऑर्डर कन्फर्म हो गया है और वर्कर आपके पास आ रहा है। थोड़ी देर रुकिए, आप मैप पर देख सकते हैं।',
//     bn: 'আপনার অর্ডার কনফার্ম হয়েছে এবং কর্মী আপনার কাছে আসছেন। একটু অপেক্ষা করুন, ম্যাপে দেখতে পারবেন।',
//     ta: 'உங்கள் ஆர்டர் உறுதியானது, பணியாளர் உங்களிடம் வந்து கொண்டிருக்கிறார். சிறிது நேரம் காத்திருங்கள், வரைபடத்தில் பார்க்கலாம்.',
//   },
//   nextWorkers: {
//     en: 'Okay. You can check the next two or three workers and confirm.',
//     hi: 'ठीक है। आप अगले दो-तीन वर्कर देखकर कन्फर्म कर सकते हैं।',
//     bn: 'ঠিক আছে। আপনি পরের দু-তিনজন কর্মীকে দেখে কনফার্ম করতে পারেন।',
//     ta: 'சரி. அடுத்த இரண்டு மூன்று பணியாளர்களைப் பார்த்து உறுதி செய்யலாம்.',
//   },
//   noWorkerNow: {
//     en: 'No worker is available right now, but some are available tomorrow morning.',
//     hi: 'अभी कोई वर्कर उपलब्ध नहीं है, लेकिन कुछ कल सुबह उपलब्ध हैं।',
//     bn: 'এখন কেউ উপলব্ধ নেই, তবে কয়েকজন কাল সকালে পাওয়া যাবে।',
//     ta: 'இப்போது யாரும் இல்லை, ஆனால் சிலர் நாளை காலை கிடைப்பார்கள்.',
//   },
//   notUnderstood: {
//     en: 'Sorry, I could not understand. Please tap the mic and say it again.',
//     hi: 'माफ़ कीजिए, मैं समझ नहीं पाया। कृपया माइक दबाकर फिर से बोलिए।',
//     bn: 'দুঃখিত, আমি বুঝতে পারিনি। অনুগ্রহ করে মাইক চেপে আবার বলুন।',
//     ta: 'மன்னிக்கவும், எனக்குப் புரியவில்லை. மைக்கை அழுத்தி மீண்டும் சொல்லுங்கள்.',
//   },
// } as const satisfies Record<string, Record<LangCode, string>>;

// export type ReplyKey = keyof typeof REPLIES;

// export function reply(key: ReplyKey, lang: LangCode): string {
//   return REPLIES[key][lang] ?? REPLIES[key].en;
// }

// export const micGuideKey = (role: Role): ReplyKey =>
//   role === 'WORKER' ? 'micGuideWorker' : 'micGuideEmployer';

// export const accountCreatedKey = (role: Role): ReplyKey =>
//   role === 'WORKER' ? 'accountCreatedWorker' : 'accountCreatedEmployer';




import type { LangCode } from './languages';
import type { Role } from './orderStatus';

// Everything the AI says. Fixed templates keep replies fast, cheap to speak (audio can be cached) and predictable.
// Native script is used on purpose so text-to-speech pronounces it properly.
export const REPLIES = {
  // Signup, last step: what to say into the mic
  micGuideWorker: {
    en: 'Tap the mic and tell me what work you do, where you live, and your service charge. For example: I am a plumber, I live near Durgachowk, my visit charge is 100 rupees.',
    hi: 'माइक दबाकर बताइए कि आप कौन सा काम करते हैं, कहाँ रहते हैं और आपका सर्विस चार्ज कितना है। जैसे: मैं प्लंबर हूँ, दुर्गाचौक के पास रहता हूँ, मेरा विज़िट चार्ज 100 रुपये है।',
    bn: 'মাইক চেপে বলুন আপনি কী কাজ করেন, কোথায় থাকেন এবং আপনার সার্ভিস চার্জ কত। যেমন: আমি প্লাম্বার, দুর্গাচকের কাছে থাকি, আমার ভিজিট চার্জ ১০০ টাকা।',
    ta: 'மைக்கை அழுத்தி நீங்கள் என்ன வேலை செய்கிறீர்கள், எங்கே இருக்கிறீர்கள், உங்கள் சேவைக் கட்டணம் எவ்வளவு என்று சொல்லுங்கள். உதாரணம்: நான் பிளம்பர், துர்காசௌக் அருகில் இருக்கிறேன், என் விசிட் கட்டணம் 100 ரூபாய்.',
  },
  micGuideEmployer: {
    en: 'Tap the mic and tell me what work you need and where your home is. For example: I need a plumber, white house opposite Durgachowk mor, right now.',
    hi: 'माइक दबाकर बताइए कि आपको कौन सा काम करवाना है और आपका घर कहाँ है। जैसे: मुझे प्लंबर चाहिए, दुर्गाचौक मोड़ के सामने सफ़ेद घर, अभी।',
    bn: 'মাইক চেপে বলুন কোন কাজের জন্য লোক লাগবে এবং আপনার বাড়ি কোথায়। যেমন: আমার একজন প্লাম্বার লাগবে, দুর্গাচক মোড়ের সামনে সাদা বাড়ি, এখনই।',
    ta: 'மைக்கை அழுத்தி உங்களுக்கு என்ன வேலைக்கு ஆள் வேண்டும், உங்கள் வீடு எங்கே என்று சொல்லுங்கள். உதாரணம்: எனக்கு ஒரு பிளம்பர் வேண்டும், துர்காசௌக் மோட்டின் எதிரே வெள்ளை வீடு, இப்போதே.',
  },
  // After the first voice input
  accountCreatedWorker: {
    en: 'Your account is ready. You can now find work on this app.',
    hi: 'आपका अकाउंट बन गया है। अब आप इस ऐप से काम ढूँढ सकते हैं।',
    bn: 'আপনার অ্যাকাউন্ট তৈরি হয়ে গেছে। এখন আপনি এই অ্যাপ থেকে কাজ খুঁজতে পারবেন।',
    ta: 'உங்கள் கணக்கு உருவாக்கப்பட்டது. இப்போது இந்த ஆப் மூலம் வேலை தேடலாம்.',
  },
  accountCreatedEmployer: {
    en: 'Your account is ready. Tell me what work you need.',
    hi: 'आपका अकाउंट बन गया है। बताइए आपको कौन सा काम करवाना है।',
    bn: 'আপনার অ্যাকাউন্ট তৈরি হয়ে গেছে। বলুন কোন কাজ করাতে চান।',
    ta: 'உங்கள் கணக்கு உருவாக்கப்பட்டது. உங்களுக்கு என்ன வேலை வேண்டும் என்று சொல்லுங்கள்.',
  },
  // Employer order flow
  orderSearching: {
    en: 'Your order is confirmed. Please wait a minute while I find a worker very close to you.',
    hi: 'आपका ऑर्डर कन्फर्म हो गया है। एक मिनट रुकिए, मैं आपके बहुत नज़दीक कोई वर्कर ढूँढकर बताता हूँ।',
    bn: 'আপনার অর্ডার কনফার্ম হয়েছে। এক মিনিট অপেক্ষা করুন, আমি আপনার খুব কাছের একজন কর্মী খুঁজে দিচ্ছি।',
    ta: 'உங்கள் ஆர்டர் உறுதியானது. ஒரு நிமிடம் காத்திருங்கள், உங்களுக்கு மிக அருகில் உள்ள ஒருவரைத் தேடிச் சொல்கிறேன்.',
  },
  workersFound: {
    en: 'Here is your worker. Please check the details on the map.',
    hi: 'ये रहा आपका वर्कर। मैप पर डिटेल्स देख लीजिए।',
    bn: 'এই যে আপনার কর্মী। ম্যাপে বিবরণ দেখে নিন।',
    ta: 'இதோ உங்கள் பணியாளர். வரைபடத்தில் விவரங்களைப் பாருங்கள்.',
  },
  orderAccepted: {
    en: 'Your order is confirmed and the worker is coming to you. Please wait a little, you can watch on the map.',
    hi: 'आपका ऑर्डर कन्फर्म हो गया है और वर्कर आपके पास आ रहा है। थोड़ी देर रुकिए, आप मैप पर देख सकते हैं।',
    bn: 'আপনার অর্ডার কনফার্ম হয়েছে এবং কর্মী আপনার কাছে আসছেন। একটু অপেক্ষা করুন, ম্যাপে দেখতে পারবেন।',
    ta: 'உங்கள் ஆர்டர் உறுதியானது, பணியாளர் உங்களிடம் வந்து கொண்டிருக்கிறார். சிறிது நேரம் காத்திருங்கள், வரைபடத்தில் பார்க்கலாம்.',
  },
  nextWorkers: {
    en: 'Okay. You can check the next two or three workers and confirm.',
    hi: 'ठीक है। आप अगले दो-तीन वर्कर देखकर कन्फर्म कर सकते हैं।',
    bn: 'ঠিক আছে। আপনি পরের দু-তিনজন কর্মীকে দেখে কনফার্ম করতে পারেন।',
    ta: 'சரி. அடுத்த இரண்டு மூன்று பணியாளர்களைப் பார்த்து உறுதி செய்யலாம்.',
  },
  noWorkerNow: {
    en: 'No worker is available right now, but some are available tomorrow morning.',
    hi: 'अभी कोई वर्कर उपलब्ध नहीं है, लेकिन कुछ कल सुबह उपलब्ध हैं।',
    bn: 'এখন কেউ উপলব্ধ নেই, তবে কয়েকজন কাল সকালে পাওয়া যাবে।',
    ta: 'இப்போது யாரும் இல்லை, ஆனால் சிலர் நாளை காலை கிடைப்பார்கள்.',
  },
  notUnderstood: {
    en: 'Sorry, I could not understand. Please tap the mic and say it again.',
    hi: 'माफ़ कीजिए, मैं समझ नहीं पाया। कृपया माइक दबाकर फिर से बोलिए।',
    bn: 'দুঃখিত, আমি বুঝতে পারিনি। অনুগ্রহ করে মাইক চেপে আবার বলুন।',
    ta: 'மன்னிக்கவும், எனக்குப் புரியவில்லை. மைக்கை அழுத்தி மீண்டும் சொல்லுங்கள்.',
  },
  // Used by the API for worker profile / rate / availability changes
  profileUpdated: {
    en: 'Your profile is updated.',
    hi: 'आपकी प्रोफ़ाइल अपडेट हो गई है।',
    bn: 'আপনার প্রোফাইল আপডেট হয়েছে।',
    ta: 'உங்கள் சுயவிவரம் புதுப்பிக்கப்பட்டது.',
  },
  rateUpdated: {
    en: 'Your rate is updated. It will apply to new orders.',
    hi: 'आपका रेट अपडेट हो गया है। यह नए ऑर्डर पर लागू होगा।',
    bn: 'আপনার রেট আপডেট হয়েছে। এটি নতুন অর্ডারে প্রযোজ্য হবে।',
    ta: 'உங்கள் கட்டணம் புதுப்பிக்கப்பட்டது. இது புதிய ஆர்டர்களுக்குப் பொருந்தும்.',
  },
  availabilityOn: {
    en: 'Okay, you will now get new work offers.',
    hi: 'ठीक है, अब आपको नए काम मिलेंगे।',
    bn: 'ঠিক আছে, এখন আপনি নতুন কাজের অফার পাবেন।',
    ta: 'சரி, இனி புதிய வேலை வாய்ப்புகள் வரும்.',
  },
  availabilityOff: {
    en: 'Okay, you will not get new work offers for now.',
    hi: 'ठीक है, अभी आपको नए काम नहीं मिलेंगे।',
    bn: 'ঠিক আছে, এখন আপনি নতুন কাজের অফার পাবেন না।',
    ta: 'சரி, இப்போது புதிய வேலை வாய்ப்புகள் வராது.',
  },
  rateOutOfRange: {
    en: 'That rate is outside the allowed range for your work. Please say a different amount.',
    hi: 'यह रेट आपके काम की तय सीमा से बाहर है। कृपया कोई और रकम बोलिए।',
    bn: 'এই রেট আপনার কাজের অনুমোদিত সীমার বাইরে। অনুগ্রহ করে অন্য অঙ্ক বলুন।',
    ta: 'இந்தக் கட்டணம் உங்கள் வேலைக்கான அனுமதிக்கப்பட்ட வரம்புக்கு வெளியே உள்ளது. வேறு தொகையைச் சொல்லுங்கள்.',
  },
} as const satisfies Record<string, Record<LangCode, string>>;

export type ReplyKey = keyof typeof REPLIES;

export function reply(key: ReplyKey, lang: LangCode): string {
  return REPLIES[key][lang] ?? REPLIES[key].en;
}

export const micGuideKey = (role: Role): ReplyKey =>
  role === 'WORKER' ? 'micGuideWorker' : 'micGuideEmployer';

export const accountCreatedKey = (role: Role): ReplyKey =>
  role === 'WORKER' ? 'accountCreatedWorker' : 'accountCreatedEmployer';