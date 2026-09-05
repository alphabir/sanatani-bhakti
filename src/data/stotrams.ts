import type { DeityId } from '../constants/theme';

export interface Stotram {
  id: string;
  title: string;
  titleHindi: string;
  deity: DeityId;
  verses: string[];
  meaning: string;
}

export const STOTRAMS: Stotram[] = [
  {
    id: 'shiv-tandav',
    title: 'Shiv Tandav Stotram',
    titleHindi: 'शिव तांडव स्तोत्र',
    deity: 'shiv',
    verses: [
      'जटाटवीगलज्जलप्रवाहपावितस्थले',
      'गलेऽवलम्ब्य मनन्दं वनान्दं वनादरिं',
      'महादेवं त्रिनेत्रं भजे ॥',
    ],
    meaning: 'Composed by Ravana — praises Lord Shiva\'s cosmic dance of creation and destruction.',
  },
  {
    id: 'mahishasura-mardini',
    title: 'Mahishasura Mardini Stotram',
    titleHindi: 'महिषासुर मर्दिनी स्तोत्र',
    deity: 'durga',
    verses: [
      'अयि गिरिनन्दिनि नन्दितमेदिनि विश्वविनोदिनि नन्दनुते',
      'गिरिवरविन्ध्यशिरोऽधिनिवासिनि विष्णुविलासिनि जिष्णुनुते ॥',
    ],
    meaning: 'Adi Shankaracharya\'s hymn to Goddess Durga who slayed the demon Mahishasura.',
  },
  {
    id: 'vishnu-sahasranama',
    title: 'Vishnu Sahasranama',
    titleHindi: 'विष्णु सहस्रनाम',
    deity: 'vishnu',
    verses: [
      'विश्वं विष्णुर्वशट्कारो भूतभव्यभवत्प्रभुः',
      'भूतकृद्भूतभृद्भावो भूतात्मा भूतभावनः ॥',
    ],
    meaning: 'The thousand names of Lord Vishnu from the Mahabharata — most powerful stotra.',
  },
  {
    id: 'hanuman-chalisa-opening',
    title: 'Hanuman Stotram',
    titleHindi: 'हनुमान स्तोत्र',
    deity: 'hanuman',
    verses: [
      'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्',
      'वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥',
    ],
    meaning: 'Praises Hanuman\'s speed, wisdom, and devotion as Ram\'s messenger.',
  },
  {
    id: 'ganesh-pancharatnam',
    title: 'Ganesh Pancharatnam',
    titleHindi: 'गणेश पंचरत्नम्',
    deity: 'ganesh',
    verses: [
      'मुदाकरात्तमोदकं सदा विमुक्तिसौख्यकरं विदात्',
      'रविवरकोटिनिभं भ्रमाद्धृतं विश्वधरं मुनीश्वरम् ॥',
    ],
    meaning: 'Adi Shankaracharya\'s five-jewel hymn to Lord Ganesh.',
  },
  {
    id: 'lakshmi-ashtakam',
    title: 'Lakshmi Ashtakam',
    titleHindi: 'लक्ष्मी अष्टकम्',
    deity: 'lakshmi',
    verses: [
      'नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते',
      'शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते ॥',
    ],
    meaning: 'Eight verses worshipping Goddess Lakshmi for prosperity and abundance.',
  },
  {
    id: 'ram-raksha',
    title: 'Ram Raksha Stotram',
    titleHindi: 'राम रक्षा स्तोत्र',
    deity: 'ram',
    verses: [
      'चरितं रघुनाथस्य शतकोटिप्रविस्तरम्',
      'एकैकमक्षरं प्रोक्तं महापातकनाशनम् ॥',
    ],
    meaning: 'Each letter of this stotra destroys great sins — protective hymn to Lord Ram.',
  },
  {
    id: 'krishna-ashtakam',
    title: 'Krishna Ashtakam',
    titleHindi: 'कृष्ण अष्टकम्',
    deity: 'krishna',
    verses: [
      'वसुदेवसुतं देवं कंसचाणूरमर्दनम्',
      'देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम् ॥',
    ],
    meaning: 'Eight verses praising Krishna as the world teacher and destroyer of evil.',
  },
];

export function getStotramById(id: string): Stotram | undefined {
  return STOTRAMS.find((s) => s.id === id);
}
