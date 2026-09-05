import type { Rashifal } from '../types';

export const RASHIS: Rashifal[] = [
  { rashi: 'Aries', rashiHindi: 'मेष', symbol: '♈', prediction: 'A positive day for new beginnings. Focus on health and family.', predictionHindi: 'नई शुरुआत के लिए अच्छा दिन। स्वास्थ्य और परिवार पर ध्यान दें।', luckyColor: 'Red', luckyNumber: 9 },
  { rashi: 'Taurus', rashiHindi: 'वृषभ', symbol: '♉', prediction: 'Financial matters improve. Avoid unnecessary arguments.', predictionHindi: 'आर्थिक मामले सुधरेंगे। अनावश्यक बहस से बचें।', luckyColor: 'White', luckyNumber: 6 },
  { rashi: 'Gemini', rashiHindi: 'मिथुन', symbol: '♊', prediction: 'Communication brings opportunities. Stay honest in dealings.', predictionHindi: 'संवाद से अवसर मिलेंगे। व्यवहार में ईमानदारी रखें।', luckyColor: 'Green', luckyNumber: 5 },
  { rashi: 'Cancer', rashiHindi: 'कर्क', symbol: '♋', prediction: 'Emotional peace through prayer. Good day for home matters.', predictionHindi: 'प्रार्थना से मानसिक शांति। घरेलू मामलों के लिए अच्छा दिन।', luckyColor: 'Silver', luckyNumber: 2 },
  { rashi: 'Leo', rashiHindi: 'सिंह', symbol: '♌', prediction: 'Leadership shines. Respect elders and donate if possible.', predictionHindi: 'नेतृत्व चमकेगा। बड़ों का सम्मान करें और दान करें।', luckyColor: 'Gold', luckyNumber: 1 },
  { rashi: 'Virgo', rashiHindi: 'कन्या', symbol: '♍', prediction: 'Detail-oriented work succeeds. Take care of digestion.', predictionHindi: 'बारीकी वाले काम में सफलता। पाचन का ध्यान रखें।', luckyColor: 'Green', luckyNumber: 5 },
  { rashi: 'Libra', rashiHindi: 'तुला', symbol: '♎', prediction: 'Relationships harmonize. Artistic pursuits favored.', predictionHindi: 'रिश्तों में सामंजस्य। कलात्मक कार्यों के लिए अच्छा दिन।', luckyColor: 'Pink', luckyNumber: 6 },
  { rashi: 'Scorpio', rashiHindi: 'वृश्चिक', symbol: '♏', prediction: 'Deep meditation brings clarity. Avoid impulsive decisions.', predictionHindi: 'गहन ध्यान से स्पष्टता मिलेगी। आवेग में निर्णय न लें।', luckyColor: 'Maroon', luckyNumber: 9 },
  { rashi: 'Sagittarius', rashiHindi: 'धनु', symbol: '♐', prediction: 'Travel and learning favored. Chant Guru mantra.', predictionHindi: 'यात्रा और ज्ञान के लिए अच्छा। गुरु मंत्र का जाप करें।', luckyColor: 'Yellow', luckyNumber: 3 },
  { rashi: 'Capricorn', rashiHindi: 'मकर', symbol: '♑', prediction: 'Hard work pays off. Shani dev worship brings blessings.', predictionHindi: 'मेहनत रंग लाएगी। शनि देव की पूजा से कृपा मिलेगी।', luckyColor: 'Black', luckyNumber: 8 },
  { rashi: 'Aquarius', rashiHindi: 'कुंभ', symbol: '♒', prediction: 'Innovation and social good align. Help someone in need.', predictionHindi: 'नवीनता और सामाजिक भलाई। जरूरतमंद की सहायता करें।', luckyColor: 'Blue', luckyNumber: 4 },
  { rashi: 'Pisces', rashiHindi: 'मीन', symbol: '♓', prediction: 'Spiritual insights deepen. Water donation is auspicious.', predictionHindi: 'आध्यात्मिक अंतर्दृष्टि बढ़ेगी। जल दान शुभ रहेगा।', luckyColor: 'Sea Green', luckyNumber: 7 },
];

export function getRashifalForDay(rashiIndex: number): Rashifal {
  const dayOffset = new Date().getDate() % RASHIS.length;
  const index = (rashiIndex + dayOffset) % RASHIS.length;
  return RASHIS[index]!;
}
