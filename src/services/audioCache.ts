import * as FileSystem from 'expo-file-system/legacy';
import { InsForgeService } from './insforge';

const AUDIO_SUBDIR = 'vedic_audio/';

function getAudioDirPath(): string {
  const base = FileSystem.documentDirectory || FileSystem.cacheDirectory || '';
  return base.endsWith('/') ? `${base}${AUDIO_SUBDIR}` : `${base}/${AUDIO_SUBDIR}`;
}

/**
 * Ensures the local audio directory exists on the device.
 */
export async function ensureAudioDirExists(): Promise<void> {
  const dir = getAudioDirPath();
  try {
    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  } catch (err) {
    console.warn('[AudioCache] Could not verify/create audio dir:', err);
  }
}

/**
 * Checks if a mantra's audio is already saved locally on device.
 */
export async function getCachedMantraAudioUri(mantraId: string): Promise<string | null> {
  try {
    const fileUri = `${getAudioDirPath()}${mantraId}.mp3`;
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists && !info.isDirectory) {
      return fileUri;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Writes base64 MP3 data to the device file system for offline playback.
 */
export async function saveAudioToDisk(mantraId: string, base64Data: string): Promise<string> {
  await ensureAudioDirExists();
  const fileUri = `${getAudioDirPath()}${mantraId}.mp3`;
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}

/**
 * Retrieves audio URI: returns cached file if present, otherwise synthesizes via InsForge ElevenLabs Edge Function and caches to disk.
 */
export async function getOrGenerateMantraAudio(
  mantraId: string,
): Promise<{
  uri: string | null;
  error: string | null;
  /**
   * Whether this came off disk. The caller needs to know because a cache hit
   * costs nothing and must never be gated, counted, or nudged about — replaying
   * a mantra you already downloaded stays free forever.
   */
  fromCache: boolean;
  quotaExhausted?: boolean;
  isGuest?: boolean;
  remaining?: number;
}> {
  // 1. Local cache first, always. Free and offline.
  const cachedUri = await getCachedMantraAudioUri(mantraId);
  if (cachedUri) {
    return { uri: cachedUri, error: null, fromCache: true };
  }

  // 2. Otherwise synthesize. The server resolves the text from its own
  //    whitelist by id, enforces the quota, and refunds it if ElevenLabs fails.
  const res = await InsForgeService.generateTtsAudio({ mantraId });
  if (res.error || !res.audioBase64) {
    return {
      uri: null,
      error: res.error || 'Failed to generate sacred audio recitation',
      fromCache: false,
      quotaExhausted: res.quotaExhausted,
      isGuest: res.isGuest,
      remaining: res.remaining,
    };
  }

  // 3. Save to disk so it is never paid for twice.
  try {
    const uri = await saveAudioToDisk(mantraId, res.audioBase64);
    return { uri, error: null, fromCache: false, remaining: res.remaining, isGuest: res.isGuest };
  } catch (err: any) {
    return {
      uri: null,
      error: err?.message || 'Failed to cache audio on device',
      fromCache: false,
    };
  }
}
