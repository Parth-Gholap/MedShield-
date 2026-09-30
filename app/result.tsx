import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';
import VerdictCard from '../src/components/VerdictCard';
import type { ScanResponse } from '../src/api/types';
import { useI18n } from '../src/i18n';

/**
 * Result screen — shows the VerdictCard for a scan result.
 *
 * Receives scan data as a JSON-encoded `data` search param,
 * OR a `demo` param to show hard-coded samples (for testing).
 */

// ── Hard-coded samples for the demo switcher ────────────────
const SAMPLES: Record<string, ScanResponse> = {
  RECALLED: {
    status: 'RECALLED',
    batch_code: 'MFG2024-X7R3',
    confidence: 0.92,
    cells_read: 3,
    product: { brand: 'Paracetamol Plus', strength: '500 mg' },
    recall: {
      alert_date: '2024-08-15',
      reason: 'Contamination detected during quality inspection. Batch withdrawn from distribution.',
      is_demo: true,
    },
    message: 'This batch has been recalled. Do not consume. Return to your chemist.',
  },
  NOT_ON_LIST: {
    status: 'NOT_ON_LIST',
    batch_code: 'BN-20240301-K9',
    confidence: 0.87,
    cells_read: 2,
    product: { brand: 'Amoxicillin Capsules', strength: '250 mg' },
    recall: null,
    message: 'Not on recall list. Check with your chemist or doctor if unsure.',
  },
  UNREADABLE: {
    status: 'UNREADABLE',
    batch_code: null,
    confidence: null,
    cells_read: 0,
    product: null,
    recall: null,
    message: 'Could not read the batch code. Please retake the photo with better lighting and focus.',
  },
};

export default function ResultScreen() {
  const router = useRouter();
  const { t } = useI18n();
  const params = useLocalSearchParams<{ data?: string; demo?: string }>();

  // Parse scan data from params — either real JSON data or a demo key
  const scanData: ScanResponse = useMemo(() => {
    // If we received real data (from the API), parse it
    if (params.data) {
      try {
        return JSON.parse(params.data) as ScanResponse;
      } catch {
        // Fall through to demo data if parsing fails
      }
    }
    // Otherwise show a demo sample
    const demoKey = params.demo && params.demo in SAMPLES ? params.demo : 'RECALLED';
    return SAMPLES[demoKey];
  }, [params.data, params.demo]);

  const isUnreadable = scanData.status === 'UNREADABLE';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* ── Verdict Card ─────────────────────────────────── */}
      <VerdictCard data={scanData} />

      {/* ── Action Buttons ───────────────────────────────── */}
      <View style={styles.buttonRow}>
        <Pressable
          style={[
            styles.button,
            isUnreadable ? styles.buttonPrimary : styles.buttonSecondary,
          ]}
          onPress={() => router.back()}
        >
          <Text
            style={[
              styles.buttonText,
              isUnreadable ? styles.buttonTextPrimary : styles.buttonTextSecondary,
            ]}
          >
            {isUnreadable ? t.verdict.retakePhoto : t.verdict.retake}
          </Text>
        </Pressable>

        {!isUnreadable && (
          <Pressable
            style={[styles.button, styles.buttonPrimary]}
            onPress={() => router.back()}
          >
            <Text style={[styles.buttonText, styles.buttonTextPrimary]}>
              {t.verdict.done}
            </Text>
          </Pressable>
        )}
      </View>

      {/* ── Demo state switcher (only when not showing real data) ── */}
      {!params.data && (
        <View style={styles.demoSwitcher}>
          <Text style={styles.demoTitle}>Demo: tap to switch verdict</Text>
          <View style={styles.demoRow}>
            {Object.keys(SAMPLES).map((key) => {
              const isActive =
                (params.demo || 'RECALLED') === key;
              return (
                <Pressable
                  key={key}
                  style={[
                    styles.demoChip,
                    isActive && styles.demoChipActive,
                  ]}
                  onPress={() => router.setParams({ demo: key })}
                >
                  <Text
                    style={[
                      styles.demoChipText,
                      isActive && styles.demoChipTextActive,
                    ]}
                  >
                    {key.replace(/_/g, ' ')}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#16213E' },
  content: { padding: 20, paddingBottom: 48 },

  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: { backgroundColor: '#4CC9F0' },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4CC9F0',
  },
  buttonText: { fontSize: 15, fontWeight: '700' },
  buttonTextPrimary: { color: '#1A1A2E' },
  buttonTextSecondary: { color: '#4CC9F0' },

  demoSwitcher: {
    marginTop: 32,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderStyle: 'dashed',
  },
  demoTitle: {
    color: '#666688',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  demoRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  demoChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  demoChipActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.15)',
    borderColor: '#4CC9F0',
  },
  demoChipText: { color: '#8888AA', fontSize: 12, fontWeight: '600' },
  demoChipTextActive: { color: '#4CC9F0' },
});
