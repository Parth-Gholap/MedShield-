import type { Translations } from './en';

/**
 * Hindi (हिन्दी) translations dictionary for MedShield.
 * Safety rule: NEVER use the word "safe" or "सुरक्षित".
 */
export const hi: Translations = {
  tabs: {
    scan: 'स्कैन',
    history: 'इतिहास',
    about: 'के बारे में',
  },
  scan: {
    title: 'मेडशील्ड',
    subtitle: 'दवा स्ट्रिप स्कैनर',
    scannerBadge: 'मेडशील्ड स्कैनर',
    torchOn: 'टॉर्च चालू',
    torchOff: 'टॉर्च बंद',
    guideHint: 'स्ट्रिप के टुकड़े को फ्रेम में रखें। चमक से बचें।',
    guideSubHint: 'सुनिश्चित करें कि बैच नंबर स्पष्ट और अच्छी रोशनी में हो',
    captureHint: 'बैच जांचने के लिए शटर दबाएं',
    capturingTitle: 'फोटो खींची और काटी जा रही है…',
    uploadingTitle: 'सर्वर पर भेजा जा रहा है…',
    readingTitle: 'बैच कोड पढ़ा जा रहा है…',
    step1Label: 'फोटो लेना और काटना',
    step1Sub: 'गाइड के अनुसार संपीड़ित करता है',
    step2Label: 'सर्वर पर अपलोड',
    step2Sub: '20 सेकंड नेटवर्क सुरक्षा',
    step3Label: 'बैच और रिकॉल पढ़ना',
    step3Sub: 'ओसीआर जांच जारी है',
    waitNotice: 'कृपया ऐप खुली रखें…',
    permissionTitle: 'कैमरा अनुमति आवश्यक है',
    permissionDesc:
      'मेडशील्ड को दवा की स्ट्रिप के टुकड़ों की फोटो खींचने और बैच रिकॉल अलर्ट जांचने के लिए कैमरे की अनुमति चाहिए।',
    grantPermission: 'कैमरा अनुमति दें',
    permissionBlocked:
      'कैमरा अनुमति बंद है। कृपया डिवाइस सेटिंग्स में जाकर इसे चालू करें।',
    scanFailed: 'स्कैन विफल रहा',
    retryScan: '🔄  पुनः प्रयास करें',
    retakePhoto: '📷  फिर से फोटो लें',
    browseMock: 'या डेमो परिणाम देखें:',
    demoVerdicts: 'डेमो परिणाम देखें →',
    simError: '🧪 त्रुटि सिमुलेशन',
    simErrorOn: '⚠️ त्रुटि मोड: चालू',
  },
  verdict: {
    recalled: 'वापस मंगाया गया (RECALLED)',
    notOnList: 'रिकॉल सूची में नहीं है',
    notOnListNote:
      'Not on recall list. Check with your chemist or doctor if unsure. (रिकॉल सूची में नहीं है। यदि संदेह हो तो अपने केमिस्ट या डॉक्टर से सलाह लें।)',
    unreadable: 'पढ़ा नहीं जा सका (UNREADABLE)',
    unreadableNote:
      'बैच कोड पढ़ा नहीं जा सका। कृपया बेहतर रोशनी और फोकस में दोबारा फोटो लें।',
    batchCode: 'बैच कोड',
    ocrConfidence: 'ओसीआर विश्वसनीयता',
    cellsRead: 'पढ़ी गई गोलियां',
    recallDetails: 'रिकॉल विवरण',
    alertDate: 'अलर्ट तिथि',
    retake: '↩  फिर से लें',
    retakePhoto: '📷  फिर से फोटो लें',
    done: '✓  पूर्ण',
    demoBadge: 'Demo data – not a real alert (डेमो डेटा – वास्तविक अलर्ट नहीं)',
    demoBadgeDesc: 'केवल परीक्षण और प्रदर्शन के लिए',
  },
  history: {
    title: 'स्कैन इतिहास',
    scansCount: (count: number) =>
      `${count} ${count === 1 ? 'स्कैन' : 'स्कैन'} दर्ज`,
    clearAll: 'सभी हटाएं',
    clearConfirmTitle: 'स्कैन इतिहास हटाएं',
    clearConfirmMessage:
      'क्या आप वाकई सभी सहेजे गए स्कैन हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।',
    cancel: 'रद्द करें',
    noScansTitle: 'अभी तक कोई स्कैन नहीं',
    noScansDesc:
      'जब आप दवा की स्ट्रिप की फोटो लेंगे, तो परिणाम यहां अपने आप दर्ज हो जाएगा।',
    scanNow: 'दवा की स्ट्रिप स्कैन करें',
    batchLabel: 'बैच:',
    unreadable: 'अस्पष्ट',
    match: 'समानता',
    viewDetails: 'विवरण देखें →',
  },
  about: {
    title: 'मेडशील्ड के बारे में',
    subtitle: 'छात्र प्रोटोटाइप · बैच रिकॉल स्कैनर',
    languageSection: 'Language / भाषा बदलें',
    whatItDoesTitle: 'यह ऐप क्या करता है',
    whatItDoesText:
      'मेडशील्ड दवा की स्ट्रिप के एक छोटे से टुकड़े (1 से 3 टैबलेट सेल) की फोटो लेता है। यह सर्वर पर ओसीआर द्वारा मुद्रित बैच कोड को पहचानता है और जांचता है कि क्या वह बैच किसी आधिकारिक रिकॉल सूची में दर्ज है।',
    whatItDoesNotDoTitle: 'यह ऐप क्या नहीं करता',
    whatItDoesNotDoText:
      'मेडशील्ड दवा की गुणवत्ता या उपयोगिता की कोई गारंटी नहीं देता है। यह केवल यह जांचता है कि बैच नंबर रिकॉल सूची में दर्ज है या नहीं। यदि संदेह हो तो हमेशा अपने फार्मासिस्ट या डॉक्टर से परामर्श लें।',
    prototypeNoticeTitle: 'छात्र प्रोटोटाइप और डेमो डेटा',
    prototypeNoticeText:
      'यह एप्लिकेशन केवल शैक्षणिक अध्ययन और प्रदर्शन के लिए बनाया गया एक प्रोटोटाइप है। यह किसी भी नैदानिक या चिकित्सीय उपयोग के लिए प्रमाणित नहीं है। डेमो मोड में परिणाम सिम्युलेटेड होते हैं।',
    privacyTitle: 'गोपनीयता और डिवाइस आईडी',
    privacyText:
      'मेडशील्ड कोई व्यक्तिगत डेटा या नाम एकत्र नहीं करता है। आपका फोन केवल एक यादृच्छिक यूयूआईडी (UUID) द्वारा पहचाना जाता है जो आपके डिवाइस में ही संग्रहित रहता है।',
    version: 'v1.0.0 · शैक्षणिक प्रोटोटाइप',
  },
};
