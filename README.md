# Fusion X.tech

موقع ثنائي اللغة (العربية/الإنجليزية) لشركة Fusion X.tech، مع صفحات ديناميكية ونظام إدارة محتوى ولوحة تحكم على `/admin`. رسائل نموذج التواصل تُحفظ في صندوق الوارد داخل لوحة التحكم.

## التقنية

- React + TanStack Start + Vite
- Node.js backend من نفس الأصل
- SQLite عبر Prisma لتخزين إعدادات الموقع والخدمات والمشروعات ورسائل التواصل
- رفع الوسائط إلى `DATA_DIR/uploads/`

## التشغيل السريع

```bash
cp .env.example .env
npm ci
npx prisma generate
npm run dev
```

يطبّق `npm run dev` ترحيلات SQLite تلقائيًا قبل تشغيل Vite، وينشئ مجلد قاعدة البيانات إذا لم يكن موجودًا. اضبط كلمة مرور الإدارة و`SESSION_SECRET` في `.env` قبل تشغيل الموقع. راجع [BACKEND.md](./BACKEND.md) لإعداد الإنتاج والدومين والنسخ الاحتياطي.

قاعدة البيانات الافتراضية هي `data/fusionxtech.sqlite`. احفظها ومجلد `uploads` على تخزين دائم في الإنتاج.
