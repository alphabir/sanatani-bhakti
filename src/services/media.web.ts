export type SaveResult =
  | { ok: true; contentUri: string }
  | { ok: false; reason: 'permission' | 'failed' };

/**
 * Web implementation of media saving functions.
 * Browser environments trigger native HTML file downloads instead of MediaStore/Gallery.
 */
export async function saveRingtone(moduleId: number, filename: string): Promise<SaveResult> {
  if (typeof window !== 'undefined') {
    // In web environment, ringtone download is handled via standard web link
    return { ok: true, contentUri: filename };
  }
  return { ok: false, reason: 'failed' };
}

export async function saveImageToGallery(fileUri: string): Promise<SaveResult> {
  if (typeof document !== 'undefined') {
    try {
      const a = document.createElement('a');
      a.href = fileUri;
      a.download = 'sanatani-wallpaper.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return { ok: true, contentUri: fileUri };
    } catch {
      return { ok: false, reason: 'failed' };
    }
  }
  return { ok: true, contentUri: fileUri };
}

export async function openSoundSettings(): Promise<void> {
  // Not applicable on web
}

export async function setAsWallpaper(_contentUri: string): Promise<boolean> {
  // Not applicable on web
  return false;
}
