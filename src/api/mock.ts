import type { ScanResponse } from './types';

/**
 * Hard-coded mock responses that cycle through the 3 statuses.
 * Used when EXPO_PUBLIC_USE_MOCK=true so the app works without
 * a real backend.
 */

const MOCK_RECALLED: ScanResponse = {
  status: 'RECALLED',
  batch_code: 'MFG2024-X7R3',
  confidence: 0.92,
  cells_read: 3,
  product: { brand: 'Paracetamol Plus', strength: '500 mg' },
  recall: {
    alert_date: '2024-08-15',
    reason:
      'Contamination detected during quality inspection. Batch withdrawn from distribution.',
    is_demo: true,
  },
  message:
    'This batch has been recalled. Do not consume. Return to your chemist.',
};

const MOCK_NOT_ON_LIST: ScanResponse = {
  status: 'NOT_ON_LIST',
  batch_code: 'BN-20240301-K9',
  confidence: 0.87,
  cells_read: 2,
  product: { brand: 'Amoxicillin Capsules', strength: '250 mg' },
  recall: null,
  message: 'Not on recall list. Check with your chemist or doctor if unsure.',
};

const MOCK_UNREADABLE: ScanResponse = {
  status: 'UNREADABLE',
  batch_code: null,
  confidence: null,
  cells_read: 0,
  product: null,
  recall: null,
  message:
    'Could not read the batch code. Please retake the photo with better lighting and focus.',
};

// The three responses we cycle through
const MOCK_RESPONSES: ScanResponse[] = [
  MOCK_RECALLED,
  MOCK_NOT_ON_LIST,
  MOCK_UNREADABLE,
];

// Tracks which response to return next (cycles 0 → 1 → 2 → 0 …)
let callIndex = 0;

// Flag to simulate network failure for testing error handling and retry
let simulateFailure = false;
let failureReason = 'Network connection failed. Please check your internet connection.';

export function setSimulateMockFailure(fail: boolean, reason?: string) {
  simulateFailure = fail;
  if (reason) failureReason = reason;
}

export function isMockFailureSimulated(): boolean {
  return simulateFailure;
}

/**
 * Simulates a scan API call with clear states:
 * 1. 'uploading' (simulated upload progress)
 * 2. 'reading' (simulated OCR & lookup)
 * 3. Returns the next mock response or throws simulated error
 */
export async function mockScan(
  onProgress?: (step: 'uploading' | 'reading') => void
): Promise<ScanResponse> {
  // Step 1: Uploading state
  onProgress?.('uploading');
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (simulateFailure) {
    simulateFailure = false; // Reset after failing once so Retry can succeed!
    throw new Error(failureReason);
  }

  // Step 2: Reading / OCR state
  onProgress?.('reading');
  await new Promise((resolve) => setTimeout(resolve, 900));

  const response = MOCK_RESPONSES[callIndex % MOCK_RESPONSES.length];
  callIndex++;
  return response;
}

/**
 * Simulates the health check endpoint.
 */
export async function mockHealthCheck(): Promise<{ status: string }> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { status: 'ok' };
}
