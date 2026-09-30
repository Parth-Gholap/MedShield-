import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import type { ScanResponse } from '../api/types';

export interface HistoryItem {
  id: string;
  scannedAt: string; // ISO 8601 string, e.g. "2026-09-29T22:25:00.000Z"
  result: ScanResponse;
  imageUri?: string;
}

const HISTORY_STORAGE_KEY = '@medshield_scan_history';

/**
 * Retrieves all saved scan results from local AsyncStorage, sorted newest first.
 */
export async function getScanHistory(): Promise<HistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as HistoryItem[];
  } catch (error) {
    console.warn('Failed to load scan history:', error);
    return [];
  }
}

/**
 * Saves a new scan result to local storage.
 * Newest records are placed at the beginning of the list.
 */
export async function saveScanResult(
  result: ScanResponse,
  imageUri?: string
): Promise<HistoryItem> {
  const newItem: HistoryItem = {
    id: Crypto.randomUUID(),
    scannedAt: new Date().toISOString(),
    result,
    imageUri,
  };

  try {
    const existing = await getScanHistory();
    // Prepend new item to the top
    const updated = [newItem, ...existing];
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to persist scan result to history:', error);
  }

  return newItem;
}

/**
 * Clears all scan records from AsyncStorage.
 */
export async function clearScanHistory(): Promise<void> {
  try {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear scan history:', error);
  }
}

/**
 * Deletes a single scan record by its ID.
 */
export async function deleteScanHistoryItem(id: string): Promise<void> {
  try {
    const existing = await getScanHistory();
    const filtered = existing.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.warn(`Failed to delete scan item ${id}:`, error);
  }
}
