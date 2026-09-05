export interface MuhuratSlot {
  id: string;
  name: string;
  nameHindi: string;
  time: string;
  goodFor: string;
  goodForHindi: string;
  avoid?: boolean;
}

export function getTodayMuhurats(): MuhuratSlot[] {
  const day = new Date().getDay();
  const rahuStart = ['7:30–9:00', '3:00–4:30', '12:00–1:30', '1:30–3:00', '10:30–12:00', '9:00–10:30', '4:30–6:00'][day]!;

  return [
    {
      id: 'brahma',
      name: 'Brahma Muhurat',
      nameHindi: 'ब्रह्म मुहूर्त',
      time: '4:24 AM – 5:12 AM',
      goodFor: 'Meditation, yoga, mantra jaap, study',
      goodForHindi: 'ध्यान, योग, मंत्र जाप, अध्ययन',
    },
    {
      id: 'abhijit',
      name: 'Abhijit Muhurat',
      nameHindi: 'अभिजित मुहूर्त',
      time: '11:48 AM – 12:36 PM',
      goodFor: 'Starting new work, puja, business',
      goodForHindi: 'नया कार्य, पूजा, व्यापार',
    },
    {
      id: 'godhuli',
      name: 'Godhuli Muhurat',
      nameHindi: 'गोधूलि मुहूर्त',
      time: '6:12 PM – 6:36 PM',
      goodFor: 'Evening aarti, sandhya vandan',
      goodForHindi: 'संध्या आरती, संध्या वंदन',
    },
    {
      id: 'rahu',
      name: 'Rahu Kaal',
      nameHindi: 'राहु काल',
      time: rahuStart,
      goodFor: 'Avoid starting new ventures',
      goodForHindi: 'नया कार्य शुरू न करें',
      avoid: true,
    },
    {
      id: 'amrit',
      name: 'Amrit Kaal',
      nameHindi: 'अमृत काल',
      time: '6:00 AM – 7:30 AM',
      goodFor: 'Morning puja, temple visit',
      goodForHindi: 'प्रातः पूजा, मंदिर दर्शन',
    },
  ];
}
