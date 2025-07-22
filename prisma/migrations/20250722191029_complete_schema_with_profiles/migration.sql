-- AlterTable
ALTER TABLE "afcd_foods" ADD COLUMN "niacin" REAL;
ALTER TABLE "afcd_foods" ADD COLUMN "potassium" REAL;
ALTER TABLE "afcd_foods" ADD COLUMN "riboflavin" REAL;
ALTER TABLE "afcd_foods" ADD COLUMN "thiamin" REAL;

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainerId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodStart" DATETIME NOT NULL,
    "currentPeriodEnd" DATETIME NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "stripeSubscriptionId" TEXT,
    "stripeProductId" TEXT,
    "stripePriceId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subscriptions_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "personal_trainers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainerId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "stripeInvoiceId" TEXT,
    "description" TEXT,
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "personal_trainers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trainerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "heightCm" REAL,
    "startingWeightKg" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'invited',
    "age" INTEGER,
    "currentWeightKg" REAL,
    "bodyFatPercentage" REAL,
    "phoneNumber" TEXT,
    "profilePictureUrl" TEXT,
    CONSTRAINT "clients_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "personal_trainers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_clients" ("createdAt", "email", "heightCm", "id", "name", "passwordHash", "startingWeightKg", "trainerId", "updatedAt") SELECT "createdAt", "email", "heightCm", "id", "name", "passwordHash", "startingWeightKg", "trainerId", "updatedAt" FROM "clients";
DROP TABLE "clients";
ALTER TABLE "new_clients" RENAME TO "clients";
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");
CREATE TABLE "new_personal_trainers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'Solo',
    "subscriptionStatus" TEXT NOT NULL DEFAULT 'trial',
    "subscriptionExpiresAt" DATETIME,
    "stripeCustomerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bio" TEXT,
    "specializations" TEXT,
    "certifications" TEXT,
    "phoneNumber" TEXT,
    "profilePictureUrl" TEXT,
    "businessName" TEXT,
    "location" TEXT,
    "yearsExperience" INTEGER
);
INSERT INTO "new_personal_trainers" ("createdAt", "email", "id", "name", "passwordHash", "subscriptionTier", "updatedAt") SELECT "createdAt", "email", "id", "name", "passwordHash", "subscriptionTier", "updatedAt" FROM "personal_trainers";
DROP TABLE "personal_trainers";
ALTER TABLE "new_personal_trainers" RENAME TO "personal_trainers";
CREATE UNIQUE INDEX "personal_trainers_email_key" ON "personal_trainers"("email");
CREATE UNIQUE INDEX "personal_trainers_stripeCustomerId_key" ON "personal_trainers"("stripeCustomerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeInvoiceId_key" ON "payments"("stripeInvoiceId");
