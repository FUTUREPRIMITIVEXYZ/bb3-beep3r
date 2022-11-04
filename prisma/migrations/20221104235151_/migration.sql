/*
  Warnings:

  - A unique constraint covering the columns `[wallet]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "wallet" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_wallet_key" ON "User"("wallet");
