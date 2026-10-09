# دليل حزمة الأندرويد الأصلية الكاملة — Shinobi Draft (v1.0.0)

تم تجهيز هذا المشروع ليكون **تطبيق أندرويد أصلي مستقل بالكامل (Native Standalone Android Package)** باستخدام **Capacitor Android**، بحيث يحتوي بداخله على جميع البطاقات الـ 200+، الصور، المؤثرات الصوتية، وأطوار اللعب الـ 4 للعمل **بدون إنترنت نهائياً (100% Offline)**.

---

## 📦 محتويات حزمة الأندرويد داخل ملف الـ ZIP

1. **`android/` (مشروع الأندرويد الأصلي الكامل):**
   - `AndroidManifest.xml`: تعريف الحزمة الرسمية باسم `com.shinobidraft.game` ووضع الشاشة الكاملة.
   - `android/app/build.gradle`: إعدادات الإصدار `versionName "1.0.0"` و `versionCode 1`.
   - `android/app/src/main/assets/public/`: جميع ملفات اللعبة المترجمة والصور المدمجة مسبقاً داخل الحزمة!
   - `android/app/src/main/res/mipmap-*`: جميع أحجام أيقونة **Shinobi Draft v1.0.0** الرسمية للأندرويد وشاشة البداية (`Splash Screen`).
2. **`.github/workflows/build-android-apk.yml`:**
   - ملف بناء سحابي تلقائي عبر GitHub Actions لتوليد ملف **`Shinobi-Draft-v1.0.0.apk`** مجاناً وبضغطة زر دون الحاجة لتثبيت Android Studio على جهازك.
3. **`build-apk.bat` (لويندوز) و `build-apk.sh` (لماك/لينكس):**
   - سكربتات بناء بضغطة واحدة لتوليد ملف الـ APK محلياً.

---

## 🚀 الطريقة الأولى (الأسهل بدون تثبيت أي برامج): استخراج ملف APK عبر GitHub مجاناً

1. قم بتحميل ملف الـ **ZIP** الخاص بالمشروع وفك الضغط عنه.
2. ارفع ملفات المشروع إلى مستودع جديد (Repository) على حسابك في **GitHub**.
3. ادخل إلى تبويب **Actions** في مستودعك على GitHub.
4. ستجد عملية باسم **Build Shinobi Draft Android APK (v1.0.0)** تعمل تلقائياً.
5. بعد دقيقتين، اضغط عليها وحمّل ملف **`Shinobi-Draft-v1.0.0.apk`** الجاهز للتثبيت المباشر على هاتفك!

---

## 💻 الطريقة الثانية: استخراج الـ APK على جهازك (عبر Android Studio أو السكربت)

- **باستخدام Android Studio:**
  1. افتح برنامج **Android Studio**.
  2. اختر **Open** وحدد المجلد **`android`** الموجود داخل ملف الـ ZIP مباشرةً (حيث أن جميع ملفات اللعبة منسوخة ومجهزة مسبقاً داخل `android/app/src/main/assets/public`).
  3. من القائمة العلوية اختر: **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
  4. ستحصل فوراً على ملف `Shinobi-Draft-v1.0.0.apk` الأصلي.

- **أو بضغطة زر واحدة (إذا كان لديك Java + Android SDK):**
  - على ويندوز: اضغط مرتين على ملف **`build-apk.bat`**.
  - على ماك أو لينكس: شغل الأمر `bash build-apk.sh`.
