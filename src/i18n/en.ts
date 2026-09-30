/**
 * English strings dictionary for MedShield.
 * Safety rule: NEVER use the word "safe" anywhere.
 */
export const en = {
  tabs: {
    scan: 'Scan',
    history: 'History',
    about: 'About',
  },
  scan: {
    title: 'MedShield',
    subtitle: 'Medicine Strip Scanner',
    scannerBadge: 'MEDSHIELD SCANNER',
    torchOn: 'Torch ON',
    torchOff: 'Torch OFF',
    guideHint: 'Fill the frame with the strip fragment. Avoid glare.',
    guideSubHint: 'Ensure the batch number is clear and well-lit',
    captureHint: 'Tap shutter to capture & check batch',
    capturingTitle: 'Capturing & Cropping…',
    uploadingTitle: 'Uploading Fragment…',
    readingTitle: 'Reading Batch Code…',
    step1Label: 'Capturing & Cropping',
    step1Sub: 'Guides & compresses to JPEG',
    step2Label: 'Uploading to Server',
    step2Sub: '20s network protection',
    step3Label: 'Reading Batch & Recalls',
    step3Sub: 'OCR analysis in progress',
    waitNotice: 'Please keep the app open…',
    permissionTitle: 'Camera Access Required',
    permissionDesc:
      'MedShield needs permission to use your camera to photograph medicine strip fragments and check for batch recall alerts.',
    grantPermission: 'Grant Camera Permission',
    permissionBlocked:
      'Camera permission is disabled. Please enable it in your device settings.',
    scanFailed: 'Scan Failed',
    retryScan: '🔄  Retry Scan',
    retakePhoto: '📷  Retake Photo',
    browseMock: 'Or browse mock responses:',
    demoVerdicts: 'View Demo Verdicts →',
    simError: '🧪 Sim Error',
    simErrorOn: '⚠️ Sim Error: ON',
  },
  verdict: {
    recalled: 'RECALLED',
    notOnList: 'NOT ON RECALL LIST',
    notOnListNote:
      'Not on recall list. Check with your chemist or doctor if unsure.',
    unreadable: 'UNREADABLE',
    unreadableNote:
      'Could not read the batch code. Please retake the photo with better lighting and focus.',
    batchCode: 'Batch code',
    ocrConfidence: 'OCR confidence',
    cellsRead: 'Cells read',
    recallDetails: 'Recall details',
    alertDate: 'Alert date',
    retake: '↩  Retake',
    retakePhoto: '📷  Retake Photo',
    done: '✓  Done',
    demoBadge: 'Demo data – not a real alert',
    demoBadgeDesc: 'For testing and demonstration only',
  },
  history: {
    title: 'Scan History',
    scansCount: (count: number) =>
      `${count} ${count === 1 ? 'scan' : 'scans'} saved locally`,
    clearAll: 'Clear All',
    clearConfirmTitle: 'Clear Scan History',
    clearConfirmMessage:
      'Are you sure you want to delete all saved scan records? This action cannot be undone.',
    cancel: 'Cancel',
    noScansTitle: 'No Scans Yet',
    noScansDesc:
      'When you photograph a medicine strip fragment, the scan result will be stored here automatically.',
    scanNow: 'Scan a Medicine Strip',
    batchLabel: 'Batch:',
    unreadable: 'Unreadable',
    match: 'match',
    viewDetails: 'View Details →',
  },
  about: {
    title: 'About MedShield',
    subtitle: 'Student Prototype · Batch Recall Scanner',
    languageSection: 'Language / भाषा',
    whatItDoesTitle: 'What this app does',
    whatItDoesText:
      'MedShield lets you photograph a small fragment of a blister medicine strip (1 to 3 tablet cells). It uploads the photo to an OCR-equipped backend to identify the printed batch code and checks whether that batch is on a recall list.',
    whatItDoesNotDoTitle: 'What this app DOES NOT do',
    whatItDoesNotDoText:
      'MedShield does not guarantee medicine quality, authenticity, or chemical validity. It only verifies whether a printed batch number appears on a published recall registry. Even if not on a recall list, always consult your licensed chemist or physician if in doubt.',
    prototypeNoticeTitle: 'Student Prototype & Demo Data',
    prototypeNoticeText:
      'This application is a student demonstration prototype created for educational purposes. When demo mode is active, responses are simulated and clearly marked with the "Demo data" notice.',
    privacyTitle: 'Privacy & Device ID',
    privacyText:
      'MedShield collects no personal data, no names, and no phone numbers. Your device is identified solely by a randomly generated UUID saved locally via AsyncStorage to coordinate scan requests.',
    version: 'v1.0.0 · Academic Prototype',
  },
};

export type Translations = typeof en;
