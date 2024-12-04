/*
  Warnings:

  - Made the column `address` on table `Parent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `Teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Parent" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "address" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "address" SET NOT NULL;
