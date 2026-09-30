import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = 'medshield_device_id';

/**
 * Returns a persistent, anonymous device ID.
 *
 * On first call it generates a random UUID (via expo-crypto)
 * and saves it to AsyncStorage. On subsequent calls it returns
 * the stored value. No personal data is collected — this ID is
 * only used to tag scan requests so the backend can group them.
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Try to load existing ID
    const stored = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (stored) {
      return stored;
    }

    // First run — generate a new UUID and persist it
    const newId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
    return newId;
  } catch (error) {
    // If AsyncStorage fails, generate a fresh UUID each time.
    // This is a fallback so the app never crashes.
    console.warn('Could not persist device ID:', error);
    return Crypto.randomUUID();
  }
}
