import type { LanguageCode } from './languages';

export type TranslationKey =
  | 'appName'
  | 'appTagline'
  | 'chooseLanguage'
  | 'chooseLanguageSub'
  | 'continueBtn'
  | 'changeLanguage'
  | 'tabHome'
  | 'tabExplore'
  | 'tabJaap'
  | 'tabMandir'
  | 'tabProfile'
  | 'todayPanchang'
  | 'dailyStatus'
  | 'share'
  | 'mantraOfDay'
  | 'allMantras'
  | 'startJaap'
  | 'upcomingFestivals'
  | 'quickAccess'
  | 'deities'
  | 'exploreDevotion'
  | 'more'
  | 'pujaVidhi'
  | 'scriptures'
  | 'wallpapers'
  | 'rashifal'
  | 'stotrams'
  | 'ringtones'
  | 'temples'
  | 'festivalHub'
  | 'muhurat'
  | 'knowledge'
  | 'proudSanatani'
  | 'punyaPoints'
  | 'dayStreak'
  | 'totalJaaps'
  | 'favorites'
  | 'myFavorites'
  | 'account'
  | 'shareStatus'
  | 'shareHint'
  | 'luckyColor'
  | 'luckyNumber'
  | 'lightDiya'
  | 'offerFlower'
  | 'ringBell'
  | 'jaapCounter'
  | 'target108'
  | 'target1008'
  | 'reset'
  | 'complete'
  | 'famousTemples'
  | 'spiritualRingtones'
  | 'auspiciousTime'
  | 'brahmaMuhurat'
  | 'abhijitMuhurat'
  | 'rahuKaal'
  | 'goodFor'
  | 'avoid'
  | 'festivalPack'
  | 'viewPuja'
  | 'listen'
  | 'setRingtone'
  | 'comingSoon'
  | 'languageSaved'
  | 'all'
  | 'mantras'
  | 'aarti'
  | 'chalisa'
  | 'bhajan'
  | 'adFree'
  | 'removeAds'
  | 'removeAdsSub'
  | 'removeAdsCta'
  | 'restorePurchase'
  | 'purchaseThanks'
  | 'alreadyAdFree'
  | 'privacyOptions'
  | 'supportApp'
  | 'saveToGallery'
  | 'setAsWallpaper'
  | 'savedToGallery'
  | 'saveFailed'
  | 'ringtoneSaved'
  | 'openSoundSettings'
  | 'pause'
  | 'loadingLabel'
  | 'unavailable'
  | 'allContentFree';

type Translations = Record<TranslationKey, string>;

const hi: Translations = {
  allContentFree: 'सभी मंत्र, चालीसा और आरती हमेशा नि:शुल्क',
  removeAds: 'विज्ञापन हटाएँ',
  removeAdsSub: 'एक बार भुगतान करें, हमेशा के लिए विज्ञापन-मुक्त',
  removeAdsCta: 'विज्ञापन हटाएँ',
  restorePurchase: 'खरीद पुनर्स्थापित करें',
  purchaseThanks: 'धन्यवाद! अब कोई विज्ञापन नहीं दिखेगा।',
  alreadyAdFree: 'आपका ऐप विज्ञापन-मुक्त है',
  privacyOptions: 'विज्ञापन गोपनीयता सेटिंग्स',
  supportApp: 'ऐप का समर्थन करें',
  saveToGallery: 'गैलरी में सहेजें',
  setAsWallpaper: 'वॉलपेपर सेट करें',
  savedToGallery: 'गैलरी में सहेजा गया',
  saveFailed: 'सहेजने में विफल',
  ringtoneSaved: 'रिंगटोन डिवाइस में सहेजी गई',
  openSoundSettings: 'ध्वनि सेटिंग्स खोलें',
  pause: 'रोकें',
  loadingLabel: 'लोड हो रहा है…',
  unavailable: 'अभी उपलब्ध नहीं',
  appName: 'सनातनी भक्ति',
  appTagline: 'आपका दैनिक भक्ति साथी',
  chooseLanguage: 'अपनी भाषा चुनें',
  chooseLanguageSub: 'ऐप की सभी सामग्री आपकी भाषा में दिखेगी',
  continueBtn: 'आगे बढ़ें',
  changeLanguage: 'भाषा बदलें',
  tabHome: 'होम',
  tabExplore: 'एक्सप्लोर',
  tabJaap: 'जाप',
  tabMandir: 'मंदिर',
  tabProfile: 'प्रोफाइल',
  todayPanchang: 'आज का पंचांग',
  dailyStatus: 'दैनिक स्टेटस',
  share: 'शेयर करें',
  mantraOfDay: 'आज का मंत्र',
  allMantras: 'सभी मंत्र',
  startJaap: '108 जाप शुरू करें',
  upcomingFestivals: 'आने वाले त्योहार',
  quickAccess: 'त्वरित पहुँच',
  deities: 'देवता',
  exploreDevotion: 'भक्ति एक्सप्लोर करें',
  more: 'और देखें',
  pujaVidhi: 'पूजा विधि',
  scriptures: 'धर्मग्रंथ',
  wallpapers: 'वॉलपेपर',
  rashifal: 'राशिफल',
  stotrams: 'स्तोत्र',
  ringtones: 'रिंगटोन',
  temples: 'प्रसिद्ध मंदिर',
  festivalHub: 'त्योहार हब',
  muhurat: 'शुभ मुहूर्त',
  knowledge: 'दिव्य ज्ञान',
  proudSanatani: 'गर्व से सनातनी',
  punyaPoints: 'पुण्य अंक',
  dayStreak: 'दिन स्ट्रीक',
  totalJaaps: 'कुल जाप',
  favorites: 'पसंदीदा',
  myFavorites: 'मेरे पसंदीदा',
  account: 'खाता',
  shareStatus: 'शेयर करें',
  shareHint: 'भक्ति फैलाएँ — शेयर करने पर +5 पुण्य',
  luckyColor: 'शुभ रंग',
  luckyNumber: 'शुभ अंक',
  lightDiya: 'दीप जलाएँ',
  offerFlower: 'फूल चढ़ाएँ',
  ringBell: 'घंटी बजाएँ',
  jaapCounter: 'जाप काउंटर',
  target108: '108 जाप',
  target1008: '1008 जाप',
  reset: 'रीसेट',
  complete: 'पूर्ण!',
  famousTemples: 'प्रसिद्ध मंदिर',
  spiritualRingtones: 'आध्यात्मिक रिंगटोन',
  auspiciousTime: 'शुभ मुहूर्त',
  brahmaMuhurat: 'ब्रह्म मुहूर्त',
  abhijitMuhurat: 'अभिजित मुहूर्त',
  rahuKaal: 'राहु काल',
  goodFor: 'शुभ कार्यों के लिए',
  avoid: 'टालें',
  festivalPack: 'त्योहार पैक',
  viewPuja: 'पूजा विधि देखें',
  listen: 'सुनें',
  setRingtone: 'रिंगटोन सेट करें',
  comingSoon: 'जल्द आ रहा है',
  languageSaved: 'भाषा सहेजी गई',
  all: 'सभी',
  mantras: 'मंत्र',
  aarti: 'आरती',
  chalisa: 'चालीसा',
  bhajan: 'भजन',
  adFree: 'विज्ञापन-मुक्त प्रार्थना',
};

const en: Translations = {
  allContentFree: 'All mantras, chalisa and aarti are free, always',
  removeAds: 'Remove Ads',
  removeAdsSub: 'One-time payment. No ads, ever again.',
  removeAdsCta: 'Remove Ads',
  restorePurchase: 'Restore purchase',
  purchaseThanks: 'Thank you! Ads are now removed.',
  alreadyAdFree: 'Your app is ad-free',
  privacyOptions: 'Ad privacy settings',
  supportApp: 'Support the app',
  saveToGallery: 'Save to gallery',
  setAsWallpaper: 'Set as wallpaper',
  savedToGallery: 'Saved to your gallery',
  saveFailed: 'Could not save',
  ringtoneSaved: 'Ringtone saved to your device',
  openSoundSettings: 'Open sound settings',
  pause: 'Pause',
  loadingLabel: 'Loading…',
  unavailable: 'Not available yet',
  appName: 'Sanatani Bhakti',
  appTagline: 'Your daily devotional companion',
  chooseLanguage: 'Choose Your Language',
  chooseLanguageSub: 'All app content will appear in your language',
  continueBtn: 'Continue',
  changeLanguage: 'Change Language',
  tabHome: 'Home',
  tabExplore: 'Explore',
  tabJaap: 'Jaap',
  tabMandir: 'Mandir',
  tabProfile: 'Profile',
  todayPanchang: "Today's Panchang",
  dailyStatus: 'Daily Status',
  share: 'Share',
  mantraOfDay: 'Mantra of the Day',
  allMantras: 'All Mantras',
  startJaap: 'Start 108 Jaap',
  upcomingFestivals: 'Upcoming Festivals',
  quickAccess: 'Quick Access',
  deities: 'Deities',
  exploreDevotion: 'Explore Devotion',
  more: 'More',
  pujaVidhi: 'Puja Vidhi',
  scriptures: 'Scriptures',
  wallpapers: 'Wallpapers',
  rashifal: 'Rashifal',
  stotrams: 'Stotrams',
  ringtones: 'Ringtones',
  temples: 'Famous Temples',
  festivalHub: 'Festival Hub',
  muhurat: 'Muhurat',
  knowledge: 'Divine Knowledge',
  proudSanatani: 'Proud Sanatani',
  punyaPoints: 'Punya Points',
  dayStreak: 'Day Streak',
  totalJaaps: 'Total Jaaps',
  favorites: 'Favorites',
  myFavorites: 'My Favorites',
  account: 'Account',
  shareStatus: 'Share',
  shareHint: 'Spread devotion — +5 Punya for sharing',
  luckyColor: 'Lucky color',
  luckyNumber: 'Lucky number',
  lightDiya: 'Light Diya',
  offerFlower: 'Offer Flower',
  ringBell: 'Ring Bell',
  jaapCounter: 'Jaap Counter',
  target108: '108 Jaap',
  target1008: '1008 Jaap',
  reset: 'Reset',
  complete: 'Complete!',
  famousTemples: 'Famous Temples',
  spiritualRingtones: 'Spiritual Ringtones',
  auspiciousTime: 'Auspicious Time',
  brahmaMuhurat: 'Brahma Muhurat',
  abhijitMuhurat: 'Abhijit Muhurat',
  rahuKaal: 'Rahu Kaal',
  goodFor: 'Good for',
  avoid: 'Avoid',
  festivalPack: 'Festival Pack',
  viewPuja: 'View Puja Guide',
  listen: 'Listen',
  setRingtone: 'Set as Ringtone',
  comingSoon: 'Coming soon',
  languageSaved: 'Language saved',
  all: 'All',
  mantras: 'Mantras',
  aarti: 'Aarti',
  chalisa: 'Chalisa',
  bhajan: 'Bhajan',
  adFree: 'Ad-free prayer experience',
};

const ta: Translations = {
  ...en,
  appName: 'சனாதனி பக்தி',
  appTagline: 'உங்கள் தினசரி பக்தி துணை',
  chooseLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
  chooseLanguageSub: 'பயன்பாட்டின் அனைத்து உள்ளடக்கமும் உங்கள் மொழியில் தோன்றும்',
  continueBtn: 'தொடரவும்',
  changeLanguage: 'மொழியை மாற்றவும்',
  tabHome: 'முகப்பு',
  tabExplore: 'ஆராயுங்கள்',
  tabJaap: 'ஜபம்',
  tabMandir: 'கோவில்',
  tabProfile: 'சுயவிவரம்',
  todayPanchang: 'இன்றைய பஞ்சாங்கம்',
  dailyStatus: 'தினசரி நிலை',
  mantraOfDay: 'இன்றைய மந்திரம்',
  startJaap: '108 ஜபம் தொடங்குங்கள்',
  upcomingFestivals: 'வரவிருக்கும் திருவிழாக்கள்',
  quickAccess: 'விரைவு அணுகல்',
  deities: 'தெய்வங்கள்',
  pujaVidhi: 'பூஜை முறை',
  scriptures: 'நூல்கள்',
  rashifal: 'ராசிபலன்',
  stotrams: 'ஸ்தோத்திரங்கள்',
  ringtones: 'ரிங்டோன்கள்',
  temples: 'பிரபலமான கோவில்கள்',
  festivalHub: 'திருவிழா மையம்',
  muhurat: 'சுப முகூர்த்தம்',
  knowledge: 'தெய்வீக அறிவு',
  proudSanatani: 'பெருமையான சனாதனி',
  punyaPoints: 'புண்ய புள்ளிகள்',
  dayStreak: 'நாள் தொடர்',
  totalJaaps: 'மொத்த ஜபம்',
  shareStatus: 'பகிரவும்',
  lightDiya: 'தீபம் ஏற்றுங்கள்',
  offerFlower: 'மலர் சமர்ப்பிக்கவும்',
  ringBell: 'மணி அடிக்கவும்',
  jaapCounter: 'ஜப கணக்கி',
};

const te: Translations = {
  ...en,
  appName: 'సనాతని భక్తి',
  appTagline: 'మీ రోజువారీ భక్తి సహచరుడు',
  chooseLanguage: 'మీ భాషను ఎంచుకోండి',
  chooseLanguageSub: 'యాప్ మొత్తం మీ భాషలో కనిపిస్తుంది',
  continueBtn: 'కొనసాగించు',
  changeLanguage: 'భాష మార్చు',
  tabHome: 'హోమ్',
  tabExplore: 'అన్వేషించు',
  tabJaap: 'జపం',
  tabMandir: 'మందిరం',
  tabProfile: 'ప్రొఫైల్',
  todayPanchang: 'నేటి పంచాంగం',
  dailyStatus: 'రోజువారీ స్టేటస్',
  mantraOfDay: 'నేటి మంత్రం',
  startJaap: '108 జపం ప్రారంభించు',
  upcomingFestivals: 'రాబోయే పండుగలు',
  quickAccess: 'త్వరిత యాక్సెస్',
  deities: 'దేవతలు',
  pujaVidhi: 'పూజా విధి',
  scriptures: 'ధర్మ గ్రంథాలు',
  rashifal: 'రాశిఫలం',
  stotrams: 'స్తోత్రాలు',
  ringtones: 'రింగ్‌టోన్లు',
  temples: 'ప్రసిద్ధ దేవాలయాలు',
  festivalHub: 'పండుగ హబ్',
  muhurat: 'శుభ ముహూర్తం',
  knowledge: 'దివ్య జ్ఞానం',
  proudSanatani: 'గర్వంగా సనాతని',
  punyaPoints: 'పుణ్య పాయింట్లు',
  dayStreak: 'రోజు స్ట్రీక్',
  totalJaaps: 'మొత్తం జపాలు',
  shareStatus: 'షేర్ చేయండి',
  lightDiya: 'దీపం వెలిగించు',
  offerFlower: 'పువ్వు అర్పించు',
  ringBell: 'గంట మోగించు',
  jaapCounter: 'జప కౌంటర్',
};

const mr: Translations = {
  ...en,
  appName: 'सनातनी भक्ती',
  appTagline: 'तुमचा दैनंदिन भक्ती साथी',
  chooseLanguage: 'तुमची भाषा निवडा',
  chooseLanguageSub: 'अॅपची सर्व सामग्री तुमच्या भाषेत दिसेल',
  continueBtn: 'पुढे जा',
  changeLanguage: 'भाषा बदला',
  tabHome: 'होम',
  tabExplore: 'एक्सप्लोर',
  tabJaap: 'जप',
  tabMandir: 'मंदिर',
  tabProfile: 'प्रोफाइल',
  todayPanchang: 'आजचे पंचांग',
  dailyStatus: 'दैनिक स्टेटस',
  mantraOfDay: 'आजचा मंत्र',
  startJaap: '108 जप सुरू करा',
  upcomingFestivals: 'येणारे सण',
  quickAccess: 'जलद प्रवेश',
  deities: 'देवता',
  pujaVidhi: 'पूजा विधी',
  scriptures: 'धर्मग्रंथ',
  rashifal: 'राशिभविष्य',
  stotrams: 'स्तोत्रे',
  ringtones: 'रिंगटोन',
  temples: 'प्रसिद्ध मंदिरे',
  festivalHub: 'सण केंद्र',
  muhurat: 'शुभ मुहूर्त',
  knowledge: 'दिव्य ज्ञान',
  proudSanatani: 'अभिमानाने सनातनी',
  punyaPoints: 'पुण्य गुण',
  dayStreak: 'दिवस मालिका',
  totalJaaps: 'एकूण जप',
  shareStatus: 'शेअर करा',
  lightDiya: 'दीप जला',
  offerFlower: 'फूल अर्पण करा',
  ringBell: 'घंटा वाजवा',
  jaapCounter: 'जप काउंटर',
};

const gu: Translations = {
  ...en,
  appName: 'સનાતની ભક્તિ',
  appTagline: 'તમારો દૈનિક ભક્તિ સાથી',
  chooseLanguage: 'તમારી ભાષા પસંદ કરો',
  chooseLanguageSub: 'એપની બધી સામગ્રી તમારી ભાષામાં દેખાશે',
  continueBtn: 'આગળ વધો',
  changeLanguage: 'ભાષા બદલો',
  tabHome: 'હોમ',
  tabExplore: 'એક્સપ્લોર',
  tabJaap: 'જાપ',
  tabMandir: 'મંદિર',
  tabProfile: 'પ્રોફાઇલ',
  todayPanchang: 'આજનું પંચાંગ',
  dailyStatus: 'દૈનિક સ્ટેટસ',
  mantraOfDay: 'આજનો મંત્ર',
  startJaap: '108 જાપ શરૂ કરો',
  upcomingFestivals: 'આવનારા તહેવારો',
  quickAccess: 'ઝડપી ઍક્સેસ',
  deities: 'દેવતાઓ',
  pujaVidhi: 'પૂજા વિધિ',
  scriptures: 'ધર્મગ્રંથો',
  rashifal: 'રાશિફળ',
  stotrams: 'સ્તોત્રો',
  ringtones: 'રિંગટોન',
  temples: 'પ્રસિદ્ધ મંદિરો',
  festivalHub: 'તહેવાર હબ',
  muhurat: 'શુભ મુહૂર્ત',
  knowledge: 'દિવ્ય જ્ઞાન',
  proudSanatani: 'ગર્વથી સનાતની',
  punyaPoints: 'પુણ્ય અંક',
  dayStreak: 'દિવસ સ્ટ્રીક',
  totalJaaps: 'કુલ જાપ',
  shareStatus: 'શેર કરો',
  lightDiya: 'દીવો પ્રગટાવો',
  offerFlower: 'ફૂલ અર્પણ કરો',
  ringBell: 'ઘંટડી વગાડો',
  jaapCounter: 'જાપ કાઉન્ટર',
};

const bn: Translations = {
  ...en,
  appName: 'সনাতনী ভক্তি',
  appTagline: 'আপনার দৈনিক ভক্তি সঙ্গী',
  chooseLanguage: 'আপনার ভাষা বেছে নিন',
  chooseLanguageSub: 'অ্যাপের সব কন্টেন্ট আপনার ভাষায় দেখাবে',
  continueBtn: 'এগিয়ে যান',
  changeLanguage: 'ভাষা পরিবর্তন',
  tabHome: 'হোম',
  tabExplore: 'এক্সপ্লোর',
  tabJaap: 'জপ',
  tabMandir: 'মন্দির',
  tabProfile: 'প্রোফাইল',
  todayPanchang: 'আজকের পঞ্জিকা',
  dailyStatus: 'দৈনিক স্ট্যাটাস',
  mantraOfDay: 'আজকের মন্ত্র',
  startJaap: '১০৮ জপ শুরু করুন',
  upcomingFestivals: 'আসন্ন উৎসব',
  quickAccess: 'দ্রুত অ্যাক্সেস',
  deities: 'দেবতা',
  pujaVidhi: 'পূজা বিধি',
  scriptures: 'ধর্মগ্রন্থ',
  rashifal: 'রাশিফল',
  stotrams: 'স্তোত্র',
  ringtones: 'রিংটোন',
  temples: 'বিখ্যাত মন্দির',
  festivalHub: 'উৎসব হাব',
  muhurat: 'শুভ মুহূর্ত',
  knowledge: 'দিব্য জ্ঞান',
  proudSanatani: 'গর্বিত সনাতনী',
  punyaPoints: 'পুণ্য পয়েন্ট',
  dayStreak: 'দিন স্ট্রিক',
  totalJaaps: 'মোট জপ',
  shareStatus: 'শেয়ার করুন',
  lightDiya: 'দীপ জ্বালান',
  offerFlower: 'ফুল অর্পণ করুন',
  ringBell: 'ঘণ্টা বাজান',
  jaapCounter: 'জপ কাউন্টার',
};

const kn: Translations = {
  ...en,
  appName: 'ಸನಾತನಿ ಭಕ್ತಿ',
  appTagline: 'ನಿಮ್ಮ ದೈನಂದಿನ ಭಕ್ತಿ ಸಹಚರ',
  chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
  chooseLanguageSub: 'ಅಪ್ಲಿಕೇಶನ್ ಎಲ್ಲಾ ವಿಷಯವು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ',
  continueBtn: 'ಮುಂದುವರಿಸಿ',
  changeLanguage: 'ಭಾಷೆ ಬದಲಾಯಿಸಿ',
  tabHome: 'ಹೋಮ್',
  tabExplore: 'ಅನ್ವೇಷಿಸಿ',
  tabJaap: 'ಜಪ',
  tabMandir: 'ಮಂದಿರ',
  tabProfile: 'ಪ್ರೊಫೈಲ್',
  todayPanchang: 'ಇಂದಿನ ಪಂಚಾಂಗ',
  dailyStatus: 'ದೈನಂದಿನ ಸ್ಟೇಟಸ್',
  mantraOfDay: 'ಇಂದಿನ ಮಂತ್ರ',
  startJaap: '108 ಜಪ ಪ್ರಾರಂಭಿಸಿ',
  upcomingFestivals: 'ಮುಂಬರುವ ಹಬ್ಬಗಳು',
  quickAccess: 'ತ್ವರಿತ ಪ್ರವೇಶ',
  deities: 'ದೇವತೆಗಳು',
  pujaVidhi: 'ಪೂಜಾ ವಿಧಿ',
  scriptures: 'ಧರ್ಮ ಗ್ರಂಥಗಳು',
  rashifal: 'ರಾಶಿ ಭವಿಷ್ಯ',
  stotrams: 'ಸ್ತೋತ್ರಗಳು',
  ringtones: 'ರಿಂಗ್‌ಟೋನ್‌ಗಳು',
  temples: 'ಪ್ರಸಿದ್ಧ ದೇವಾಲಯಗಳು',
  festivalHub: 'ಹಬ್ಬ ಹಬ್',
  muhurat: 'ಶುಭ ಮುಹೂರ್ತ',
  knowledge: 'ದಿವ್ಯ ಜ್ಞಾನ',
  proudSanatani: 'ಗರ್ವದಿಂದ ಸನಾತನಿ',
  punyaPoints: 'ಪುಣ್ಯ ಅಂಕಗಳು',
  dayStreak: 'ದಿನ ಸ್ಟ್ರೀಕ್',
  totalJaaps: 'ಒಟ್ಟು ಜಪಗಳು',
  shareStatus: 'ಹಂಚಿಕೊಳ್ಳಿ',
  lightDiya: 'ದೀಪ ಹಚ್ಚಿ',
  offerFlower: 'ಹೂವು ಅರ್ಪಿಸಿ',
  ringBell: 'ಗಂಟೆ ಬಾರಿಸಿ',
  jaapCounter: 'ಜಪ ಕೌಂಟರ್',
};

const ml: Translations = {
  ...en,
  appName: 'സനാതനി ഭക്തി',
  appTagline: 'നിങ്ങളുടെ ദൈനംദിന ഭക്തി കൂട്ടുകാരൻ',
  chooseLanguage: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
  chooseLanguageSub: 'ആപ്പിന്റെ എല്ലാ ഉള്ളടക്കവും നിങ്ങളുടെ ഭാഷയിൽ കാണും',
  continueBtn: 'തുടരുക',
  changeLanguage: 'ഭാഷ മാറ്റുക',
  tabHome: 'ഹോം',
  tabExplore: 'എക്സ്പ്ലോർ',
  tabJaap: 'ജപം',
  tabMandir: 'ക്ഷേത്രം',
  tabProfile: 'പ്രൊഫൈൽ',
  todayPanchang: 'ഇന്നത്തെ പഞ്ചാംഗം',
  dailyStatus: 'ദൈനംദിന സ്റ്റാറ്റസ്',
  mantraOfDay: 'ഇന്നത്തെ മന്ത്രം',
  startJaap: '108 ജപം ആരംഭിക്കുക',
  upcomingFestivals: 'വരാനിരിക്കുന്ന ഉത്സവങ്ങൾ',
  quickAccess: 'ദ്രുത പ്രവേശനം',
  deities: 'ദേവതകൾ',
  pujaVidhi: 'പൂജാ വിധി',
  scriptures: 'ധർമ്മ ഗ്രന്ഥങ്ങൾ',
  rashifal: 'രാശിഫലം',
  stotrams: 'സ്തോത്രങ്ങൾ',
  ringtones: 'റിംഗ്ടോണുകൾ',
  temples: 'പ്രസിദ്ധ ക്ഷേത്രങ്ങൾ',
  festivalHub: 'ഉത്സവ ഹബ്',
  muhurat: 'ശുഭ മുഹൂർത്തം',
  knowledge: 'ദിവ്യ ജ്ഞാനം',
  proudSanatani: 'അഭിമാനത്തോടെ സനാതനി',
  punyaPoints: 'പുണ്യ പോയിന്റുകൾ',
  dayStreak: 'ദിവസ സ്ട്രീക്ക്',
  totalJaaps: 'മൊത്തം ജപങ്ങൾ',
  shareStatus: 'പങ്കിടുക',
  lightDiya: 'ദീപം കത്തിക്കുക',
  offerFlower: 'പുഷ്പം അർപ്പിക്കുക',
  ringBell: 'മണി മുഴക്കുക',
  jaapCounter: 'ജപ കൗണ്ടർ',
};

const pa: Translations = {
  ...en,
  appName: 'ਸਨਾਤਨੀ ਭਕਤੀ',
  appTagline: 'ਤੁਹਾਡਾ ਰੋਜ਼ਾਨਾ ਭਕਤੀ ਸਾਥੀ',
  chooseLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
  chooseLanguageSub: 'ਐਪ ਦੀ ਸਾਰੀ ਸਮੱਗਰੀ ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ ਦਿਖੇਗੀ',
  continueBtn: 'ਜਾਰੀ ਰੱਖੋ',
  changeLanguage: 'ਭਾਸ਼ਾ ਬਦਲੋ',
  tabHome: 'ਹੋਮ',
  tabExplore: 'ਐਕਸਪਲੋਰ',
  tabJaap: 'ਜਾਪ',
  tabMandir: 'ਮੰਦਿਰ',
  tabProfile: 'ਪ੍ਰੋਫਾਈਲ',
  todayPanchang: 'ਅੱਜ ਦਾ ਪੰਚਾਂਗ',
  dailyStatus: 'ਰੋਜ਼ਾਨਾ ਸਟੇਟਸ',
  mantraOfDay: 'ਅੱਜ ਦਾ ਮੰਤਰ',
  startJaap: '108 ਜਾਪ ਸ਼ੁਰੂ ਕਰੋ',
  upcomingFestivals: 'ਆਉਣ ਵਾਲੇ ਤਿਉਹਾਰ',
  quickAccess: 'ਤੁਰੰਤ ਪਹੁੰਚ',
  deities: 'ਦੇਵਤੇ',
  pujaVidhi: 'ਪੂਜਾ ਵਿਧੀ',
  scriptures: 'ਧਰਮ ਗ੍ਰੰਥ',
  rashifal: 'ਰਾਸ਼ੀਫਲ',
  stotrams: 'ਸਤੋਤਰ',
  ringtones: 'ਰਿੰਗਟੋਨ',
  temples: 'ਮਸ਼ਹੂਰ ਮੰਦਿਰ',
  festivalHub: 'ਤਿਉਹਾਰ ਹੱਬ',
  muhurat: 'ਸ਼ੁਭ ਮੁਹੂਰਤ',
  knowledge: 'ਦਿਵਿਆ ਗਿਆਨ',
  proudSanatani: 'ਮਾਣ ਨਾਲ ਸਨਾਤਨੀ',
  punyaPoints: 'ਪੁੰਨ ਅੰਕ',
  dayStreak: 'ਦਿਨ ਸਟ੍ਰੀਕ',
  totalJaaps: 'ਕੁੱਲ ਜਾਪ',
  shareStatus: 'ਸ਼ੇਅਰ ਕਰੋ',
  lightDiya: 'ਦੀਵਾ ਜਗਾਓ',
  offerFlower: 'ਫੁੱਲ ਭੇਟ ਕਰੋ',
  ringBell: 'ਘੰਟੀ ਵਜਾਓ',
  jaapCounter: 'ਜਾਪ ਕਾਊਂਟਰ',
};

const or: Translations = {
  ...en,
  appName: 'ସନାତନୀ ଭକ୍ତି',
  appTagline: 'ଆପଣଙ୍କ ଦୈନିକ ଭକ୍ତି ସାଥୀ',
  chooseLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
  chooseLanguageSub: 'ଆପ୍‌ର ସମସ୍ତ ବିଷୟବସ୍ତୁ ଆପଣଙ୍କ ଭାଷାରେ ଦେଖାଯିବ',
  continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
  changeLanguage: 'ଭାଷା ବଦଳାନ୍ତୁ',
  tabHome: 'ହୋମ',
  tabExplore: 'ଏକ୍ସପ୍ଲୋର',
  tabJaap: 'ଜପ',
  tabMandir: 'ମନ୍ଦିର',
  tabProfile: 'ପ୍ରୋଫାଇଲ',
  todayPanchang: 'ଆଜିର ପଞ୍ଜିକା',
  dailyStatus: 'ଦୈନିକ ଷ୍ଟାଟସ',
  mantraOfDay: 'ଆଜିର ମନ୍ତ୍ର',
  startJaap: '108 ଜପ ଆରମ୍ଭ କରନ୍ତୁ',
  upcomingFestivals: 'ଆସନ୍ତା ଉତ୍ସବ',
  quickAccess: 'ଶୀଘ୍ର ପ୍ରବେଶ',
  deities: 'ଦେବତା',
  pujaVidhi: 'ପୂଜା ବିଧି',
  scriptures: 'ଧର୍ମଗ୍ରନ୍ଥ',
  rashifal: 'ରାଶିଫଳ',
  stotrams: 'ସ୍ତୋତ୍ର',
  ringtones: 'ରିଂଟୋନ',
  temples: 'ପ୍ରସିଦ୍ଧ ମନ୍ଦିର',
  festivalHub: 'ଉତ୍ସବ ହବ',
  muhurat: 'ଶୁଭ ମୁହୂର୍ତ୍ତ',
  knowledge: 'ଦିବ୍ୟ ଜ୍ଞାନ',
  proudSanatani: 'ଗର୍ବରେ ସନାତନୀ',
  punyaPoints: 'ପୁଣ୍ୟ ପଏଣ୍ଟ',
  dayStreak: 'ଦିନ ଷ୍ଟ୍ରିକ',
  totalJaaps: 'ମୋଟ ଜପ',
  shareStatus: 'ସେୟାର କରନ୍ତୁ',
  lightDiya: 'ଦୀପ ଜ୍ୱଳନ୍ତୁ',
  offerFlower: 'ଫୁଲ ଅର୍ପଣ କରନ୍ତୁ',
  ringBell: 'ଘଣ୍ଟା ବଜାନ୍ତୁ',
  jaapCounter: 'ଜପ କାଉଣ୍ଟର',
};

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  hi,
  en,
  ta,
  te,
  mr,
  gu,
  bn,
  kn,
  ml,
  pa,
  or,
};

export function t(lang: LanguageCode, key: TranslationKey): string {
  return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
}
