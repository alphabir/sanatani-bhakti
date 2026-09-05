import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

/**
 * Durable session storage.
 *
 * Why SecureStore and not AsyncStorage: this holds a real password and refresh
 * token. AsyncStorage is plain text on disk. SecureStore is backed by the
 * Android Keystore.
 *
 * A consequence worth knowing: the Keystore key does not survive a device
 * restore, so `app.json` sets `allowBackup: false`. Without that, Auto Backup
 * would restore AsyncStorage onto a new device but not the key that decrypts
 * these values — the reads below would throw, the app would mint a fresh guest,
 * and the user's punya would be stranded on a row nobody can reach.
 *
 * Every read is wrapped: a decrypt failure must read as "no credential", never
 * as a crash. The caller then creates a new guest, which is the correct
 * recovery.
 */

const KEY_ACCESS = 'sanatani.accessToken';
const KEY_REFRESH = 'sanatani.refreshToken';
const KEY_GUEST_EMAIL = 'sanatani.guest.email';
const KEY_GUEST_PASSWORD = 'sanatani.guest.password';

async function get(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(key);
  } catch {
    // Restored device, cleared keystore, or a platform without SecureStore.
    return null;
  }
}

async function put(key: string, value: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch {
    // A failed write must never break a devotional flow. Worst case the user
    // is treated as a new guest next launch.
  }
}

async function drop(key: string): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // Ignore — see put().
  }
}

export interface StoredTokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export interface GuestCredential {
  email: string;
  password: string;
}

export const Session = {
  async getTokens(): Promise<StoredTokens> {
    const [accessToken, refreshToken] = await Promise.all([get(KEY_ACCESS), get(KEY_REFRESH)]);
    return { accessToken, refreshToken };
  },

  async saveTokens(accessToken: string | null, refreshToken: string | null): Promise<void> {
    if (accessToken) await put(KEY_ACCESS, accessToken);
    if (refreshToken) await put(KEY_REFRESH, refreshToken);
  },

  async clearTokens(): Promise<void> {
    await Promise.all([drop(KEY_ACCESS), drop(KEY_REFRESH)]);
  },

  async getGuestCredential(): Promise<GuestCredential | null> {
    const [email, password] = await Promise.all([get(KEY_GUEST_EMAIL), get(KEY_GUEST_PASSWORD)]);
    return email && password ? { email, password } : null;
  },

  async saveGuestCredential(cred: GuestCredential): Promise<void> {
    await Promise.all([put(KEY_GUEST_EMAIL, cred.email), put(KEY_GUEST_PASSWORD, cred.password)]);
  },

  async clearGuestCredential(): Promise<void> {
    await Promise.all([drop(KEY_GUEST_EMAIL), drop(KEY_GUEST_PASSWORD)]);
  },

  /** Wipes everything. Used by sign-out and by account deletion. */
  async clearAll(): Promise<void> {
    await Promise.all([this.clearTokens(), this.clearGuestCredential()]);
  },

  /**
   * Mints a guest credential.
   *
   * InsForge has no anonymous auth and no account linking, so a guest is a real
   * account with a synthesized email and password that the user never sees or
   * types. Both must be unguessable: the email is the account's only public
   * identifier, so a predictable one would let anyone target another guest's
   * account through password reset or sign-in attempts.
   *
   * `expo-crypto` is used rather than Math.random() for exactly that reason.
   * The `.invalid` TLD is reserved by RFC 2606 and can never be a real domain,
   * so these addresses cannot collide with or be delivered to anyone.
   */
  async mintGuestCredential(): Promise<GuestCredential> {
    const id = Crypto.randomUUID();
    const bytes = await Crypto.getRandomBytesAsync(24);
    const password = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return { email: `guest-${id}@guest.sanatanibhakti.invalid`, password };
  },
};
