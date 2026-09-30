import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getScanHistory,
  clearScanHistory,
  HistoryItem,
} from '../../src/storage/history';
import DemoBadge from '../../src/components/DemoBadge';
import { useI18n } from '../../src/i18n';

/**
 * Status visual configurations for History items.
 * Rules:
 *  - RECALLED: red
 *  - NOT_ON_LIST: amber (NEVER green, NEVER says "safe")
 *  - UNREADABLE: grey
 */
const STATUS_CONFIG = {
  RECALLED: {
    icon: '🚨',
    accent: '#DC3545',
    bg: 'rgba(220, 53, 69, 0.12)',
    border: 'rgba(220, 53, 69, 0.35)',
  },
  NOT_ON_LIST: {
    icon: '🔍',
    accent: '#FFA726',
    bg: 'rgba(255, 167, 38, 0.12)',
    border: 'rgba(255, 167, 38, 0.35)',
  },
  UNREADABLE: {
    icon: '❓',
    accent: '#9E9E9E',
    bg: 'rgba(158, 158, 158, 0.12)',
    border: 'rgba(158, 158, 158, 0.35)',
  },
} as const;

/**
 * Formats an ISO date string to a user-friendly format (e.g. "Sep 29, 2026 • 10:24 PM")
 */
function formatScanDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const formattedDate = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${formattedDate} • ${formattedTime}`;
  } catch {
    return isoString;
  }
}

/**
 * History screen — Stage 6 & 7.
 * Lists past scans stored locally with AsyncStorage.
 * Tap any scan to reopen its full Result screen.
 * Includes a "Clear history" action. Fully localized via useI18n.
 */
export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  /** Loads scans from AsyncStorage */
  const loadHistory = async () => {
    try {
      const items = await getScanHistory();
      setHistory(items);
    } catch (err) {
      console.warn('Could not read scan history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload history whenever this tab becomes active
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  /** Confirms and clears the scan history */
  const handleClearHistory = () => {
    if (history.length === 0) return;

    Alert.alert(
      t.history.clearConfirmTitle,
      t.history.clearConfirmMessage,
      [
        { text: t.history.cancel, style: 'cancel' },
        {
          text: t.history.clearAll,
          style: 'destructive',
          onPress: async () => {
            await clearScanHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  /** Reopens the full scan result screen for the selected item */
  const handleOpenResult = (item: HistoryItem) => {
    router.push({
      pathname: '/result',
      params: { data: JSON.stringify(item.result) },
    });
  };

  /** Renders a single history scan record */
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
    const status = item.result.status;
    const config = STATUS_CONFIG[status];
    const isDemo = item.result.recall?.is_demo;

    const statusLabel =
      status === 'RECALLED'
        ? t.verdict.recalled
        : status === 'NOT_ON_LIST'
        ? t.verdict.notOnList
        : t.verdict.unreadable;

    return (
      <TouchableOpacity
        style={[styles.itemCard, { borderColor: config.border }]}
        onPress={() => handleOpenResult(item)}
        activeOpacity={0.7}
      >
        {/* Status header row */}
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: config.bg, borderColor: config.border }]}>
            <Text style={styles.statusBadgeIcon}>{config.icon}</Text>
            <Text style={[styles.statusBadgeText, { color: config.accent }]}>
              {statusLabel}
            </Text>
          </View>

          <Text style={styles.dateText}>{formatScanDate(item.scannedAt)}</Text>
        </View>

        {/* Batch Code */}
        <View style={styles.batchRow}>
          <Text style={styles.batchLabel}>{t.history.batchLabel}</Text>
          <Text style={styles.batchValue}>
            {item.result.batch_code ? item.result.batch_code : t.history.unreadable}
          </Text>
        </View>

        {/* Product Details (if available) */}
        {item.result.product && (
          <View style={styles.productRow}>
            <Text style={styles.productText}>
              {item.result.product.brand} ({item.result.product.strength})
            </Text>
          </View>
        )}

        {/* Footer info: confidence, demo flag, and view prompt */}
        <View style={styles.cardFooter}>
          <View style={styles.tagsContainer}>
            {item.result.confidence !== null && (
              <View style={styles.confidenceTag}>
                <Text style={styles.confidenceText}>
                  {Math.round(item.result.confidence * 100)}% {t.history.match}
                </Text>
              </View>
            )}

            {isDemo && (
              <View style={styles.demoTag}>
                <Text style={styles.demoTagText}>DEMO</Text>
              </View>
            )}
          </View>

          <Text style={styles.viewDetailsText}>{t.history.viewDetails}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* ── Screen Header ───────────────────────────────── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t.history.title}</Text>
          <Text style={styles.subtitle}>
            {t.history.scansCount(history.length)}
          </Text>
        </View>

        {history.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearHistory}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>{t.history.clearAll}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Content ─────────────────────────────────────── */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#4CC9F0" />
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Text style={styles.emptyIcon}>📋</Text>
          </View>
          <Text style={styles.emptyTitle}>{t.history.noScansTitle}</Text>
          <Text style={styles.emptySubtitle}>
            {t.history.noScansDesc}
          </Text>

          <TouchableOpacity
            style={styles.scanNowButton}
            onPress={() => router.push('/(tabs)')}
            activeOpacity={0.8}
          >
            <Text style={styles.scanNowButtonText}>{t.history.scanNow}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#8888AA',
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
  },
  clearButtonText: {
    color: '#FF8888',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── List items ───────────────────────────────────────────
  listContent: {
    paddingTop: 4,
    gap: 12,
  },
  itemCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusBadgeIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 11,
    color: '#8888AA',
  },
  batchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  batchLabel: {
    fontSize: 14,
    color: '#8888AA',
    marginRight: 8,
  },
  batchValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'monospace',
    letterSpacing: 0.8,
  },
  productRow: {
    marginBottom: 10,
  },
  productText: {
    fontSize: 13,
    color: '#CCCCDD',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  confidenceTag: {
    backgroundColor: 'rgba(76, 201, 240, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  confidenceText: {
    color: '#4CC9F0',
    fontSize: 11,
    fontWeight: '600',
  },
  demoTag: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.3)',
  },
  demoTagText: {
    color: '#FFC107',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  viewDetailsText: {
    color: '#4CC9F0',
    fontSize: 12,
    fontWeight: '700',
  },

  // ── Empty State ──────────────────────────────────────────
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A1A2E',
    borderWidth: 1.5,
    borderColor: '#4CC9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyIcon: {
    fontSize: 34,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  scanNowButton: {
    backgroundColor: '#4CC9F0',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  scanNowButtonText: {
    color: '#16213E',
    fontSize: 14,
    fontWeight: '700',
  },
});
