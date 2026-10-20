# Backend وتشغيل Oasis Web Design

يقدّم backend بـ **Node.js** صفحات التطبيق وواجهات API من الأصل نفسه. محتوى CMS يُحفظ في **MySQL** داخل جدولي `site_settings` و`content_items`، والملفات المرفوعة في `DATA_DIR/uploads/`؛ لذلك يرى جميع الزوار التعديلات نفسها. لا تُخزّن بيانات المحتوى أو جلسة المدير في `localStorage`.

## إعداد MySQL وPrisma والبيانات الافتراضية

1. أنشئ قاعدة البيانات من لوحة الاستضافة أولًا؛ المستخدم المشترك لا يحتاج ولا يملك عادة صلاحية `CREATE DATABASE`.

2. انسخ `.env.example` إلى `.env` وضع بيانات الاتصال وكلمة مرور المدير. يجب أن يحتوي `.env` على `DATABASE_URL`، مثل:

```env
DATABASE_URL="mysql://viralzoom:PASSWORD@localhost:3306/viralzoom_oasis_web"
```

3. ثبّت الحزم وطبّق migrations:

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
```

4. حمّل البيانات الافتراضية عبر Prisma:

```bash
npx prisma db seed
```

في الاستضافة المشتركة، لا تستخدم `prisma migrate dev` على السيرفر. هذا الأمر مخصص للتطوير المحلي فقط.

الطريقة القديمة ما زالت متاحة كخيار احتياطي لإنشاء الجداول أو استيراد البيانات يدويًا:

```bash
mysql -u root -p < database/schema.sql
```

```bash
mysql -u oasis_web -p oasis_web < database/seed.sql
```

أو استخدم سكربت MySQL القديم:

```bash
npm run db:seed:legacy
```

يمكن بدل المتغيرات المنفصلة استخدام `MYSQL_URL=mysql://user:password@host:3306/oasis_web`.

يستخدم التطبيق Prisma Client مع MariaDB adapter. ويدعم أيضًا `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE` و`MYSQL_CONNECTION_LIMIT` كبديل متوافق؛ لكن أوامر Prisma تحتاج `DATABASE_URL`. يظل `database/default-site-content.json` نسخة البيانات الافتراضية القابلة لإعادة الـ seed.

## تشغيل وبناء الإنتاج

```bash
npm ci
npm run build
npm start
```

الخادم يحتاج Node.js 22.5 أو أحدث. يجب أن تكون MySQL قاعدة مشتركة ودائمة، وأن يكون `DATA_DIR` على قرص دائم للوسائط المرفوعة. احتفظ بنسخة احتياطية من جداول MySQL ومجلد `uploads` معًا.

لوحة الإدارة: `/admin`. استخدم البريد الموجود في `ADMIN_EMAIL` وكلمة المرور الموجودة في `ADMIN_PASSWORD`. لا تضع كلمة المرور أو `SESSION_SECRET` في Git.

## API

تبقى واجهات API نفسها: `/api/site`, `/api/services`, `/api/projects`, `/api/clients`, `/api/uploads`, `/api/auth/*`, `/api/health`, بالإضافة إلى sitemap وrobots الديناميكيين. كل عمليات القراءة العامة تعرض العناصر المنشورة فقط، بينما التعديل يتطلب جلسة المدير.

لاختبار API الكامل، جهّز قاعدة MySQL اختبارية ثم شغّل:

```bash
npm run build && MYSQL_DATABASE=oasis_web_test npm run test:api
```
