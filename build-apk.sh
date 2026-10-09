#!/usr/bin/env bash
set -e
echo "========================================================"
echo "  SHINOBI DRAFT (v1.0.0) - NATIVE ANDROID APK BUILDER"
echo "  Package ID: com.shinobidraft.game"
echo "========================================================"

echo "[1/3] Installing dependencies & building full offline game bundle..."
npm install
npm run build

echo "[2/3] Syncing all 200+ cards, audio engine, and assets into Native Android package..."
npx cap sync android

echo "[3/3] Building Native Android APK via Gradle..."
cd android
chmod +x ./gradlew
./gradlew assembleDebug
cd ..

APK_PATH=$(find android/app/build/outputs/apk/debug -name "*.apk" | head -n 1)
if [ -n "$APK_PATH" ]; then
  cp "$APK_PATH" ./Shinobi-Draft-v1.0.0.apk
  echo "========================================================"
  echo "  SUCCESS! Standalone Native APK ready:"
  echo "  ./Shinobi-Draft-v1.0.0.apk"
  echo "========================================================"
fi
