import { Asset as BundledAsset } from 'expo-asset';
import { File, Paths } from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import { Asset as MediaAsset, requestPermissionsAsync } from 'expo-media-library';
import { Platform } from 'react-native';

export type SaveResult =
  | { ok: true; contentUri: string }
  | { ok: false; reason: 'permission' | 'failed' };

/**
 * Copies a bundled asset out of the APK into the cache under a real filename.
 *
 * MediaStore infers a file's type from its extension, so the copy must keep the
 * `.mp3` / `.jpg` suffix — the raw bundled asset URI often has none.
 */
async function stageBundledAsset(moduleId: number, filename: string): Promise<string | null> {
  const asset = BundledAsset.fromModule(moduleId);
  await asset.downloadAsync();
  if (!asset.localUri) return null;

  const destination = new File(Paths.cache, filename);
  if (destination.exists) destination.delete();
  new File(asset.localUri).copy(destination);
  return destination.uri;
}

/**
 * Saves a bundled ringtone into the device's media store.
 *
 * Deliberately does NOT call Android's `RingtoneManager` to set the ringtone in
 * one tap: that needs the `WRITE_SETTINGS` special permission, which Google
 * scrutinises heavily, has no maintained React Native binding, and is known to
 * fail on Samsung and Android 14+. Saving the file and sending the user to the
 * system sound picker costs one extra tap and works on every device.
 */
export async function saveRingtone(moduleId: number, filename: string): Promise<SaveResult> {
  // NOTE: READ_MEDIA_AUDIO is no longer declared. app.json pins
  // expo-media-library to `granularPermissions: ["photo"]`, because Play's
  // Photo and Video Permissions policy rejects broad media access for an app
  // that only saves files. This is unreachable today — the ringtone feature is
  // hidden until `assets/audio/` is populated (see HAS_RINGTONES) — but when
  // ringtones do ship, add "audio" back to granularPermissions and re-run
  // `expo prebuild --clean`, or this request will always be denied.
  const permission = await requestPermissionsAsync(false, ['audio']);
  if (!permission.granted) return { ok: false, reason: 'permission' };

  try {
    const staged = await stageBundledAsset(moduleId, filename);
    if (!staged) return { ok: false, reason: 'failed' };
    const asset = await MediaAsset.create(staged);
    return { ok: true, contentUri: asset.id };
  } catch (error) {
    if (__DEV__) console.warn('[media] saveRingtone failed:', error);
    return { ok: false, reason: 'failed' };
  }
}

/**
 * Saves an image that already exists on disk (e.g. a view-shot capture) into
 * the user's gallery.
 *
 * @returns the content URI on success — on Android this is a `content://` URI,
 *   which is the only form other apps are allowed to read.
 */
export async function saveImageToGallery(fileUri: string): Promise<SaveResult> {
  const permission = await requestPermissionsAsync(false, ['photo']);
  if (!permission.granted) return { ok: false, reason: 'permission' };

  try {
    const asset = await MediaAsset.create(fileUri);
    return { ok: true, contentUri: asset.id };
  } catch (error) {
    if (__DEV__) console.warn('[media] saveImageToGallery failed:', error);
    return { ok: false, reason: 'failed' };
  }
}

/** Opens the system sound settings so the user can pick their new ringtone. */
export async function openSoundSettings(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    await IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.SOUND_SETTINGS);
  } catch (error) {
    if (__DEV__) console.warn('[media] openSoundSettings failed:', error);
  }
}

/**
 * Hands a saved image to Android's own "Set as wallpaper" chooser.
 *
 * Requires a `content://` URI: passing `file://` across an app boundary throws
 * FileUriExposedException on Android 7+. `saveImageToGallery` returns the right
 * form, so always call this with its result.
 */
export async function setAsWallpaper(contentUri: string): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    await IntentLauncher.startActivityAsync('android.intent.action.ATTACH_DATA', {
      data: contentUri,
      type: 'image/jpeg',
      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
    });
    return true;
  } catch (error) {
    if (__DEV__) console.warn('[media] setAsWallpaper failed:', error);
    return false;
  }
}
