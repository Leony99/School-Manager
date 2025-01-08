/*
  Warnings:

  - You are about to drop the column `clekrId` on the `Parent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Parent_clekrId_key";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "clekrId",
ADD COLUMN     "clerkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Parent_clerkId_key" ON "Parent"("clerkId");
