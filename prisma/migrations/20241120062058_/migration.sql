/*
  Warnings:

  - You are about to drop the column `userId` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_userId_fkey`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `userId`,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL,
    MODIFY `isShared` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
