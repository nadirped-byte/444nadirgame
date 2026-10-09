@echo off
title Shinobi Draft v1.0.0 - Native Android APK Builder
echo ========================================================
echo   SHINOBI DRAFT (v1.0.0) - NATIVE ANDROID APK BUILDER
echo   Package ID: com.shinobidraft.game
echo ========================================================
echo.
echo [1/3] Installing dependencies and building full offline game bundle...
call npm install
call npm run build
echo.
echo [2/3] Syncing all 200+ cards, audio engine, and assets into Native Android package...
call npx cap sync android
echo.
echo [3/3] Building Native Android APK via Gradle...
cd android
call gradlew.bat assembleDebug
cd ..
if exist "android\app\build\outputs\apk\debug\Shinobi-Draft-v1.0.0-debug.apk" (
    copy /Y "android\app\build\outputs\apk\debug\Shinobi-Draft-v1.0.0-debug.apk" ".\Shinobi-Draft-v1.0.0.apk"
    echo.
    echo ========================================================
    echo   SUCCESS! Native APK created at:
    echo   Shinobi-Draft-v1.0.0.apk
    echo ========================================================
) else if exist "android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /Y "android\app\build\outputs\apk\debug\app-debug.apk" ".\Shinobi-Draft-v1.0.0.apk"
    echo.
    echo ========================================================
    echo   SUCCESS! Native APK created at:
    echo   Shinobi-Draft-v1.0.0.apk
    echo ========================================================
)
pause
