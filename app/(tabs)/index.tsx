import { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GuideFrame from '../../src/components/GuideFrame';
import ScanButton from '../../src/components/ScanButton';
import ScanProgress, { ScanState } from '../../src/components/ScanProgress';
import {
  calculateCropRect,
  cropAndCompressPhoto,
  ProcessedImageResult,
} from '../../src/utils/imageProcessor';
import { scanImage } from '../../src/api/client';
import { setSimulateMockFailure } from '../../src/api/mock';
import { saveScanResult } from '../../src/storage/history';
import { useI18n } from '../../src/i18n';

/**
 * Scan screen (Home tab) — Stage 5 Connected Capture & API.
 *
 * Full pipeline:
 *  1. Live CameraView with GuideFrame and torch toggle.
 *  2. On capture:
 *     - 'capturing': takes picture, crops to guide frame, compresses (max width 1280px, JPEG 0.7).
 *     - 'uploading': sends multipart photo to API client with 20s timeout.
 *     - 'reading': OCR and database lookup in progress.
 *     - Success: navigates to /result with scan response.
 *     - 'failed': friendly error display with prominent Retry and Retake buttons.
 */
export default function ScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const [permission, requestPermission] = useCameraPermissions();

  const cameraRef = useRef<CameraView>(null);
  const [enableTorch, setEnableTorch] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<ProcessedImageResult | null>(null);
  const [simulateError, setSimulateError] = useState(false);

  // Viewport dimensions for calculating crop relative to guide frame
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Reset state whenever screen regains focus (e.g. navigating back from /result)
  useFocusEffect(
    useCallback(() => {
      setScanState('idle');
      setErrorMessage(null);
    }, [])
  );

  const onContainerLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Dimensions of the guide frame sized for 1 to 3 tablet cells
  const frameWidth = containerSize.width > 0 ? Math.min(containerSize.width * 0.82, 320) : 290;
  const frameHeight = Math.round(frameWidth * 0.55);

  /**
   * Executes the API scan with progress tracking and error handling.
   */
  const executeScan = async (imageUri: string) => {
    try {
      setErrorMessage(null);
      setScanState('uploading');

      // Call API client with step callback ('uploading' -> 'reading')
      const result = await scanImage(imageUri, (step) => {
        setScanState(step);
      });

      // Save scan to local history via AsyncStorage
      await saveScanResult(result, imageUri);

      // Scan succeeded! Reset progress and navigate to Result screen
      setScanState('idle');
      router.push({
        pathname: '/result',
        params: { data: JSON.stringify(result) },
      });
    } catch (err) {
      console.error('Scan failed:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to complete scan. Please check your connection and tap Retry.';
      setErrorMessage(message);
      setScanState('failed');
    }
  };

  /**
   * Shutter press handler: captures photo, crops, compresses, and starts scan.
   */
  const handleCapture = async () => {
    if (!cameraRef.current || scanState !== 'idle') return;

    try {
      setScanState('capturing');
      setErrorMessage(null);

      // 1. Take high-res picture from CameraView
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: false,
      });

      if (!photo || !photo.uri) {
        throw new Error('Could not capture photo from camera. Please hold steady and try again.');
      }

      // 2. Calculate crop coordinates corresponding to guide frame
      const cropRect = calculateCropRect(
        photo.width,
        photo.height,
        containerSize.width,
        containerSize.height,
        frameWidth,
        frameHeight
      );

      // 3. Crop and compress photo to JPEG 0.7, max width 1280px
      const processed = await cropAndCompressPhoto(photo.uri, cropRect);
      setCapturedPhoto(processed);

      // If user toggled "Simulate Error", configure mock client to fail this call
      if (simulateError) {
        setSimulateMockFailure(true, 'Simulated connection failure (testing Retry flow).');
        setSimulateError(false); // Reset toggle
      }

      // 4. Send cropped photo to API client
      await executeScan(processed.uri);
    } catch (err) {
      console.error('Capture pipeline error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Could not process the photo. Please try again.';
      setErrorMessage(message);
      setScanState('failed');
    }
  };

  /**
   * Retry handler: re-sends the already captured photo without needing to re-photograph.
   */
  const handleRetry = async () => {
    if (!capturedPhoto) {
      setScanState('idle');
      return;
    }
    await executeScan(capturedPhoto.uri);
  };

  /**
   * Retake handler: discards current photo and returns to live camera viewfinder.
   */
  const handleRetake = () => {
    setCapturedPhoto(null);
    setErrorMessage(null);
    setScanState('idle');
  };

  // ── 1. Permission loading state ───────────────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4CC9F0" />
        <Text style={styles.loadingText}>{t.scan.waitNotice}</Text>
      </View>
    );
  }

  // ── 2. Permission denied state ────────────────────────────────────────────
  if (!permission.granted) {
    return (
      <View style={[styles.centeredContainer, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.permissionIconCircle}>
          <Text style={styles.permissionIcon}>📷</Text>
        </View>

        <Text style={styles.permissionTitle}>{t.scan.permissionTitle}</Text>
        <Text style={styles.permissionDescription}>
          {t.scan.permissionDesc}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={requestPermission}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>{t.scan.grantPermission}</Text>
        </TouchableOpacity>

        {!permission.canAskAgain && (
          <Text style={styles.permissionBlockedNote}>
            {t.scan.permissionBlocked}
          </Text>
        )}

        {/* Fallback option to view demo verdicts */}
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackLabel}>{t.scan.browseMock}</Text>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push('/result?demo=RECALLED')}
          >
            <Text style={styles.outlineButtonText}>{t.scan.demoVerdicts}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── 3. Live Camera Viewfinder with ScanProgress overlay ────────────────────
  return (
    <View style={styles.cameraContainer} onLayout={onContainerLayout}>
      {/* Native CameraView */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="back"
        enableTorch={enableTorch}
      />

      {/* Guide frame overlay */}
      {containerSize.width > 0 && (
        <GuideFrame
          frameWidth={frameWidth}
          frameHeight={frameHeight}
        />
      )}

      {/* Top Bar (Torch toggle and Dev Error Simulator toggle) */}
      <View style={[styles.topBar, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={[styles.simErrorChip, simulateError && styles.simErrorChipActive]}
          onPress={() => setSimulateError((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Text style={[styles.simErrorText, simulateError && styles.simErrorTextActive]}>
            {simulateError ? t.scan.simErrorOn : t.scan.simError}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.torchButton, enableTorch && styles.torchButtonActive]}
          onPress={() => setEnableTorch((prev) => !prev)}
          activeOpacity={0.7}
        >
          <Text style={styles.torchIcon}>⚡</Text>
          <Text style={[styles.torchText, enableTorch && styles.torchTextActive]}>
            {enableTorch ? t.scan.torchOn : t.scan.torchOff}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Shutter & Controls */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 20 }]}>
        <ScanButton
          onPress={handleCapture}
          loading={scanState === 'capturing'}
          disabled={scanState !== 'idle'}
        />

        <Text style={styles.captureHint}>
          {t.scan.captureHint}
        </Text>
      </View>

      {/* ScanProgress overlay (capturing, uploading, reading, failed with retry) */}
      <ScanProgress
        state={scanState}
        errorMessage={errorMessage}
        imageUri={capturedPhoto?.uri}
        onRetry={handleRetry}
        onRetake={handleRetake}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    backgroundColor: '#0A0F1E',
  },

  // ── Top Bar ──────────────────────────────────────────────
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  simErrorChip: {
    backgroundColor: 'rgba(22, 33, 62, 0.75)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  simErrorChipActive: {
    backgroundColor: 'rgba(220, 53, 69, 0.3)',
    borderColor: '#DC3545',
  },
  simErrorText: {
    color: '#CCCCDD',
    fontSize: 11,
    fontWeight: '600',
  },
  simErrorTextActive: {
    color: '#FF8888',
    fontWeight: '700',
  },
  torchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22, 33, 62, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  torchButtonActive: {
    backgroundColor: 'rgba(76, 201, 240, 0.25)',
    borderColor: '#4CC9F0',
  },
  torchIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  torchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  torchTextActive: {
    color: '#4CC9F0',
  },

  // ── Bottom Bar ───────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 16,
    zIndex: 10,
  },
  captureHint: {
    color: '#CCCCDD',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '500',
  },

  // ── Permission & Centered States ─────────────────────────
  centeredContainer: {
    flex: 1,
    backgroundColor: '#16213E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    color: '#CCCCDD',
    fontSize: 14,
    marginTop: 14,
  },
  permissionIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1A1A2E',
    borderWidth: 2,
    borderColor: '#4CC9F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permissionIcon: {
    fontSize: 38,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#A0A0B8',
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 26,
    maxWidth: 320,
  },
  primaryButton: {
    backgroundColor: '#4CC9F0',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 220,
    alignItems: 'center',
    marginBottom: 14,
  },
  primaryButtonText: {
    color: '#16213E',
    fontSize: 15,
    fontWeight: '700',
  },
  permissionBlockedNote: {
    color: '#FF8888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 280,
  },
  fallbackContainer: {
    marginTop: 36,
    alignItems: 'center',
  },
  fallbackLabel: {
    color: '#666688',
    fontSize: 12,
    marginBottom: 10,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: '#4CC9F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  outlineButtonText: {
    color: '#4CC9F0',
    fontSize: 14,
    fontWeight: '600',
  },
});
