/**
 * TypeScript types for the MedShield API contract.
 * These match the backend responses exactly — do not change
 * without coordinating with the API team.
 */

/** Possible scan verdicts returned by the API */
export type ScanStatus = 'RECALLED' | 'NOT_ON_LIST' | 'UNREADABLE';

/** Product info extracted from the medicine strip */
export interface Product {
  brand: string;
  strength: string;
}

/** Recall details (only present when status is RECALLED) */
export interface RecallInfo {
  alert_date: string;
  reason: string;
  /** If true, this is demo/test data, not a real recall alert */
  is_demo: boolean;
}

/** The full response from POST /v1/scan */
export interface ScanResponse {
  status: ScanStatus;
  batch_code: string | null;
  confidence: number | null;       // 0 to 1
  cells_read: number;
  product: Product | null;
  recall: RecallInfo | null;
  message: string;
}

/** Response from GET /v1/health */
export interface HealthResponse {
  status: string;
}
