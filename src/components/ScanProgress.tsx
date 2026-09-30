import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useI18n } from '../i18n';

export type ScanState = 'idle' | 'capturing' | 'uploading' | 'reading' | 'failed';

interface ScanProgressProps {
  state: ScanState;
  errorMessage?: string | null;
  imageUri?: string | null;
  onRetry: () => void;
  onRetake: () => void;
}

/**
 * ScanProgress — overlay showing the exact state progression:
 *  - capturing: Photo taken, cropped to guide frame, compressed
 *  - uploading: Sending multipart payload to API
 *  - reading: Server OCR and recall database lookup
 *  - failed: Friendly error description with prominent Retry and Retake buttons
 */
export default function ScanProgress({
  state,
  errorMessage,
  imageUri,
  onRetry,
  onRetake,
}: ScanProgressProps) {
  const { t } = useI18n();

  if (state === 'idle') return null;

  const isFailed = state === 'failed';

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Optional preview thumbnail */}
        {imageUri && (
          <View style={styles.thumbnailContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.thumbnail}
              resizeMode="cover"
            />
            {!isFailed && <View style={styles.scanGlowLine} />}
          </View>
        )}

        {isFailed ? (
          /* ── Failed State ── */
          <View style={styles.contentWrap}>
            <View style={styles.errorIconWrap}>
              <Text style={styles.errorIcon}>⚠️</Text>
            </View>

            <Text style={styles.errorTitle}>{t.scan.scanFailed}</Text>
            <Text style={styles.errorMessage}>
              {errorMessage || 'Something went wrong while processing your scan.'}
            </Text>

            <View style={styles.actionColumn}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={onRetry}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>{t.scan.retryScan}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.retakeButton}
                onPress={onRetake}
                activeOpacity={0.8}
              >
                <Text style={styles.retakeButtonText}>{t.scan.retakePhoto}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* ── In-progress States (capturing / uploading / reading) ── */
          <View style={styles.contentWrap}>
            <ActivityIndicator size="large" color="#4CC9F0" style={styles.mainSpinner} />

            <Text style={styles.activeTitle}>
              {state === 'capturing' && t.scan.capturingTitle}
              {state === 'uploading' && t.scan.uploadingTitle}
              {state === 'reading' && t.scan.readingTitle}
            </Text>

            {/* Stepper indicators */}
            <View style={styles.stepperContainer}>
              {/* Step 1: Capturing */}
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    state === 'capturing' && styles.stepDotActive,
                    (state === 'uploading' || state === 'reading') && styles.stepDotDone,
                  ]}
                >
                  <Text style={styles.stepDotText}>
                    {state === 'uploading' || state === 'reading' ? '✓' : '1'}
                  </Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepLabel, state === 'capturing' && styles.stepLabelActive]}>
                    {t.scan.step1Label}
                  </Text>
                  <Text style={styles.stepSubLabel}>{t.scan.step1Sub}</Text>
                </View>
              </View>

              <View style={styles.stepConnector} />

              {/* Step 2: Uploading */}
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    state === 'uploading' && styles.stepDotActive,
                    state === 'reading' && styles.stepDotDone,
                  ]}
                >
                  <Text style={styles.stepDotText}>
                    {state === 'reading' ? '✓' : '2'}
                  </Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepLabel, state === 'uploading' && styles.stepLabelActive]}>
                    {t.scan.step2Label}
                  </Text>
                  <Text style={styles.stepSubLabel}>{t.scan.step2Sub}</Text>
                </View>
              </View>

              <View style={styles.stepConnector} />

              {/* Step 3: Reading */}
              <View style={styles.stepRow}>
                <View
                  style={[
                    styles.stepDot,
                    state === 'reading' && styles.stepDotActive,
                  ]}
                >
                  <Text style={styles.stepDotText}>3</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepLabel, state === 'reading' && styles.stepLabelActive]}>
                    {t.scan.step3Label}
                  </Text>
                  <Text style={styles.stepSubLabel}>{t.scan.step3Sub}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.waitNotice}>{t.scan.waitNotice}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 15, 30, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    zIndex: 999,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#16213E',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(76, 201, 240, 0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    paddingBottom: 24,
  },
  thumbnailContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#0A0F1E',
    overflow: 'hidden',
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(76, 201, 240, 0.2)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  scanGlowLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 3,
    backgroundColor: '#4CC9F0',
  },
  contentWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  mainSpinner: {
    marginBottom: 12,
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepperContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepDotActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.2)',
    borderColor: '#4CC9F0',
  },
  stepDotDone: {
    backgroundColor: '#4CC9F0',
    borderColor: '#4CC9F0',
  },
  stepDotText: {
    color: '#CCCCDD',
    fontSize: 12,
    fontWeight: '700',
  },
  stepInfo: {
    flex: 1,
  },
  stepLabel: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  stepSubLabel: {
    color: '#666688',
    fontSize: 11,
  },
  stepConnector: {
    width: 2,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 13,
    marginVertical: 2,
  },
  waitNotice: {
    color: '#666688',
    fontSize: 11,
    fontStyle: 'italic',
  },

  // ── Failed State Styles ─────────────────────────────────
  errorIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(220, 53, 69, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(220, 53, 69, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  errorIcon: {
    fontSize: 28,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#CCCCDD',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  actionColumn: {
    width: '100%',
    gap: 10,
  },
  retryButton: {
    backgroundColor: '#4CC9F0',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  retryButtonText: {
    color: '#16213E',
    fontSize: 15,
    fontWeight: '700',
  },
  retakeButton: {
    borderWidth: 1.5,
    borderColor: '#A0A0B8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
