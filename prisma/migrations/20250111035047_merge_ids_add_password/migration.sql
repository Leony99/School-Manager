/*
  Warnings:

  - You are about to drop the column `clerkId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `clerkId` on the `Teacher` table. All the data in the column will be lost.
  - Added the required column `password` to the `Parent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Admin_clerkId_key";

-- DropIndex
DROP INDEX "Parent_clerkId_key";

-- DropIndex
DROP INDEX "Student_clerkId_key";

-- DropIndex
DROP INDEX "Teacher_clerkId_key";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "clerkId";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "clerkId",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "clerkId",
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "clerkId",
ADD COLUMN     "password" TEXT NOT NULL;
