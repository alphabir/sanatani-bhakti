import type { Scripture } from '../types';

export const SCRIPTURES: Scripture[] = [
  {
    id: 'bhagavad-gita-ch1',
    title: 'Bhagavad Gita — Chapter 1',
    category: 'gita',
    chapters: 18,
    excerpt: 'धृतराष्ट्र उवाच — धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः। मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥\n\nTranslation: Dhritarashtra said — O Sanjay, assembled on the holy field of Kurukshetra eager for battle, what did my sons and the sons of Pandu do?',
  },
  {
    id: 'bhagavad-gita-ch2',
    title: 'Bhagavad Gita — Chapter 2 (Sankhya Yoga)',
    category: 'gita',
    chapters: 18,
    excerpt: 'श्रीभगवानुवाच — कुतस्त्वा कश्मलमिदं विषमे समुपस्थितम्। अनार्यजुष्टमस्वर्ग्यमकीर्तिकरमर्जुन ॥\n\nTranslation: The Lord said — Whence has this weakness come upon you at this critical moment? It is not befitting a noble person.',
  },
  {
    id: 'sunderkand-opening',
    title: 'Sunderkand — Opening',
    category: 'ramayan',
    excerpt: 'श्रीगुरु चरन सरोज रज निज मन मुकुर सुधारि। बरनउँ रघुबर बिमल जसु जो दायकु फल चारि॥\n\nSunderkand describes Hanuman\'s journey to Lanka — the most beloved chapter of Ramayan.',
  },
  {
    id: 'vishnu-sahasranama',
    title: 'Vishnu Sahasranama',
    category: 'stotra',
    excerpt: 'विश्वं विष्णुर्वषट्कारो भूतभव्यभवत्प्रभुः। भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः॥\n\nThe thousand names of Lord Vishnu — recited for peace and prosperity.',
  },
  {
    id: 'shiv-purana-excerpt',
    title: 'Shiv Purana — Excerpt',
    category: 'puran',
    excerpt: 'शिवः शक्त्या युक्तो यदि भवति शक्तः प्रभवितुं न चेदेवं देवो न खलु कुशलः स्पन्दितुमपि।\n\nShiva united with Shakti is able to manifest. Without Shakti, even Shiva cannot act.',
  },
  {
    id: 'satyanarayan-katha',
    title: 'Satyanarayan Katha',
    category: 'katha',
    excerpt: 'Once upon a time, Lord Narayan instructed Narad Muni about the glory of Satyanarayan vrata for welfare of humanity in Kali Yuga...',
  },
];

export function getScriptureById(id: string): Scripture | undefined {
  return SCRIPTURES.find((s) => s.id === id);
}
