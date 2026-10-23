# تشغيل Fusion X.tech

الخادم مبني على Node.js ويقدم الموقع وواجهات API من الأصل نفسه. يستخدم Prisma مع SQLite، وتحفظ بيانات الموقع ورسائل التواصل في ملف قاعدة بيانات محلي. ملفات الرفع موجودة في `DATA_DIR/uploads/`.

## إعداد قاعدة البيانات

انسخ `.env.example` إلى `.env`، واضبط كلمة مرور الإدارة و`SESSION_SECRET` ثم نفّذ:

```bash
npm ci
npx prisma generate
npm run dev
```

يطبّق `npm run dev` ترحيلات SQLite تلقائيًا وينشئ مجلد قاعدة البيانات عند الحاجة. المسار الافتراضي هو `data/fusionxtech.sqlite`، ويمكن تغييره عبر `DATABASE_URL` مثل `file:./data/fusionxtech.sqlite` أو `DATA_DIR`. لتطبيق الترحيلات يدويًا استخدم `npm run db:migrate`.

## الإنتاج والدومين

```bash
npm ci
npx prisma generate
npm run build
npm start
```

يطبّق `npm start` الترحيلات المعلّقة تلقائيًا قبل بدء الخادم. استخدم Node.js 22.5 أو أحدث، واجعل ملف SQLite ومجلد `uploads` على تخزين دائم. SQLite مناسبة لخادم تطبيق واحد؛ لا تضع الملف على قرص مؤقت أو تشغّل عدة نسخ مستقلة من التطبيق على قواعد بيانات منفصلة. خذ نسخًا احتياطية من ملف القاعدة ومجلد الرفع معًا.

الدومين العام المعتمد في canonical وsitemap هو `https://fusionteck.online`. اضبط `PUBLIC_SITE_URL` بهذا العنوان في الاستضافة، ثم أضف سجلات DNS المطلوبة لدى مسجل الدومين لتوجيهه إلى مزود الاستضافة؛ تغيير الكود وحده لا يغيّر DNS.

## لوحة التحكم والرسائل

لوحة الإدارة على `/admin`. عيّن `ADMIN_EMAIL` و`ADMIN_PASSWORD` و`SESSION_SECRET` بقيم آمنة في إعدادات بيئة الخادم، ولا تحفظ كلمات المرور في Git. رسائل نموذج التواصل تُسجل في SQLite وتظهر في تبويب **صندوق الرسائل** داخل لوحة التحكم، مع إمكانية تحديدها كمقروءة أو حذفها. لا يتطلب الموقع إعداد SMTP.

## واجهات API والاختبار

تشمل الواجهات `/api/site`, `/api/services`, `/api/projects`, `/api/clients`, `/api/contact`, `/api/inbox`, `/api/uploads`, `/api/auth/*` و`/api/health`، إضافة إلى sitemap وrobots الديناميكيين. القراءة العامة تعرض المحتوى المنشور فقط؛ وتحتاج إدارة الرسائل والمحتوى إلى جلسة مدير.

```bash
npm test
npm run build
npm run test:api
```

يجهّز اختبار API قاعدة SQLite مؤقتة، ويختبر حفظ رسائل التواصل وصلاحية الوصول إلى صندوق الوارد.
