import type { DeityId } from '../constants/theme';

export interface Ringtone {
  id: string;
  title: string;
  titleHindi: string;
  deity: DeityId;
  duration: string;
  description: string;
  /**
   * The bundled audio asset, via `require('../../assets/audio/<file>.mp3')`.
   *
   * Entries without a file are treated as not shipped: they are filtered out of
   * the UI entirely by `PLAYABLE_RINGTONES` below, so the app never renders a
   * play button that does nothing. A dead button is exactly what Google's
   * Minimum Functionality policy rejects apps for.
   */
  file?: number;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TODO(you): drop licensed MP3s into `assets/audio/` and uncomment the matching
 * `file:` line below. See `assets/audio/README.md` for the expected filenames
 * and the licensing constraints — the Chalisa and Tandav texts are public
 * domain, but any particular *recording* of them is not.
 *
 * `require()` fails the bundler if the file is missing, so a `file:` line must
 * stay commented until its MP3 actually exists.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const RINGTONES: Ringtone[] = [
  {
    id: 'om-chant',
    title: 'Om Chanting',
    titleHindi: 'ॐ जाप',
    deity: 'vishnu',
    duration: '0:30',
    description: 'Sacred Om vibration for morning alarm',
    // file: require('../../assets/audio/om-chant.mp3'),
  },
  {
    id: 'temple-bell',
    title: 'Temple Bell',
    titleHindi: 'मंदिर की घंटी',
    deity: 'shiv',
    duration: '0:15',
    description: 'Traditional mandir ghanti sound',
    // file: require('../../assets/audio/temple-bell.mp3'),
  },
  {
    id: 'hanuman-chalisa-hook',
    title: 'Hanuman Chalisa',
    titleHindi: 'हनुमान चालीसा',
    deity: 'hanuman',
    duration: '0:45',
    description: 'Opening doha of Hanuman Chalisa',
    // file: require('../../assets/audio/hanuman-chalisa-hook.mp3'),
  },
  {
    id: 'gayatri-mantra',
    title: 'Gayatri Mantra',
    titleHindi: 'गायत्री मंत्र',
    deity: 'vishnu',
    duration: '0:40',
    description: 'Morning Gayatri for spiritual start',
    // file: require('../../assets/audio/gayatri-mantra.mp3'),
  },
  {
    id: 'shiv-tandav',
    title: 'Shiv Tandav',
    titleHindi: 'शिव तांडव',
    deity: 'shiv',
    duration: '1:00',
    description: 'Powerful Shiv Tandav opening',
    // file: require('../../assets/audio/shiv-tandav.mp3'),
  },
  {
    id: 'krishna-flute',
    title: 'Krishna Flute',
    titleHindi: 'कृष्ण की बांसुरी',
    deity: 'krishna',
    duration: '0:50',
    description: 'Melodious bansuri of Lord Krishna',
    // file: require('../../assets/audio/krishna-flute.mp3'),
  },
  {
    id: 'aarti-bell',
    title: 'Aarti Bell',
    titleHindi: 'आरती की घंटी',
    deity: 'ganesh',
    duration: '0:20',
    description: 'Evening aarti bell melody',
    // file: require('../../assets/audio/aarti-bell.mp3'),
  },
  {
    id: 'ram-dhun',
    title: 'Ram Dhun',
    titleHindi: 'राम धुन',
    deity: 'ram',
    duration: '0:35',
    description: 'Jai Shree Ram devotional tune',
    // file: require('../../assets/audio/ram-dhun.mp3'),
  },
];

/** Only ringtones whose audio actually ships. The UI renders nothing else. */
export const PLAYABLE_RINGTONES: Ringtone[] = RINGTONES.filter((r) => r.file !== undefined);

/** Whether the Ringtones feature should be advertised at all. */
export const HAS_RINGTONES = PLAYABLE_RINGTONES.length > 0;

export function getRingtoneById(id: string): Ringtone | undefined {
  return PLAYABLE_RINGTONES.find((r) => r.id === id);
}
