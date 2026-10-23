CREATE TABLE "site_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY,
    "brand" TEXT NOT NULL,
    "hero" TEXT NOT NULL,
    "sections" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

CREATE TABLE "content_items" (
    "collection" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    PRIMARY KEY ("collection", "item_id")
);

CREATE INDEX "content_items_order" ON "content_items"("collection", "position");

CREATE TABLE "contact_messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX "contact_messages_created_at" ON "contact_messages"("created_at");
