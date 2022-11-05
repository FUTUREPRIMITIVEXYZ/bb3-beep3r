/*
  Warnings:

  - Added the required column `text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "text" VARCHAR(120) NOT NULL;
