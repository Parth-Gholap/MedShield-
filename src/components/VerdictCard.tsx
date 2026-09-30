import { View, Text, StyleSheet } from 'react-native';
import type { ScanResponse } from '../api/types';
import DemoBadge from './DemoBadge';
import { useI18n } from '../i18n';

/**
 * VerdictCard — the main result display for a scan.
 *
 * Three visually distinct states:
 *   RECALLED      → red   (danger)
 *   NOT_ON_LIST   → amber (neutral — never green, never "safe")
 *   UNREADABLE    → grey  (could not read the strip)
 *
 * Shows batch code, confidence %, product info, and recall details.
 * If recall.is_demo is true, renders the DemoBadge.
 * All user-facing strings are dynamically translated via useI18n.
 */

// ── colour palettes per status ──────────────────────────────
const STATUS_THEME = {
  RECALLED: {
    bg: 'rgba(220, 53, 69, 0.12)',
    border: 'rgba(220, 53, 69, 0.5)',
    accent: '#DC3545',
    icon: '🚨',
  },
  NOT_ON_LIST: {
    bg: 'rgba(255, 167, 38, 0.12)',
    border: 'rgba(255, 167, 38, 0.4)',
    accent: '#FFA726',
    icon: '🔍',
  },
  UNREADABLE: {
    bg: 'rgba(158, 158, 158, 0.12)',
    border: 'rgba(158, 158, 158, 0.4)',
    accent: '#9E9E9E',
    icon: '❓',
  },
} as const;

interface VerdictCardProps {
  data: ScanResponse;
}

export default function VerdictCard({ data }: VerdictCardProps) {
  const { t } = useI18n();
  const theme = STATUS_THEME[data.status];

  // Dynamic status label from i18n
  const statusLabel =
    data.status === 'RECALLED'
      ? t.verdict.recalled
      : data.status === 'NOT_ON_LIST'
      ? t.verdict.notOnList
      : t.verdict.unreadable;

  // Use localized message if applicable, or server message
  const displayMessage =
    data.status === 'NOT_ON_LIST'
      ? t.verdict.notOnListNote
      : data.status === 'UNREADABLE'
      ? t.verdict.unreadableNote
      : data.message;

  return (
    <View style={[styles.card, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      {/* ── Status icon + label ─────────────────────────── */}
      <Text style={styles.statusIcon}>{theme.icon}</Text>
      <Text style={[styles.statusLabel, { color: theme.accent }]}>
        {statusLabel}
      </Text>

      {/* ── Message ─────────────────────────────────────── */}
      <Text style={styles.message}>{displayMessage}</Text>

      {/* ── Batch code (never guess or repair) ──────────── */}
      {data.batch_code !== null && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.verdict.batchCode}</Text>
          <Text style={[styles.detailValue, styles.monoText]}>
            {data.batch_code}
          </Text>
        </View>
      )}

      {/* ── Confidence (as a %) ─────────────────────────── */}
      {data.confidence !== null && (
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t.verdict.ocrConfidence}</Text>
          <Text style={styles.detailValue}>
            {Math.round(data.confidence * 100)}%
          </Text>
        </View>
      )}

      {/* ── Cells read ──────────────────────────────────── */}
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{t.verdict.cellsRead}</Text>
        <Text style={styles.detailValue}>{data.cells_read}</Text>
      </View>

      {/* ── Product info ────────────────────────────────── */}
      {data.product && (
        <View style={styles.productBox}>
          <Text style={styles.productBrand}>{data.product.brand}</Text>
          <Text style={styles.productStrength}>{data.product.strength}</Text>
        </View>
      )}

      {/* ── Recall details (only when RECALLED) ─────────── */}
      {data.recall && (
        <View style={[styles.recallBox, { borderColor: theme.border }]}>
          <Text style={styles.recallTitle}>{t.verdict.recallDetails}</Text>
          <Text style={styles.recallReason}>{data.recall.reason}</Text>
          <Text style={styles.recallDate}>
            {t.verdict.alertDate}: {data.recall.alert_date}
          </Text>
        </View>
      )}

      {/* ── Demo badge ──────────────────────────────────── */}
      {data.recall?.is_demo && (
        <View style={styles.demoBadgeWrap}>
          <DemoBadge />
        </View>
      )}
    </View>
  );
}

// ── Styles ──────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },

  // Status header
  statusIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
    textAlign: 'center',
  },

  // API message
  message: {
    fontSize: 15,
    color: '#CCCCDD',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },

  // Key–value rows
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  detailLabel: {
    fontSize: 14,
    color: '#8888AA',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  monoText: {
    fontFamily: 'monospace',
    letterSpacing: 1,
  },

  // Product
  productBox: {
    marginTop: 16,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  productBrand: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  productStrength: {
    fontSize: 14,
    color: '#AAAACC',
    marginTop: 2,
  },

  // Recall details
  recallBox: {
    marginTop: 16,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  recallTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC3545',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  recallReason: {
    fontSize: 14,
    color: '#FFCCCC',
    lineHeight: 20,
    marginBottom: 6,
  },
  recallDate: {
    fontSize: 12,
    color: '#AA8888',
  },

  // Demo badge wrapper
  demoBadgeWrap: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
});
