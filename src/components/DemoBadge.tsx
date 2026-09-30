import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';

/**
 * DemoBadge — shown whenever recall.is_demo is true.
 * Makes it crystal clear this is NOT a real recall alert.
 * Uses i18n for English / Hindi support.
 */
export default function DemoBadge() {
  const { t } = useI18n();

  return (
    <View style={styles.badge}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>{t.verdict.demoBadge}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 193, 7, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  text: {
    color: '#FFC107',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
