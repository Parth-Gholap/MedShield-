# MedShield 🛡️
> **Medicine Strip Fragment Scanner & Recall Identifier (Student Prototype)**

MedShield is a React Native mobile application built with **Expo SDK 57**, **TypeScript**, and **Expo Router**. It allows users to photograph small fragments of medicine blister strips (even 1 to 3 tablet cells), crops and compresses the image, extracts the printed batch code via server-side OCR, and verifies whether the batch is on a published drug recall list.

---

## ⚠️ Non-Negotiable Safety & Medical Disclaimers

1. **Academic Student Prototype**: This application was developed as a student prototype for academic evaluation. It is **NOT** a certified medical, diagnostic, or clinical device.
2. **Never Uses the Word "Safe"**: By medical compliance design, MedShield **never** claims or indicates that any medicine is "safe". 
3. **Three Distinct Verdict States**:
   - 🔴 **RECALLED** (Red): The batch appears on an active drug recall alert.
   - 🟠 **NOT ON RECALL LIST** (Amber, Neutral — *never green*): *"Not on recall list. Check with your chemist or doctor if unsure."*
   - ⚪ **UNREADABLE** (Grey): The batch code could not be parsed; provides a prominent *Retake Photo* action.
4. **Demo Data Notice**: Whenever mock or simulated data is returned (`recall.is_demo: true`), a prominent **"Demo data – not a real alert"** badge is displayed.
5. **Exact Code Fidelity**: MedShield never guesses, autocorrects, or repairs batch codes client-side. It renders exactly what the OCR engine returns.
6. **Zero Tracking & Privacy**: No login, accounts, passwords, or personal data. The app generates a random anonymous UUID on first launch stored locally in `AsyncStorage`.

---

## 📁 Project Architecture

```
MedShield/
├── app/
│   ├── _layout.tsx              # Root Stack layout with I18nProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx          # 3-tab bottom navigation (Scan, History, About)
│   │   ├── index.tsx            # Scan tab (CameraView, GuideFrame, shutter, pipeline)
│   │   ├── history.tsx          # History tab (AsyncStorage list, tap to reopen, Clear All)
│   │   └── about.tsx            # About tab (Disclaimers, Language Switcher, Privacy)
│   └── result.tsx               # Result screen (VerdictCard, DemoBadge, Done/Retake)
├── src/
│   ├── api/
│   │   ├── types.ts             # TypeScript definitions for scan & health responses
│   │   ├── mock.ts              # Cycles 3 verdict states with 1.5s delay & error simulation
│   │   └── client.ts            # Fetch + FormData multipart client with 20s timeout
│   ├── components/
│   │   ├── VerdictCard.tsx      # Verdict display with 3 distinct color states
│   │   ├── DemoBadge.tsx        # Yellow demo alert badge
│   │   ├── GuideFrame.tsx       # Viewfinder overlay sized for 1-3 tablet cells
│   │   ├── ScanButton.tsx       # Circular camera shutter button with capture spinner
│   │   └── ScanProgress.tsx     # Progress stepper modal (Capturing, Uploading, Reading, Failed)
│   ├── i18n/
│   │   ├── en.ts                # English translations dictionary
│   │   ├── hi.ts                # Hindi (हिन्दी) translations dictionary
│   │   └── index.tsx            # I18nProvider and useI18n() hook with AsyncStorage
│   ├── storage/
│   │   ├── deviceId.ts          # Persistent anonymous UUID generator
│   │   └── history.ts           # Local scan storage (load, save, delete, clear)
│   ├── utils/
│   │   └── imageProcessor.ts    # Guide frame crop math, resize (max 1280px), JPEG 0.7
│   └── config.ts                # Environment variable reader (API_BASE_URL, USE_MOCK)
├── app.json                     # Expo configuration (com.medshield.app, permissions)
├── eas.json                     # EAS Build configuration for standalone Android APK
└── .env                         # Environment variables (EXPO_PUBLIC_*)
```

---

## 🚀 Running Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- **Expo Go** app installed on your Android phone (from Google Play Store)

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start the Development Server
```bash
npx expo start
```
*If your computer and mobile phone are on different Wi-Fi networks or mobile hotspots, use tunnel mode:*
```bash
npx expo start --tunnel
```

### 4. Open in Expo Go
- Open the **Expo Go** app on your Android phone.
- Tap **"Scan QR code"** and scan the QR code displayed in your terminal.
- The app will build and load within seconds.

---

## ⚙️ Configuration (.env)

The app reads environment variables prefixed with `EXPO_PUBLIC_`:

```env
# URL of your backend OCR server
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000

# Set to true to test with simulated responses without a backend
EXPO_PUBLIC_USE_MOCK=true
```

When `EXPO_PUBLIC_USE_MOCK=true`, the app cycles through the 3 verdict states on each scan:
1. Scan 1 → 🔴 **RECALLED** (`MFG2024-X7R3`, 92% confidence)
2. Scan 2 → 🟠 **NOT ON RECALL LIST** (`BN-20240301-K9`, 87% confidence)
3. Scan 3 → ⚪ **UNREADABLE** (no batch code, prompt to retake)

---

## 📦 Building a Standalone Android APK

You can build a standalone `.apk` file that can be installed on any Android phone without needing Expo Go or Google Play Store.

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Log In to Expo
```bash
npx eas-cli login
```
*(If you don't have an Expo account, create a free one at [expo.dev](https://expo.dev)).*

### Step 3: Configure the Project
```bash
npx eas-cli build:configure
```

### Step 4: Build the Standalone APK
Run the build command using the configured `preview` profile:
```bash
npx eas-cli build -p android --profile preview
```

### Step 5: Install on Phone
1. Once the EAS cloud build finishes, it will print a direct download link.
2. Open the link on your phone to download `medshield.apk`.
3. Open the APK file to install MedShield directly on your device.

---

## 🌐 Dual-Language Support (English & हिन्दी)

MedShield includes a built-in dictionary localization system:
- **Instant toggle** between English and Hindi on the **About** tab.
- All tabs, live viewfinder instructions, progress steppers, error messages, and verdict cards update immediately.
- Selected language is saved locally in `AsyncStorage` and restored across sessions.

---

## 🧪 Testing Error Handling & Retry

1. On the live camera screen, tap the top-left **"🧪 Sim Error"** chip.
2. Tap the shutter button.
3. The progress modal will transition to the **"Scan Failed"** error card.
4. Tap **"🔄 Retry Scan"** — it re-uploads the already cropped photo and successfully completes the scan without forcing you to line up and photograph again!

---

## 📜 License & Academic Context
Created as a student prototype for academic research and educational demonstration.
All product names and batch numbers in demo mode are fictitious.
