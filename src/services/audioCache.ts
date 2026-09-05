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
  text: string,
  voiceId?: string
): Promise<{ uri: string | null; error: string | null }> {
  // 1. Check local cache
  const cachedUri = await getCachedMantraAudioUri(mantraId);
  if (cachedUri) {
    return { uri: cachedUri, error: null };
  }

  // 2. Synthesize via secure InsForge Edge Function
  const res = await InsForgeService.generateTtsAudio({ text, voiceId });
  if (res.error || !res.audioBase64) {
    return {
      uri: null,
      error: res.error || 'Failed to generate sacred audio recitation',
    };
  }

  // 3. Save to disk for offline listening
  try {
    const uri = await saveAudioToDisk(mantraId, res.audioBase64);
    return { uri, error: null };
  } catch (err: any) {
    return {
      uri: null,
      error: err?.message || 'Failed to cache audio on device',
    };
  }
}
