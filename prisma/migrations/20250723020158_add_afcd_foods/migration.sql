-- CreateTable
CREATE TABLE "afcd_foods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicFoodKey" TEXT NOT NULL,
    "classification" TEXT,
    "foodName" TEXT NOT NULL,
    "energyKJ" REAL NOT NULL,
    "energyKJNoDibre" REAL NOT NULL,
    "moisture" REAL NOT NULL,
    "protein" REAL NOT NULL,
    "fat" REAL NOT NULL,
    "carbohydrate" REAL NOT NULL,
    "fiber" REAL,
    "ash" REAL,
    "calcium" REAL,
    "iron" REAL,
    "sodium" REAL,
    "vitaminC" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "afcd_foods_publicFoodKey_key" ON "afcd_foods"("publicFoodKey");
