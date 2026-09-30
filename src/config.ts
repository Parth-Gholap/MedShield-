/**
 * App configuration — reads from EXPO_PUBLIC_* environment variables.
 *
 * EXPO_PUBLIC_API_BASE_URL  – the root URL of the backend API
 * EXPO_PUBLIC_USE_MOCK      – set to "true" to use the built-in mock client
 *                             (no real backend needed)
 */

export const API_BASE_URL: string =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export const USE_MOCK: boolean =
  process.env.EXPO_PUBLIC_USE_MOCK === 'true';
