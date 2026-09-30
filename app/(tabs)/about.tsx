import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n, Language } from '../../src/i18n';
import DemoBadge from '../../src/components/DemoBadge';

/**
 * About screen — Stage 7.
 * Explains:
 *  - What the app does
 *  - What the app DOES NOT do (safety & chemical disclaimer)
 *  - Student prototype notice & demo data explanation
 *  - Privacy & local UUID device ID
 *  - Language toggle (English / हिन्दी)
 */
export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, t } = useI18n();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 36 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Title & Subtitle ─────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.title}>{t.about.title}</Text>
        <Text style={styles.subtitle}>{t.about.subtitle}</Text>
      </View>

      {/* ── Language Switcher Card ───────────────────────── */}
      <View style={styles.languageCard}>
        <View style={styles.langHeaderRow}>
          <Text style={styles.langIcon}>🌐</Text>
          <Text style={styles.langTitle}>{t.about.languageSection}</Text>
        </View>

        <View style={styles.langButtonRow}>
          <TouchableOpacity
            style={[styles.langButton, language === 'en' && styles.langButtonActive]}
            onPress={() => setLanguage('en')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langButtonText, language === 'en' && styles.langButtonTextActive]}>
              English
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langButton, language === 'hi' && styles.langButtonActive]}
            onPress={() => setLanguage('hi')}
            activeOpacity={0.8}
          >
            <Text style={[styles.langButtonText, language === 'hi' && styles.langButtonTextActive]}>
              हिन्दी (Hindi)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 1. What this app does ────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>🔍</Text>
          <Text style={styles.cardTitle}>{t.about.whatItDoesTitle}</Text>
        </View>
        <Text style={styles.cardText}>{t.about.whatItDoesText}</Text>
      </View>

      {/* ── 2. What this app DOES NOT do (Crucial Safety) ── */}
      <View style={[styles.card, styles.warningCard]}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>⚠️</Text>
          <Text style={[styles.cardTitle, styles.warningTitle]}>
            {t.about.whatItDoesNotDoTitle}
          </Text>
        </View>
        <Text style={styles.cardText}>{t.about.whatItDoesNotDoText}</Text>
      </View>

      {/* ── 3. Prototype & Demo Data Notice ──────────────── */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>🎓</Text>
          <Text style={styles.cardTitle}>{t.about.prototypeNoticeTitle}</Text>
        </View>
        <Text style={styles.cardText}>{t.about.prototypeNoticeText}</Text>

        <View style={styles.demoBadgeRow}>
          <DemoBadge />
        </View>
      </View>

      {/* ── 4. Privacy & Device ID ───────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardIcon}>🔒</Text>
          <Text style={styles.cardTitle}>{t.about.privacyTitle}</Text>
        </View>
        <Text style={styles.cardText}>{t.about.privacyText}</Text>
      </View>

      {/* ── Version & Academic Footer ────────────────────── */}
      <Text style={styles.version}>{t.about.version}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#16213E',
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#4CC9F0',
    marginTop: 4,
    fontWeight: '500',
  },

  // ── Language Selector ────────────────────────────────────
  languageCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 201, 240, 0.4)',
  },
  langHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  langIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  langTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  langButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.15)',
    borderColor: '#4CC9F0',
  },
  langButtonText: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
  },
  langButtonTextActive: {
    color: '#4CC9F0',
    fontWeight: '700',
  },

  // ── Info Cards ───────────────────────────────────────────
  card: {
    backgroundColor: '#1A1A2E',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4CC9F0',
  },
  cardText: {
    fontSize: 13,
    color: '#CCCCDD',
    lineHeight: 21,
  },

  // ── Warning / Safety Card ────────────────────────────────
  warningCard: {
    borderColor: 'rgba(255, 167, 38, 0.35)',
    backgroundColor: 'rgba(255, 167, 38, 0.06)',
  },
  warningTitle: {
    color: '#FFA726',
  },

  demoBadgeRow: {
    marginTop: 12,
  },

  version: {
    textAlign: 'center',
    color: '#666688',
    fontSize: 12,
    marginTop: 16,
  },
});
