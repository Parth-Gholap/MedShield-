import { TouchableOpacity, View, StyleSheet, ActivityIndicator } from 'react-native';

interface ScanButtonProps {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * ScanButton — camera shutter button.
 * A prominent circular button styled like a modern camera shutter with cyan accent.
 */
export default function ScanButton({ onPress, loading = false, disabled = false }: ScanButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.outerRing, (disabled || loading) && styles.disabled]}
      accessibilityRole="button"
      accessibilityLabel="Capture photo"
    >
      <View style={styles.innerCircle}>
        {loading ? (
          <ActivityIndicator color="#16213E" size="small" />
        ) : (
          <View style={styles.shutterCenter} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#4CC9F0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(22, 33, 62, 0.4)',
  },
  innerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4CC9F0',
  },
  disabled: {
    opacity: 0.6,
  },
});
