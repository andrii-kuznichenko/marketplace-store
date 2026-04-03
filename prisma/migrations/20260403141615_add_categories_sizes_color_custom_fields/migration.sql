-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MEN', 'WOMEN');

-- CreateEnum
CREATE TYPE "MainCategory" AS ENUM ('TOPS', 'BOTTOMS', 'DRESSES', 'OUTERWEAR', 'ACCESSORIES');

-- CreateEnum
CREATE TYPE "Subcategory" AS ENUM ('T_SHIRTS', 'SHIRTS', 'BLOUSES', 'SWEATSHIRTS', 'HOODIES', 'TANK_TOPS', 'CROP_TOPS', 'JEANS', 'TROUSERS', 'SHORTS', 'SKIRTS', 'JOGGERS', 'MINI_DRESS', 'MIDI_DRESS', 'MAXI_DRESS', 'JACKETS', 'COATS', 'BLAZERS', 'VESTS', 'BAGS', 'HATS', 'SCARVES', 'BELTS', 'JEWELRY', 'CHAINMAIL_PIECES');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "color" TEXT,
ADD COLUMN     "colorGroupId" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "mainCategory" "MainCategory",
ADD COLUMN     "subcategory" "Subcategory";

-- CreateTable
CREATE TABLE "ColorGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColorGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSize" (
    "id" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductSize_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCustomField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductCustomField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_colorGroupId_fkey" FOREIGN KEY ("colorGroupId") REFERENCES "ColorGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSize" ADD CONSTRAINT "ProductSize_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCustomField" ADD CONSTRAINT "ProductCustomField_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
