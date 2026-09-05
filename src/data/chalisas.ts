import type { Chalisa } from '../types';

export const CHALISAS: Chalisa[] = [
  {
    id: 'hanuman-chalisa',
    title: 'Hanuman Chalisa',
    deity: 'hanuman',
    doha: [
      'श्रीगुरु चरन सरोज रज निज मनु मुकुरु सुधारि।',
      'बरनउं रघुबर बिमल जसु जो दायकु फल चारि ॥',
      'बुद्धिहीन तनु जानिके सुमिरौं पवन-कुमार।',
      'बल बुद्धि विद्या देहु मोहिं हरहु कलेस विकार ॥',
    ],
    chaupai: [
      'जय हनुमान ज्ञान गुन सागर। जय कपीस तिहुँ लोक उजागर ॥',
      'रामदूत अतुलित बल धामा। अंजनि-पुत्र पवनसुत नामा ॥',
      'महावीर विक्रम बजरंगी। कुमति निवार सुमति के संगी ॥',
      'कंचन बरन बिराज सुबेसा। कानन कुंडल कुंचित केसा ॥',
      'हाथ बज्र औ ध्वजा बिराजै। कांधे मूंज जनेऊ साजै ॥',
      'शंकर सुवन केसरी नंदन। तेज प्रताप महा जग वंदन ॥',
    ],
  },
  {
    id: 'durga-chalisa',
    title: 'Durga Chalisa',
    deity: 'durga',
    doha: [
      'नमो नमो दुर्गे सुख करनी। नमो नमो अम्बे दुःख हरनी ॥',
    ],
    chaupai: [
      'मैं हूँ दीन दयाल की दासी। करो सदा मैया मोहि राखी ॥',
      'जो नर दुःख में जपे तुम्हारा। सो नर मिटे संकट सारा ॥',
    ],
  },
  {
    id: 'ganesh-chalisa',
    title: 'Ganesh Chalisa',
    deity: 'ganesh',
    doha: ['जय गणपति सदगुण सदन। कविवर बदन कृपाल ॥'],
    chaupai: [
      'भजत राम सुजान। प्रभु प्रताप तुम राखहु मोहि जान ॥',
    ],
  },
  {
    id: 'shiv-chalisa',
    title: 'Shiv Chalisa',
    deity: 'shiv',
    doha: ['जय गणेश गिरिजा सुवन। मंगल मूल सुजान ॥'],
    chaupai: [
      'कहत अयोध्यादास तुम देहु अभय वर। जो सुमिरत शिव संकट दूर कर ॥',
    ],
  },
  {
    id: 'lakshmi-chalisa',
    title: 'Lakshmi Chalisa',
    deity: 'lakshmi',
    doha: ['मातु लक्ष्मी करो कृपा। धन देहु दीन दयाल ॥'],
    chaupai: ['जो यह चालीसा पढ़े सदा। सुख सम्पत्ति पावे अपारा ॥'],
  },
  {
    id: 'shani-chalisa',
    title: 'Shani Chalisa',
    deity: 'shani',
    doha: ['जय जय श्री शनिदेव प्रभु। सुनहु दीन हमारी ॥'],
    chaupai: ['जो पढ़े शनि चालीसा होय भव तार। संकट मिटे सब दुख दूर करे ॥'],
  },
];

export function getChalisaById(id: string): Chalisa | undefined {
  return CHALISAS.find((c) => c.id === id);
}
