import type { Festival, ResolvedFestival } from '../types';

/**
 * Hindu festival dates.
 *
 * Sourced by three independent researchers working from panchang authorities
 * and cross-checked; 43 of 63 observances were unanimous and the rest agreed
 * 2-of-3. All dates are the North Indian (Purnimanta, New Delhi) observance in
 * IST. Regional practice differs materially in places — South Indian Deepavali
 * centres on Naraka Chaturdashi, Bengal keeps Kali Puja on Diwali night — and
 * Phase 3's region work is where that gets represented.
 *
 * These are lunisolar dates and cannot be computed client-side; they are
 * transcribed, not derived. Coverage runs to 2027-12-13.
 *
 * RE-VALIDATE THE 2027 ENTRIES IN EARLY 2027 and extend the table. Tithi-
 * boundary festivals (the Ekadashis, Karva Chauth, Sankranti, Janmashtami) are
 * the ones that move. A single-year table is exactly what left this app with a
 * dead Festival Hub.
 */
export const FESTIVALS: Festival[] = [
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    description: '10-day Ganeshotsav begins; Ganesha\'s birth',
    deity: 'ganesh',
    dates: { 2026: '2026-09-14', 2027: '2027-09-04' },
    spanDays: 10,
    prominence: 'headline',
  },
  {
    id: 'anant-chaturdashi',
    name: 'Anant Chaturdashi (Ganesh Visarjan)',
    description: 'Ganesh idols immersed; Ganeshotsav ends',
    deity: 'ganesh',
    dates: { 2026: '2026-09-25', 2027: '2027-09-14' },
    prominence: 'major',
  },
  {
    id: 'mahalaya',
    name: 'Mahalaya (Sarva Pitru Amavasya)',
    description: 'Pitru Paksha ends; Durga\'s arrival invoked',
    deity: 'durga',
    dates: { 2026: '2026-10-10', 2027: '2027-09-29' },
    prominence: 'major',
  },
  {
    id: 'sharad-navratri-begins',
    name: 'Sharad Navratri Begins (Ghatasthapana)',
    description: 'Nine nights of Maa Durga begin',
    deity: 'durga',
    dates: { 2026: '2026-10-11', 2027: '2027-09-30' },
    spanDays: 9,
    prominence: 'headline',
  },
  {
    id: 'maha-navami',
    name: 'Maha Navami',
    description: 'Ninth night; Kanya Pujan for Durga',
    deity: 'durga',
    dates: { 2026: '2026-10-19', 2027: '2027-10-08' },
    prominence: 'major',
  },
  {
    id: 'dussehra',
    name: 'Dussehra (Vijayadashami)',
    description: 'Ram defeats Ravana; Ravan Dahan',
    deity: 'ram',
    dates: { 2026: '2026-10-20', 2027: '2027-10-09' },
    prominence: 'headline',
  },
  {
    id: 'sharad-purnima',
    name: 'Sharad Purnima (Kojagara Puja)',
    description: 'Harvest full moon; night vigil for Lakshmi',
    deity: 'lakshmi',
    dates: { 2026: '2026-10-25', 2027: '2027-10-14' },
    prominence: 'major',
  },
  {
    id: 'karva-chauth',
    name: 'Karva Chauth',
    description: 'Wives fast till moonrise for husbands',
    deity: 'shiv',
    dates: { 2026: '2026-10-29', 2027: '2027-10-18' },
    prominence: 'major',
  },
  {
    id: 'ahoi-ashtami',
    name: 'Ahoi Ashtami',
    description: 'Mothers fast for their children\'s long life',
    deity: 'durga',
    dates: { 2026: '2026-11-01', 2027: '2027-10-22' },
    prominence: 'major',
  },
  {
    id: 'dhanteras',
    name: 'Dhanteras',
    description: 'Buy gold; Dhanvantari and Lakshmi worshipped',
    deity: 'lakshmi',
    dates: { 2026: '2026-11-06', 2027: '2027-10-27' },
    prominence: 'major',
  },
  {
    id: 'narak-chaturdashi',
    name: 'Narak Chaturdashi (Choti Diwali)',
    description: 'Krishna slays Narakasura; dawn oil bath',
    deity: 'krishna',
    dates: { 2026: '2026-11-08', 2027: '2027-10-28' },
    prominence: 'major',
  },
  {
    id: 'diwali',
    name: 'Diwali (Lakshmi Puja)',
    description: 'Festival of lights; Lakshmi-Ganesh puja',
    deity: 'lakshmi',
    dates: { 2026: '2026-11-08', 2027: '2027-10-29' },
    prominence: 'headline',
  },
  {
    id: 'govardhan-puja',
    name: 'Govardhan Puja (Annakut)',
    description: 'Krishna lifts Govardhan hill; Annakut bhog',
    deity: 'krishna',
    dates: { 2026: '2026-11-10', 2027: '2027-10-30' },
    prominence: 'major',
  },
  {
    id: 'bhai-dooj',
    name: 'Bhai Dooj',
    description: 'Sisters tilak brothers for long life',
    deity: 'krishna',
    dates: { 2026: '2026-11-11', 2027: '2027-10-31' },
    prominence: 'major',
  },
  {
    id: 'chhath-puja',
    name: 'Chhath Puja (Sandhya Arghya)',
    description: 'Arghya to the setting Sun for Chhathi Maiya',
    deity: 'vishnu',
    dates: { 2026: '2026-11-15', 2027: '2027-11-04' },
    spanDays: 4,
    prominence: 'headline',
  },
  {
    id: 'dev-uthani-ekadashi',
    name: 'Dev Uthani Ekadashi (Prabodhini)',
    description: 'Vishnu wakes; wedding season reopens',
    deity: 'vishnu',
    dates: { 2026: '2026-11-20', 2027: '2027-11-10' },
    prominence: 'major',
  },
  {
    id: 'tulsi-vivah',
    name: 'Tulsi Vivah',
    description: 'Tulsi wed to Shaligram Vishnu',
    deity: 'vishnu',
    dates: { 2026: '2026-11-21', 2027: '2027-11-11' },
    prominence: 'major',
  },
  {
    id: 'kartik-purnima',
    name: 'Kartik Purnima (Dev Deepawali)',
    description: 'Tripurari Purnima; Kashi ghats lit up',
    deity: 'shiv',
    dates: { 2026: '2026-11-24', 2027: '2027-11-14' },
    prominence: 'major',
  },
  {
    id: 'vivah-panchami',
    name: 'Vivah Panchami',
    description: 'Wedding day of Lord Ram and Sita',
    deity: 'ram',
    dates: { 2026: '2026-12-14', 2027: '2027-12-03' },
    prominence: 'major',
  },
  {
    id: 'gita-jayanti',
    name: 'Gita Jayanti (Mokshada Ekadashi)',
    description: 'Day Krishna spoke the Bhagavad Gita',
    deity: 'krishna',
    dates: { 2026: '2026-12-20', 2027: '2027-12-09' },
    prominence: 'major',
  },
  {
    id: 'dattatreya-jayanti',
    name: 'Dattatreya Jayanti',
    description: 'Birth of Dattatreya, the Trimurti guru',
    deity: 'vishnu',
    dates: { 2026: '2026-12-23', 2027: '2027-12-13' },
    prominence: 'major',
  },
  {
    id: 'makar-sankranti',
    name: 'Makar Sankranti',
    description: 'Sun enters Capricorn; kites and til-gud',
    deity: 'shani',
    dates: { 2027: '2027-01-15' },
    prominence: 'headline',
  },
  {
    id: 'vasant-panchami',
    name: 'Vasant Panchami (Saraswati Puja)',
    description: 'Saraswati worshipped; spring begins',
    deity: 'saraswati',
    dates: { 2027: '2027-02-11' },
    prominence: 'major',
  },
  {
    id: 'maha-shivratri',
    name: 'Maha Shivratri',
    description: 'Great night of Shiva; night-long vigil',
    deity: 'shiv',
    dates: { 2027: '2027-03-06' },
    prominence: 'headline',
  },
  {
    id: 'holika-dahan',
    name: 'Holika Dahan (Chhoti Holi)',
    description: 'Bonfire marks Prahlad saved from Holika',
    deity: 'vishnu',
    dates: { 2027: '2027-03-21' },
    prominence: 'major',
  },
  {
    id: 'holi',
    name: 'Holi (Rangwali Holi)',
    description: 'Festival of colours; Braj Holi of Krishna',
    deity: 'krishna',
    dates: { 2027: '2027-03-22' },
    prominence: 'headline',
  },
  {
    id: 'chaitra-navratri-begins',
    name: 'Chaitra Navratri Begins (Gudi Padwa / Ugadi)',
    description: 'Hindu new year; nine nights of Durga begin',
    deity: 'durga',
    dates: { 2027: '2027-04-07' },
    spanDays: 9,
    prominence: 'major',
  },
  {
    id: 'ram-navami',
    name: 'Ram Navami',
    description: 'Birth of Lord Ram in Ayodhya',
    deity: 'ram',
    dates: { 2027: '2027-04-15' },
    prominence: 'headline',
  },
  {
    id: 'hanuman-jayanti',
    name: 'Hanuman Jayanti',
    description: 'Birth of Hanuman on Chaitra Purnima',
    deity: 'hanuman',
    dates: { 2027: '2027-04-20' },
    prominence: 'major',
  },
  {
    id: 'akshaya-tritiya',
    name: 'Akshaya Tritiya',
    description: 'Most auspicious day; gold and new starts',
    deity: 'lakshmi',
    dates: { 2027: '2027-05-09' },
    prominence: 'major',
  },
  {
    id: 'narasimha-jayanti',
    name: 'Narasimha Jayanti',
    description: 'Vishnu\'s man-lion avatar appears at dusk',
    deity: 'vishnu',
    dates: { 2027: '2027-05-18' },
    prominence: 'major',
  },
  {
    id: 'buddha-purnima',
    name: 'Buddha Purnima',
    description: 'Buddha born; ninth avatar of Vishnu',
    deity: 'vishnu',
    dates: { 2027: '2027-05-20' },
    prominence: 'major',
  },
  {
    id: 'shani-jayanti',
    name: 'Shani Jayanti (Vat Savitri Vrat)',
    description: 'Birth of Shani Dev on Jyeshtha Amavasya',
    deity: 'shani',
    dates: { 2027: '2027-06-04' },
    prominence: 'major',
  },
  {
    id: 'nirjala-ekadashi',
    name: 'Nirjala Ekadashi',
    description: 'Strictest Vishnu fast, without water',
    deity: 'vishnu',
    dates: { 2027: '2027-06-14' },
    prominence: 'major',
  },
  {
    id: 'jagannath-rath-yatra',
    name: 'Jagannath Rath Yatra',
    description: 'Jagannath\'s chariot procession in Puri',
    deity: 'krishna',
    dates: { 2027: '2027-07-05' },
    prominence: 'major',
  },
  {
    id: 'guru-purnima',
    name: 'Guru Purnima (Vyasa Purnima)',
    description: 'Honouring gurus; Ved Vyas Purnima',
    deity: 'vishnu',
    dates: { 2027: '2027-07-18' },
    prominence: 'major',
  },
  {
    id: 'hariyali-teej',
    name: 'Hariyali Teej',
    description: 'Parvati reunites with Shiva; monsoon vrat',
    deity: 'shiv',
    dates: { 2027: '2027-08-04' },
    prominence: 'major',
  },
  {
    id: 'nag-panchami',
    name: 'Nag Panchami',
    description: 'Serpent gods worshipped with milk',
    deity: 'shiv',
    dates: { 2027: '2027-08-06' },
    prominence: 'major',
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    description: 'Sisters tie rakhi on brothers\' wrists',
    deity: 'krishna',
    dates: { 2027: '2027-08-17' },
    prominence: 'headline',
  },
  {
    id: 'krishna-janmashtami',
    name: 'Krishna Janmashtami',
    description: 'Midnight birth of Krishna in Mathura',
    deity: 'krishna',
    dates: { 2027: '2027-08-25' },
    prominence: 'headline',
  },
  {
    id: 'hartalika-teej',
    name: 'Hartalika Teej',
    description: 'Parvati\'s vrat to win Shiva as husband',
    deity: 'shiv',
    dates: { 2027: '2027-09-03' },
    prominence: 'major',
  },
  {
    id: 'durga-ashtami',
    name: 'Durga Ashtami (Maha Ashtami)',
    description: 'Maha Ashtami; Sandhi Puja and kanya pujan',
    deity: 'durga',
    // 2026 is disputed: 18 Oct by the Bengali panjika and pandal schedule,
    // 19 Oct under the strict sunrise-tithi rule (Ashtami and Navami collide).
    // Both are defensible, so both are shown rather than silently picking one.
    dates: { 2026: { date: '2026-10-18', altDate: '2026-10-19', note: 'Observed 18 Oct by most panjikas; 19 Oct by the strict sunrise-tithi rule' }, 2027: '2027-10-07' },
    prominence: 'major',
  },
];

/** Resolves one year's entry, which may be a plain date or carry an alternative. */
function resolve(f: Festival, year: number): ResolvedFestival | null {
  const entry = f.dates[year];
  if (!entry) return null;
  const isObj = typeof entry !== 'string';
  return {
    id: f.id,
    name: f.name,
    nameHindi: f.nameHindi,
    description: f.description,
    deity: f.deity,
    date: isObj ? entry.date : entry,
    altDate: isObj ? entry.altDate : undefined,
    note: isObj ? entry.note : undefined,
    spanDays: f.spanDays,
    prominence: f.prominence,
  };
}

/**
 * Festivals still ahead, soonest first.
 *
 * Looks across every authored year rather than just this one, so the list does
 * not empty out each December. Uses `toISOString()` (UTC) as the original did:
 * for an IST audience a festival therefore stays "upcoming" until 05:30 IST the
 * following morning, which is the forgiving direction to err in.
 */
export function getUpcomingFestivals(): ResolvedFestival[] {
  const today = new Date().toISOString().split('T')[0]!;
  const out: ResolvedFestival[] = [];
  for (const f of FESTIVALS) {
    for (const year of Object.keys(f.dates)) {
      const r = resolve(f, Number(year));
      if (r && r.date >= today) out.push(r);
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * "8 Nov 2026" for display.
 *
 * Formatting happens here, never in the data: `date` is compared and sorted as
 * a plain string, so a human-readable value in the table would silently break
 * both the filter and the ordering.
 */
export function formatFestivalDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!y || !m || !d) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Whether anything is left in the table.
 *
 * A function, not a module-level constant: a constant is evaluated once at
 * import and would go stale across a long-running session or a midnight
 * rollover.
 */
export function hasUpcomingFestivals(): boolean {
  return getUpcomingFestivals().length > 0;
}
