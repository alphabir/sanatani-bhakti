import { computeSolarDay, formatWindow, rahuKaalWindow } from '../utils/solar';

export interface MuhuratSlot {
  id: string;
  name: string;
  nameHindi: string;
  time: string;
  goodFor: string;
  goodForHindi: string;
  avoid?: boolean;
}

/**
 * Reference location for muhurat.
 *
 * Every window here derives from local sunrise, so it is only correct for one
 * place. New Delhi is the default until Phase 3 adds a state picker; the screen
 * prints the city name next to the times so the user is never shown a precise
 * time without knowing what it is precise *for*.
 */
export const DEFAULT_PLACE = { name: 'New Delhi', lat: 28.6139, lon: 77.209 };

/**
 * Today's muhurat windows, derived from real solar geometry.
 *
 * Previously every value here was a hardcoded string for an unnamed location,
 * and Rahu Kaal — the one window that tells the user to *avoid* something — was
 * a day out for everyone, because a Monday-first table was indexed with a
 * Sunday-zero weekday.
 *
 * Amrit Kaal is deliberately absent: it derives from the nakshatra, which needs
 * an ephemeris the client does not have. It is better to omit it than to print
 * a fixed window and call it Amrit Kaal.
 */
export function getTodayMuhurats(
  lat: number = DEFAULT_PLACE.lat,
  lon: number = DEFAULT_PLACE.lon,
  now: Date = new Date(),
): MuhuratSlot[] {
  const { sunriseMin, solarNoonMin, sunsetMin } = computeSolarDay(now, lat, lon);

  // Cannot occur in India, but never render NaN.
  if (sunriseMin === null || sunsetMin === null) return [];

  const slots: MuhuratSlot[] = [
    {
      id: 'brahma',
      name: 'Brahma Muhurat',
      nameHindi: 'ब्रह्म मुहूर्त',
      // The two ghatis (96 minutes) before sunrise, ending 48 minutes before it.
      time: formatWindow(sunriseMin - 96, sunriseMin - 48),
      goodFor: 'Meditation, yoga, mantra jaap, study',
      goodForHindi: 'ध्यान, योग, मंत्र जाप, अध्ययन',
    },
    {
      id: 'abhijit',
      name: 'Abhijit Muhurat',
      nameHindi: 'अभिजित मुहूर्त',
      // The eighth muhurta of the day, centred on solar noon.
      time: formatWindow(solarNoonMin - 24, solarNoonMin + 24),
      goodFor: 'Starting new work, puja, business',
      goodForHindi: 'नया कार्य, पूजा, व्यापार',
    },
    {
      id: 'godhuli',
      name: 'Godhuli Muhurat',
      nameHindi: 'गोधूलि मुहूर्त',
      // "Cow-dust hour" — the light around sunset.
      time: formatWindow(sunsetMin - 12, sunsetMin + 12),
      goodFor: 'Evening aarti, sandhya vandan',
      goodForHindi: 'संध्या आरती, संध्या वंदन',
    },
  ];

  const rahu = rahuKaalWindow(now.getDay(), sunriseMin, sunsetMin);
  slots.push({
    id: 'rahu',
    name: 'Rahu Kaal',
    nameHindi: 'राहु काल',
    time: formatWindow(rahu.startMin, rahu.endMin),
    goodFor: 'Avoid starting new ventures',
    goodForHindi: 'नया कार्य शुरू न करें',
    avoid: true,
  });

  return slots;
}

/** Sunrise and sunset themselves, for display alongside the windows. */
export function getSunTimes(
  lat: number = DEFAULT_PLACE.lat,
  lon: number = DEFAULT_PLACE.lon,
  now: Date = new Date(),
): { sunrise: string; sunset: string } | null {
  const { sunriseMin, sunsetMin } = computeSolarDay(now, lat, lon);
  if (sunriseMin === null || sunsetMin === null) return null;
  return {
    sunrise: formatWindow(sunriseMin, sunriseMin).split(' – ')[0]!,
    sunset: formatWindow(sunsetMin, sunsetMin).split(' – ')[0]!,
  };
}
