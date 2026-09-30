import { API_BASE_URL, USE_MOCK } from '../config';
import { mockScan, mockHealthCheck } from './mock';
import { getDeviceId } from '../storage/deviceId';
import type { ScanResponse, HealthResponse } from './types';

/** 20-second timeout per project specification */
const TIMEOUT_MS = 20_000;

export type ScanProgressStep = 'uploading' | 'reading';

/**
 * Wraps a fetch call with an explicit 20-second timeout.
 * Rejects with a descriptive error message if time expires.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error(
          'Request timed out after 20 seconds. The server took too long to respond. Please tap Retry.'
        );
      }
      if (err.message && err.message.toLowerCase().includes('network request failed')) {
        throw new Error(
          'Could not connect to the MedShield server. Please check your internet connection and tap Retry.'
        );
      }
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Sends a captured & cropped medicine strip photo to the backend API.
 *
 * @param imageUri    - local URI of the cropped JPEG image
 * @param onProgress  - callback receiving intermediate states ('uploading', 'reading')
 *
 * When USE_MOCK is true, delegates to mockScan with simulated stages.
 */
export async function scanImage(
  imageUri: string,
  onProgress?: (step: ScanProgressStep) => void
): Promise<ScanResponse> {
  // ── Mock mode ───────────────────────────────────────────
  if (USE_MOCK) {
    return mockScan(onProgress);
  }

  // ── Real API mode ───────────────────────────────────────
  try {
    // Step 1: Uploading
    onProgress?.('uploading');

    const deviceId = await getDeviceId();

    // Prepare multipart form data
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: 'strip_fragment.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);

    formData.append('device_id', deviceId);

    const response = await fetchWithTimeout(`${API_BASE_URL}/v1/scan`, {
      method: 'POST',
      body: formData,
    });

    // Step 2: Reading / Processing
    onProgress?.('reading');

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      if (response.status >= 500) {
        throw new Error(
          `Server error (HTTP ${response.status}). The service may be temporarily unavailable. Please tap Retry.`
        );
      }
      throw new Error(
        `Server rejected scan (HTTP ${response.status}): ${errorText || 'Unknown error'}. Please tap Retry.`
      );
    }

    const data = await response.json().catch(() => null);
    if (!data || typeof data !== 'object' || !data.status) {
      throw new Error(
        'Received an invalid or empty response from the server. Please tap Retry.'
      );
    }

    return data as ScanResponse;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unexpected error occurred during the scan. Please tap Retry.');
  }
}

/**
 * Checks if the backend API is online.
 */
export async function checkHealth(): Promise<HealthResponse> {
  if (USE_MOCK) {
    return mockHealthCheck();
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/v1/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Health check returned HTTP ${response.status}`);
    }

    return (await response.json()) as HealthResponse;
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('Unable to reach MedShield health endpoint');
  }
}
