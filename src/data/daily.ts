import type { DailyStatus, KnowledgeCard, Festival } from '../types';

export const DAILY_STATUSES: DailyStatus[] = [
  { id: 's1', quote: 'Where there is dharma, there is victory.', quoteHindi: 'जहाँ धर्म है, वहाँ विजय है।', author: 'Mahabharata', deity: 'krishna' },
  { id: 's2', quote: 'Truth alone triumphs.', quoteHindi: 'सत्यमेव जयते।', deity: 'vishnu' },
  { id: 's3', quote: 'Hanuman is the embodiment of strength, wisdom, and devotion.', quoteHindi: 'हनुमान शक्ति, बुद्धि और भक्ति के प्रतीक हैं।', deity: 'hanuman' },
  { id: 's4', quote: 'Om Namah Shivaya — the path to inner peace.', quoteHindi: 'ॐ नमः शिवाय — आंतरिक शांति का मार्ग।', deity: 'shiv' },
  { id: 's5', quote: 'Jai Shree Ram — righteousness always prevails.', quoteHindi: 'जय श्री राम — धर्म की हमेशा विजय होती है।', deity: 'ram' },
  { id: 's6', quote: 'Ganesh — first worshipped, first to remove obstacles.', quoteHindi: 'गणेश — सबसे पहले पूजे, विघ्न सबसे पहले हटाए।', deity: 'ganesh' },
  { id: 's7', quote: 'Maa Durga protects those who surrender with faith.', quoteHindi: 'माँ दुर्गा श्रद्धा से शरण आने वालों की रक्षा करती हैं।', deity: 'durga' },
];

export function getTodayStatus(): DailyStatus {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
  );
  return DAILY_STATUSES[dayOfYear % DAILY_STATUSES.length]!;
}

export const KNOWLEDGE_CARDS: KnowledgeCard[] = [
  { id: 'k1', title: 'Why 108?', content: '108 is sacred in Hinduism — the number of Upanishads, beads in a mala, and cosmic connections in Vedic astronomy.', deity: 'vishnu' },
  { id: 'k2', title: 'Shiva\'s Third Eye', content: 'The third eye represents wisdom and destruction of evil. When opened, it releases fire that burns ignorance.', deity: 'shiv' },
  { id: 'k3', title: 'Hanuman and Ram', content: 'Hanuman is considered the greatest devotee (bhakta) in history — his love for Ram is the ideal of selfless devotion.', deity: 'hanuman' },
  { id: 'k4', title: 'Why Tulsi?', content: 'Tulsi is sacred to Vishnu. Daily worship of Tulsi plant brings purity and is considered equal to pilgrimage.', deity: 'vishnu' },
  { id: 'k5', title: 'Ganesh\'s Mouse', content: 'The mouse (mushak) represents desire. Ganesh riding it symbolizes control over ego and desires.', deity: 'ganesh' },
  { id: 'k6', title: 'Navratri Nine Forms', content: 'During Navratri, nine forms of Durga are worshipped — Shailaputri to Siddhidatri, each representing divine qualities.', deity: 'durga' },
];

export const FESTIVALS: Festival[] = [
  { id: 'f1', name: 'Diwali', date: '2025-10-20', description: 'Festival of lights — Lakshmi-Ganesh puja', deity: 'lakshmi' },
  { id: 'f2', name: 'Navratri', date: '2025-09-22', description: 'Nine nights of Durga worship', deity: 'durga' },
  { id: 'f3', name: 'Janmashtami', date: '2025-08-16', description: 'Birth of Lord Krishna', deity: 'krishna' },
  { id: 'f4', name: 'Ganesh Chaturthi', date: '2025-08-27', description: 'Birth of Lord Ganesh', deity: 'ganesh' },
  { id: 'f5', name: 'Mahashivratri', date: '2026-02-15', description: 'Great night of Shiva', deity: 'shiv' },
  { id: 'f6', name: 'Ram Navami', date: '2026-03-27', description: 'Birth of Lord Ram', deity: 'ram' },
  { id: 'f7', name: 'Holi', date: '2026-03-04', description: 'Festival of colors — victory of good', deity: 'krishna' },
];

export function getUpcomingFestivals(): Festival[] {
  const today = new Date().toISOString().split('T')[0]!;
  return FESTIVALS.filter((f) => f.date >= today).sort((a, b) => a.date.localeCompare(b.date));
}

export function getTodayTithi(): { tithi: string; paksha: string; month: string } {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[new Date().getDay()]!;
  const tithis = ['Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima'];
  const idx = new Date().getDate() % tithis.length;
  return {
    tithi: tithis[idx]!,
    paksha: new Date().getDate() <= 15 ? 'Shukla Paksha' : 'Krishna Paksha',
    month: 'Jyeshtha',
  };
}
