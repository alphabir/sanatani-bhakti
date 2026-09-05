import type { Bhajan } from '../types';

export const BHAJANS: Bhajan[] = [
  {
    id: 'har-har-mahadev',
    title: 'Har Har Mahadev',
    deity: 'shiv',
    lyrics: ['हर हर महादेव, शंभू शंकर भोलेनाथ', 'तुम्हारे चरणों में शीश झुकाते हैं हम'],
  },
  {
    id: 'jai-hanuman',
    title: 'Jai Hanuman Gyan Gun Sagar',
    deity: 'hanuman',
    lyrics: ['जय हनुमान ज्ञान गुन सागर', 'जय कपीस तिहुँ लोक उजागर'],
  },
  {
    id: 'govind-jai-jai',
    title: 'Govind Jai Jai',
    deity: 'krishna',
    lyrics: ['गोविन्द जय जय, गोपाल जय जय', 'राधारमण हरि गोविन्द जय जय'],
  },
  {
    id: 'jai-ganesh-deva',
    title: 'Jai Ganesh Deva',
    deity: 'ganesh',
    lyrics: ['जय गणेश जय गणेश जय गणेश देवा', 'माता जाकी पार्वती पिता महादेवा'],
  },
  {
    id: 'nav-durga',
    title: 'Nav Durga Bhajan',
    deity: 'durga',
    lyrics: ['जय अम्बे गौरी मैया जय श्यामा गौरी', 'तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी'],
  },
  {
    id: 'ram-siya-ram',
    title: 'Ram Siya Ram',
    deity: 'ram',
    lyrics: ['राम सिया राम सिया राम जय जय राम', 'राम सिया राम सिया राम जय जय राम'],
  },
  {
    id: 'om-jai-lakshmi',
    title: 'Om Jai Lakshmi Mata',
    deity: 'lakshmi',
    lyrics: ['ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता'],
  },
  {
    id: 'shiv-tandav',
    title: 'Shiv Tandav Stotra (Excerpt)',
    deity: 'shiv',
    lyrics: ['जटाटवी गलज्जल प्रवाह पावितस्थले', 'गलेऽवलम्ब्य लम्बितां भुजंगतुंगमालिकाम्'],
  },
];

export function getBhajanById(id: string): Bhajan | undefined {
  return BHAJANS.find((b) => b.id === id);
}
