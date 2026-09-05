import type { PujaGuide } from '../types';

export const PUJA_GUIDES: PujaGuide[] = [
  {
    id: 'diwali-lakshmi',
    title: 'Diwali Lakshmi Puja',
    festival: 'Diwali',
    deity: 'lakshmi',
    duration: '45–60 min',
    samagri: [
      'Murti or photo of Lakshmi-Ganesh',
      'Diya (5+), oil/ghee, cotton wicks',
      'Flowers, garland, tulsi leaves',
      'Rice, kumkum, haldi, sandalwood paste',
      'Fruits, sweets, dry fruits',
      'Coins, new notebook, pen',
      'Ganga jal or clean water',
      'Aarti thali with camphor',
    ],
    steps: [
      { order: 1, title: 'Snan & Sthapana', description: 'Clean the puja area. Place chowki with red cloth. Install Lakshmi-Ganesh murti facing east or north.' },
      { order: 2, title: 'Sankalp', description: 'Take water in hand, state your name, gotra, and purpose of puja. Offer water to ground.' },
      { order: 3, title: 'Ganesh Puja', description: 'Worship Ganesh first — apply tilak, offer flowers, rice, and modak.' },
      { order: 4, title: 'Lakshmi Puja', description: 'Invoke Maa Lakshmi. Offer flowers, rice, kumkum, haldi, fruits, and sweets.' },
      { order: 5, title: 'Diya Lighting', description: 'Light 5 or more diyas. Place one at entrance, one in temple area.' },
      { order: 6, title: 'Aarti', description: 'Sing Lakshmi Aarti with camphor aarti. Ring bell during aarti.' },
      { order: 7, title: 'Prasad & Visarjan', description: 'Distribute prasad to family. Keep diyas lit through the evening.' },
    ],
  },
  {
    id: 'satyanarayan',
    title: 'Satyanarayan Katha Puja',
    festival: 'Any auspicious day',
    deity: 'vishnu',
    duration: '2–3 hours',
    samagri: [
      'Satyanarayan murti/photo',
      'Panchamrit ingredients',
      'Pancha ratna (5 gems or substitutes)',
      'Banana leaf, betel leaves & nuts',
      'Halwa prasad ingredients',
      'Flowers, incense, diya',
      'Katha book',
    ],
    steps: [
      { order: 1, title: 'Preparation', description: 'Clean home and puja area. Prepare halwa prasad before starting.' },
      { order: 2, title: 'Ganesh Puja', description: 'Begin with Ganesh worship for obstacle-free completion.' },
      { order: 3, title: 'Kalash Sthapana', description: 'Establish kalash with mango leaves and coconut.' },
      { order: 4, title: 'Satyanarayan Puja', description: 'Invoke Lord Satyanarayan (Vishnu). Offer panchamrit, flowers, fruits.' },
      { order: 5, title: 'Katha Path', description: 'Read or listen to Satyanarayan Katha with family.' },
      { order: 6, title: 'Aarti & Prasad', description: 'Perform aarti and distribute prasad to all present including neighbors.' },
    ],
  },
  {
    id: 'ganesh-chaturthi',
    title: 'Ganesh Chaturthi Puja',
    festival: 'Ganesh Chaturthi',
    deity: 'ganesh',
    duration: '30–45 min',
    samagri: ['Ganesh murti', 'Modak', 'Durva grass', 'Red flowers', 'Diya, incense', 'Coconut', 'Kumkum, haldi'],
    steps: [
      { order: 1, title: 'Pran Pratishtha', description: 'Invoke life into Ganesh murti with mantras and offerings.' },
      { order: 2, title: 'Shodashopachara', description: 'Perform 16-step worship — avahan, asan, padya, arghya, snan, vastra, yajnopavita, gandh, pushp, dhoop, deep, naivedya, tambul, aarti, pradakshina, namaskar.' },
      { order: 3, title: 'Modak Offering', description: 'Offer 21 modaks — favorite of Lord Ganesh.' },
      { order: 4, title: 'Aarti', description: 'Sing Jai Ganesh Deva aarti.' },
    ],
  },
  {
    id: 'navratri-ghatasthapana',
    title: 'Navratri Ghatasthapana',
    festival: 'Navratri',
    deity: 'durga',
    duration: '30 min',
    samagri: ['Kalash', 'Mango leaves', 'Coconut', 'Barley seeds', 'Red cloth', 'Durga photo', 'Diya'],
    steps: [
      { order: 1, title: 'Muhurat', description: 'Perform during Abhijit muhurat on Pratipada if possible.' },
      { order: 2, title: 'Kalash Setup', description: 'Fill kalash with Ganga jal, place coconut with mango leaves, wrap red cloth.' },
      { order: 3, title: 'Barley Sowing', description: 'Sow barley seeds in clay pot beside kalash.' },
      { order: 4, title: 'Durga Invocation', description: 'Invoke Maa Durga for nine days of worship.' },
      { order: 5, title: 'Daily Deepak', description: 'Light akhand jyot or daily diya for all 9 days.' },
    ],
  },
  {
    id: 'daily-morning-puja',
    title: 'Daily Morning Puja',
    deity: 'vishnu',
    duration: '15–20 min',
    samagri: ['Diya', 'Incense', 'Flowers', 'Water', 'Kumkum', 'Tulsi'],
    steps: [
      { order: 1, title: 'Snan', description: 'Wake early, bathe, wear clean clothes.' },
      { order: 2, title: 'Diya & Incense', description: 'Light diya and incense in home temple.' },
      { order: 3, title: 'Tulsi Puja', description: 'Offer water to Tulsi plant. Circumambulate 4 times.' },
      { order: 4, title: 'Mantra Jaap', description: 'Chant Gayatri Mantra 11 or 108 times.' },
      { order: 5, title: 'Aarti', description: 'Brief aarti of your ishta devta.' },
    ],
  },
];

export function getPujaById(id: string): PujaGuide | undefined {
  return PUJA_GUIDES.find((p) => p.id === id);
}
