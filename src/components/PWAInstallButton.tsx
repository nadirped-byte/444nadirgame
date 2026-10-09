import React, { useState } from 'react';
import { Download, Smartphone, Copy, Check, X, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Language } from '../data/shinobiRoster';

interface PWAInstallModalProps {
  lang: Language;
  compactHeaderButton?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallModalProps> = ({
  lang,
  compactHeaderButton = false,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showApkModal, setShowApkModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Always provide the public Shared App URL (ais-pre) because PWABuilder cannot bypass auth on ais-dev
  const appShareUrl =
    typeof window !== 'undefined'
      ? window.location.origin.replace('ais-dev-', 'ais-pre-')
      : 'https://ais-pre-kns7ik43hxjppuhcausm74-816478685403.europe-west2.run.app';

  const manifestJsonText = JSON.stringify(
    {
      id: '/',
      name: 'Shinobi Draft',
      short_name: 'ShinobiDraft',
      version: '1.0.0',
      description:
        'Shinobi Draft v1.0.0 — لعبة بطاقات تكتيكية احترافية في عالم الشينوبي بنظام 3 ضد 3 أو 5 ضد 5 أو 10 ضد 10.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: '#070B14',
      theme_color: '#070B14',
      icons: [
        {
          src: `${appShareUrl}/pwa-192x192.png`,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${appShareUrl}/pwa-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: `${appShareUrl}/pwa-maskable-512x512.png`,
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    null,
    2
  );

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setShowApkModal(true);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appShareUrl).catch(() => {});
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(manifestJsonText).catch(() => {});
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  if (isInstalled && compactHeaderButton) {
    return null;
  }

  return (
    <>
      {compactHeaderButton ? (
        <button
          type="button"
          onClick={handleInstallClick}
          title={lang === 'ar' ? 'تثبيت وتحميل APK' : 'Install / Download APK'}
          className="min-h-[36px] px-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-orange-600 hover:from-purple-600 hover:to-orange-500 border border-amber-300/60 text-xs font-display font-extrabold text-white flex items-center gap-1 shadow-[0_0_15px_rgba(168,85,247,0.5)] cursor-pointer active:scale-95 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-amber-200" />
          <span>{lang === 'ar' ? 'APK / تثبيت' : 'APK'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full h-11 rounded-2xl bg-slate-900/95 hover:bg-slate-800 border-2 border-purple-500/60 shadow-[0_0_22px_rgba(168,85,247,0.35)] text-purple-200 hover:text-white font-display font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all"
        >
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span>
            {lang === 'ar'
              ? 'تحميل وتثبيت اللعبة على أندرويد (APK / تثبيت مباشر)'
              : 'Download & Install on Android (APK / Direct)'}
          </span>
        </button>
      )}

      {showApkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 text-start overflow-y-auto">
          <div className="w-full max-w-md rounded-3xl bg-slate-950 border-2 border-purple-500/70 p-4 sm:p-5 space-y-3 shadow-[0_0_50px_rgba(168,85,247,0.5)] relative my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-display font-black text-sm sm:text-base text-white">
                    {lang === 'ar'
                      ? 'حزمة تطبيق الأندرويد الأصلي (v1.0.0)'
                      : 'Native Android App Package (v1.0.0)'}
                  </h3>
                  <p className="text-[10px] text-amber-300/90 font-mono">
                    Package: com.shinobidraft.game • Offline Native
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApkModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-900 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Option 0: Native Android Package ZIP Direct Download */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border-2 border-emerald-500/60 p-3 space-y-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <div className="flex items-center justify-between">
                <div className="font-display font-extrabold text-xs text-emerald-300">
                  {lang === 'ar'
                    ? '📦 تحميل حزمة الأندرويد الأصلية الكاملة (ZIP)'
                    : '📦 Download Full Native Android Package (ZIP)'}
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-[10px] font-mono font-bold text-emerald-300">
                  v1.0.0 Native
                </span>
              </div>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                {lang === 'ar'
                  ? 'حزمة أندرويد أصلية كاملة (Capacitor + Gradle) تضم مجلد android/ المجهز بجميع الـ 200+ بطاقة والصور للعمل بدون إنترنت + أيقونات Shinobi Draft الرسمية + بناء تلقائي لملف APK:'
                  : 'Complete standalone Native Android project (Capacitor + Gradle) pre-bundled with all 200+ cards offline, official mipmap icons, and one-click APK builder:'}
              </p>
              <a
                href="/Shinobi-Draft-v1.0.0-Android-Native.zip"
                download="Shinobi-Draft-v1.0.0-Android-Native.zip"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-300/60 text-white font-display font-extrabold text-xs flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(16,185,129,0.4)] cursor-pointer transition-all"
              >
                <Download className="w-4 h-4 text-amber-200" />
                <span>
                  {lang === 'ar'
                    ? 'تحميل حزمة الأندرويد الأصلية (Shinobi-Draft-v1.0.0.zip)'
                    : 'Download Native Android Package (.ZIP)'}
                </span>
              </a>
              <div className="text-[10px] text-slate-300/90 bg-black/40 rounded-lg p-2 border border-slate-800 space-y-1">
                <div>
                  {lang === 'ar'
                    ? '• بداخل الـ ZIP: اضغط مرتين على build-apk.bat (ويندوز) أو افتح مجلد android في Android Studio، أو ارفعه على GitHub ليستخرج لك ملف Shinobi-Draft-v1.0.0.apk تلقائياً!'
                    : '• Inside ZIP: Run build-apk.bat, open /android in Android Studio, or push to GitHub Actions to auto-generate Shinobi-Draft-v1.0.0.apk!'}
                </div>
              </div>
            </div>

            {/* Option 1: Direct One-Tap Install if available or Chrome Menu */}
            <div className="rounded-2xl bg-slate-900/90 border border-orange-500/40 p-3 space-y-2">
              <div className="font-display font-extrabold text-xs text-amber-300">
                {lang === 'ar'
                  ? '1️⃣ الطريقة الأولى: التثبيت الفوري من متصفح الهاتف (بدون برامج)'
                  : '1️⃣ Option 1: Instant Phone Install'}
              </div>
              {isInstallable ? (
                <button
                  type="button"
                  onClick={install}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-display font-extrabold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {lang === 'ar' ? 'اضغط هنا لتثبيت التطبيق الآن' : 'Tap Here to Install Now'}
                  </span>
                </button>
              ) : (
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'من متصفح Chrome في هاتفك: اضغط على النقاط الثلاث (⋮) أعلى الشاشة ثم اختر «تثبيت التطبيق» (Install App) لتثبيتها بملء الشاشة وأيقونة رسمية.'
                    : 'In Android Chrome: Tap the 3 dots (⋮) at the top-right and select "Install App" to install it full-screen.'}
                </p>
              )}
            </div>

            {/* Option 2: Generate & Download Standalone .APK File directly on phone */}
            <div className="rounded-2xl bg-slate-900/90 border border-purple-500/40 p-3 space-y-2.5">
              <div className="font-display font-extrabold text-xs text-purple-300">
                {lang === 'ar'
                  ? '2️⃣ الطريقة الثانية: استخراج وتنزيل ملف APK مباشر من هاتفك'
                  : '2️⃣ Option 2: Download Standalone .APK File on Phone'}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'تم تجهيز اللعبة بملف البيان والأيقونات الرسمية (PWA Ready). لتنزيل ملف APK مستقل من هاتفك مجاناً في دقيقة واحدة:'
                  : 'The game is fully configured with Android manifest & icons. To download a standalone .APK file on your phone:'}
              </p>

              <ol className="text-[11px] text-slate-200 space-y-1.5 list-decimal list-inside font-medium">
                <li>
                  {lang === 'ar'
                    ? 'انسخ رابط اللعبة بالزر أدناه (تأكد من فتح الرابط العام بعد النشر Deploy).'
                    : 'Copy the game URL below.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'افتح موقع PWABuilder من هاتفك والصق الرابط.'
                    : 'Open PWABuilder.com on your phone and paste the URL.'}
                </li>
                <li>
                  {lang === 'ar'
                    ? 'اضغط Package for stores ثم اختر Android واضغط Download لتحميل ملف الـ APK مباشرة!'
                    : 'Tap "Package for stores" -> "Android" -> "Download" to get your APK!'}
                </li>
              </ol>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-display font-bold text-amber-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'ar' ? 'تم نسخ الرابط العام!' : 'Copied Public URL!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'نسخ الرابط العام (ais-pre)' : 'Copy Public Link'}</span>
                    </>
                  )}
                </button>

                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-600 border border-purple-400/60 text-xs font-display font-bold text-white flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'فتح PWABuilder' : 'Open PWABuilder'}</span>
                </a>
              </div>

              <button
                type="button"
                onClick={handleCopyManifest}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-amber-400/40 text-[11px] font-display font-bold text-amber-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedManifest ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      {lang === 'ar'
                        ? 'تم نسخ كود الـ Manifest الكامل!'
                        : 'Manifest JSON Copied!'}
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ar'
                        ? 'نسخ كود الـ Manifest الجاهز (إذا طلبه PWABuilder)'
                        : 'Copy Ready Manifest JSON (for PWABuilder Editor)'}
                    </span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowApkModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-display font-bold text-xs cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
