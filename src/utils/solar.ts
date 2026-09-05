/**
 * Sunrise, solar noon and sunset from latitude and longitude.
 *
 * NOAA's solar position algorithm, which is accurate to well under a minute for
 * Indian latitudes — far tighter than muhurat needs. No dependency and no
 * network: the app must open and be useful offline.
 *
 * Why this exists: every muhurat in the app used to be a hardcoded string for a
 * single unnamed location. India spans roughly 30° of longitude, so sunrise in
 * Gujarat and in Arunachal differ by over an hour, and every derived window —
 * Brahma Muhurat, Abhijit, Godhuli, Rahu Kaal — was wrong for almost everyone.
 *
 * Times are computed in IST (+05:30) regardless of the device clock, so a
 * traveller still sees Indian muhurat rather than local-time nonsense.
 */

const IST_OFFSET_MINUTES = 330; // +05:30
const DEG = Math.PI / 180;

/** Minutes past IST midnight, or null on a polar day/night (never in India). */
export interface SolarDay {
  sunriseMin: number | null;
  solarNoonMin: number;
  sunsetMin: number | null;
}

/** Days since the J2000.0 epoch for a given calendar date at 00:00 UTC. */
function julianDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000
    + 2440587.5;
}

/**
 * NOAA solar geometry for one day.
 * @param lat  degrees north
 * @param lon  degrees east
 */
export function computeSolarDay(date: Date, lat: number, lon: number): SolarDay {
  // Julian century from J2000.0, taken at local solar noon for stability.
  const jd = julianDay(date);
  const t = (jd - 2451545) / 36525;

  const meanLongitude = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);

  const centre =
    Math.sin(meanAnomaly * DEG) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * meanAnomaly * DEG) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * meanAnomaly * DEG) * 0.000289;

  const trueLongitude = meanLongitude + centre;
  const apparentLongitude =
    trueLongitude - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * DEG);

  const meanObliquity =
    23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliquity = meanObliquity + 0.00256 * Math.cos((125.04 - 1934.136 * t) * DEG);

  const declination = Math.asin(
    Math.sin(obliquity * DEG) * Math.sin(apparentLongitude * DEG),
  ) / DEG;

  // Equation of time, in minutes.
  const y = Math.tan((obliquity / 2) * DEG) ** 2;
  const eqTime =
    4 *
    (y * Math.sin(2 * meanLongitude * DEG) -
      2 * eccentricity * Math.sin(meanAnomaly * DEG) +
      4 * eccentricity * y * Math.sin(meanAnomaly * DEG) * Math.cos(2 * meanLongitude * DEG) -
      0.5 * y * y * Math.sin(4 * meanLongitude * DEG) -
      1.25 * eccentricity * eccentricity * Math.sin(2 * meanAnomaly * DEG)) / DEG;

  // Solar noon in minutes past IST midnight.
  const solarNoonMin = 720 - 4 * lon - eqTime + IST_OFFSET_MINUTES;

  // Hour angle of sunrise. 90.833° accounts for refraction and the solar disc.
  const cosHourAngle =
    (Math.cos(90.833 * DEG) - Math.sin(lat * DEG) * Math.sin(declination * DEG)) /
    (Math.cos(lat * DEG) * Math.cos(declination * DEG));

  if (cosHourAngle > 1 || cosHourAngle < -1) {
    // Sun never rises or never sets. Cannot happen in India, but the caller
    // must not be handed a NaN.
    return { sunriseMin: null, solarNoonMin, sunsetMin: null };
  }

  const hourAngle = Math.acos(cosHourAngle) / DEG;
  return {
    sunriseMin: solarNoonMin - hourAngle * 4,
    solarNoonMin,
    sunsetMin: solarNoonMin + hourAngle * 4,
  };
}

/** Formats minutes past midnight as "6:12 AM". Wraps across midnight safely. */
export function formatTime(minutes: number): string {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mm).padStart(2, '0')} ${suffix}`;
}

/** Formats a window as "4:26 AM – 5:14 AM". */
export function formatWindow(startMin: number, endMin: number): string {
  return `${formatTime(startMin)} – ${formatTime(endMin)}`;
}

/**
 * Rahu Kaal for a given day.
 *
 * The daytime (sunrise to sunset) is divided into eight equal parts and one is
 * inauspicious, by weekday. The sequence below is indexed by JavaScript's
 * `getDay()`, where **0 is Sunday**.
 *
 * This is where the old bug lived: the app held the correct segment sequence in
 * its canonical *Monday-first* order but indexed it with a Sunday-zero
 * `getDay()`, so every user was shown the next day's Rahu Kaal — every day.
 * For the one window in the app that says "avoid", that is the worst kind of
 * wrong. The order here is Sunday-first, matching the index.
 *
 * Segments are 1-based: Sunday takes the 8th eighth, Monday the 2nd, and so on.
 */
const RAHU_SEGMENT_BY_WEEKDAY = [8, 2, 7, 5, 6, 4, 3]; // Sun, Mon, Tue, Wed, Thu, Fri, Sat

export function rahuKaalWindow(
  weekday: number,
  sunriseMin: number,
  sunsetMin: number,
): { startMin: number; endMin: number } {
  const eighth = (sunsetMin - sunriseMin) / 8;
  const segment = RAHU_SEGMENT_BY_WEEKDAY[((weekday % 7) + 7) % 7]!;
  const startMin = sunriseMin + (segment - 1) * eighth;
  return { startMin, endMin: startMin + eighth };
}
