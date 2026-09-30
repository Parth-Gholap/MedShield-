import { View, Text, StyleSheet } from 'react-native';
import { useI18n } from '../i18n';

interface GuideFrameProps {
  frameWidth: number;
  frameHeight: number;
}

/**
 * GuideFrame — overlay for the camera viewfinder.
 * Sized to fit 1 to 3 tablet cells with a semi-transparent dark mask,
 * glowing cyan corner brackets, and helpful alignment instructions.
 */
export default function GuideFrame({ frameWidth, frameHeight }: GuideFrameProps) {
  const { t } = useI18n();

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Top translucent mask */}
      <View style={styles.mask} />

      {/* Middle row containing left mask, guide box, right mask */}
      <View style={[styles.middleRow, { height: frameHeight }]}>
        <View style={styles.mask} />

        <View style={[styles.guideBox, { width: frameWidth, height: frameHeight }]}>
          {/* Corner accents */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {/* Cell dividers (visual guides for 1-3 tablet cells) */}
          <View style={styles.cellGuideline} />
        </View>

        <View style={styles.mask} />
      </View>

      {/* Bottom translucent mask with instruction text */}
      <View style={[styles.mask, styles.bottomMask]}>
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>{t.scan.guideHint}</Text>
          <Text style={styles.subHintText}>{t.scan.guideSubHint}</Text>
        </View>
      </View>
    </View>
  );
}

const CORNER_SIZE = 22;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(10, 15, 30, 0.55)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  guideBox: {
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(76, 201, 240, 0.4)',
    borderRadius: 12,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  cellGuideline: {
    position: 'absolute',
    left: '33.33%',
    right: '33.33%',
    top: 0,
    bottom: 0,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.15)',
    borderStyle: 'dashed',
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
    borderColor: '#4CC9F0',
  },
  topLeft: {
    top: -1,
    left: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: -1,
    right: -1,
    borderTopWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderLeftWidth: CORNER_THICKNESS,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: CORNER_THICKNESS,
    borderRightWidth: CORNER_THICKNESS,
    borderBottomRightRadius: 12,
  },
  bottomMask: {
    alignItems: 'center',
    paddingTop: 18,
  },
  hintContainer: {
    backgroundColor: 'rgba(22, 33, 62, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 201, 240, 0.3)',
    maxWidth: '85%',
    alignItems: 'center',
  },
  hintText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  subHintText: {
    color: '#A0A0B8',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 3,
  },
});
