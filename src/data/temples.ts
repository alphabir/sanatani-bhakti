import type { DeityId } from '../constants/theme';

export interface Temple {
  id: string;
  name: string;
  nameHindi: string;
  city: string;
  state: string;
  deity: DeityId;
  significance: string;
  timings: string;
  emoji: string;
}

export const TEMPLES: Temple[] = [
  {
    id: 'kashi-vishwanath',
    name: 'Kashi Vishwanath',
    nameHindi: 'काशी विश्वनाथ',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    deity: 'shiv',
    significance: 'One of the 12 Jyotirlingas — the holiest Shiva temple in India.',
    timings: '3:00 AM – 11:00 PM',
    emoji: '🔱',
  },
  {
    id: 'tirupati',
    name: 'Tirupati Balaji',
    nameHindi: 'तिरुपति बालाजी',
    city: 'Tirupati',
    state: 'Andhra Pradesh',
    deity: 'vishnu',
    significance: 'Richest and most visited temple — Lord Venkateswara.',
    timings: '2:30 AM – 1:30 AM',
    emoji: '💙',
  },
  {
    id: 'vaishno-devi',
    name: 'Vaishno Devi',
    nameHindi: 'वैष्णो देवी',
    city: 'Katra',
    state: 'Jammu & Kashmir',
    deity: 'durga',
    significance: 'Sacred cave shrine — one of the most visited pilgrimage sites.',
    timings: '24 hours',
    emoji: '🌺',
  },
  {
    id: 'somnath',
    name: 'Somnath Temple',
    nameHindi: 'सोमनाथ मंदिर',
    city: 'Veraval',
    state: 'Gujarat',
    deity: 'shiv',
    significance: 'First among the 12 Jyotirlingas on the shores of Arabian Sea.',
    timings: '6:00 AM – 10:00 PM',
    emoji: '🔱',
  },
  {
    id: 'ayodhya-ram',
    name: 'Ram Janmabhoomi',
    nameHindi: 'राम जन्मभूमि',
    city: 'Ayodhya',
    state: 'Uttar Pradesh',
    deity: 'ram',
    significance: 'Birthplace of Lord Ram — newly built grand temple.',
    timings: '7:00 AM – 9:00 PM',
    emoji: '🏹',
  },
  {
    id: 'siddhivinayak',
    name: 'Siddhivinayak',
    nameHindi: 'सिद्धिविनायक',
    city: 'Mumbai',
    state: 'Maharashtra',
    deity: 'ganesh',
    significance: 'Famous Ganesh temple — wishes are believed to be fulfilled here.',
    timings: '5:30 AM – 10:00 PM',
    emoji: '🐘',
  },
  {
    id: 'golden-temple',
    name: 'Golden Temple',
    nameHindi: 'स्वर्ण मंदिर',
    city: 'Amritsar',
    state: 'Punjab',
    deity: 'vishnu',
    significance: 'Holiest Sikh gurdwara — open to all faiths, symbol of equality.',
    timings: '24 hours',
    emoji: '✨',
  },
  {
    id: 'meenakshi',
    name: 'Meenakshi Temple',
    nameHindi: 'मीनाक्षी मंदिर',
    city: 'Madurai',
    state: 'Tamil Nadu',
    deity: 'durga',
    significance: 'Architectural marvel dedicated to Goddess Meenakshi and Sundareswarar.',
    timings: '5:00 AM – 12:30 PM, 4:00 PM – 10:00 PM',
    emoji: '🌺',
  },
  {
    id: 'kedarnath',
    name: 'Kedarnath',
    nameHindi: 'केदारनाथ',
    city: 'Kedarnath',
    state: 'Uttarakhand',
    deity: 'shiv',
    significance: 'Highest Jyotirlinga in the Himalayas — part of Char Dham.',
    timings: '4:00 AM – 9:00 PM (May–Nov)',
    emoji: '🏔️',
  },
  {
    id: 'iskcon-vrindavan',
    name: 'ISKCON Vrindavan',
    nameHindi: 'इस्कॉन वृंदावन',
    city: 'Vrindavan',
    state: 'Uttar Pradesh',
    deity: 'krishna',
    significance: 'Magnificent Krishna temple — center of bhakti in Braj region.',
    timings: '4:30 AM – 8:30 PM',
    emoji: '🪈',
  },
];

export function getTempleById(id: string): Temple | undefined {
  return TEMPLES.find((t) => t.id === id);
}
