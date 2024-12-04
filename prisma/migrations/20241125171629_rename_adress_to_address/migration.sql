/*
  Warnings:

  - You are about to drop the column `adress` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `adress` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "adress",
ADD COLUMN     "address" TEXT;
