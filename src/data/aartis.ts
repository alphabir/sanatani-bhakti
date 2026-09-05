import type { Aarti } from '../types';

export const AARTIS: Aarti[] = [
  {
    id: 'hanuman-aarti',
    title: 'Hanuman Ji Ki Aarti',
    deity: 'hanuman',
    lyrics: [
      'आरती कीजै हनुमान लला की।',
      'दुष्ट दलन रघुनाथ कला की ॥',
      'जाके बल से गिरिवर कांपे।',
      'रोग दोष जाके निकट न झांके ॥',
      'अंजनि पुत्र महा बलदाई।',
      'संतन के प्रभु सदा सहाई ॥',
    ],
    meaning: 'Aarti praising Hanuman, destroyer of evil and protector of devotees.',
  },
  {
    id: 'ganesh-aarti',
    title: 'Jai Ganesh Deva Aarti',
    deity: 'ganesh',
    lyrics: [
      'जय गणेश जय गणेश जय गणेश देवा।',
      'माता जाकी पार्वती पिता महादेवा ॥',
      'एक दंत दयावंत चार भुजा धारी।',
      'माथे पर तिलक सोहे मूसे की सवारी ॥',
    ],
  },
  {
    id: 'shiv-aarti',
    title: 'Om Jai Shiv Omkara',
    deity: 'shiv',
    lyrics: [
      'ॐ जय शिव ओंकारा, स्वामी जय शिव ओंकारा।',
      'ब्रह्मा विष्णु सदाशिव अर्धांगी धारा ॥',
      'एकानन चतुरानन पंचानन राजे।',
      'हंसासन गरुड़ासन वृषवाहन साजे ॥',
    ],
  },
  {
    id: 'durga-aarti',
    title: 'Ambe Tu Hai Jagdambe Kali',
    deity: 'durga',
    lyrics: [
      'जय अम्बे गौरी मैया जय श्यामा गौरी।',
      'तुमको निशदिन ध्यावत हरि ब्रह्मा शिवरी ॥',
      'मांगल भवन अमंगल हारी।',
      'द्रवहु सुदसरथ अजिर बिहारी ॥',
    ],
  },
  {
    id: 'lakshmi-aarti',
    title: 'Om Jai Lakshmi Mata',
    deity: 'lakshmi',
    lyrics: [
      'ॐ जय लक्ष्मी माता, मैया जय लक्ष्मी माता।',
      'तुमको निशदिन सेवत हरि विष्णु विधाता ॥',
      'उमा रमा ब्रह्माणी तुम ही जग माता ॥',
    ],
  },
  {
    id: 'krishna-aarti',
    title: 'Aarti Kunj Bihari Ki',
    deity: 'krishna',
    lyrics: [
      'आरती कुंजबिहारी की, श्री गिरिधर कृष्ण मुरारी की ॥',
      'गले में फूलों की माला, बजे मुरली मधुर बाला ॥',
    ],
  },
  {
    id: 'ram-aarti',
    title: 'Shri Ramchandra Kripalu',
    deity: 'ram',
    lyrics: [
      'श्री रामचन्द्र कृपालु भजु मन हरण भवभय दारुणम्।',
      'नवकंज लोचन कंज मुख कर कंज पद कंजारुणम् ॥',
    ],
  },
  {
    id: 'vishnu-aarti',
    title: 'Om Jai Jagdish Hare',
    deity: 'vishnu',
    lyrics: [
      'ॐ जय जगदीश हरे, स्वामी जय जगदीश हरे।',
      'भक्त जनों के संकट दास जनों के संकट, क्षण में दूर करे ॥',
    ],
  },
  {
    id: 'saraswati-aarti',
    title: 'Jai Saraswati Mata',
    deity: 'saraswati',
    lyrics: [
      'जय सरस्वती माता, मैया जय सरस्वती माता।',
      'सदगुण वैभव शालिनी, त्रिभुवन विख्याता ॥',
    ],
  },
  {
    id: 'shani-aarti',
    title: 'Jai Jai Shri Shani Dev',
    deity: 'shani',
    lyrics: [
      'जय जय श्री शनि देव, भक्तन हितकारी।',
      'सूरज के पुत्र प्रभु, नाम तुम्हारा भारी ॥',
    ],
  },
];

export function getAartiById(id: string): Aarti | undefined {
  return AARTIS.find((a) => a.id === id);
}
