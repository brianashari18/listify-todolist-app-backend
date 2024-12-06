/*
  Warnings:

  - The primary key for the `userworkspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `userworkspace` table. All the data in the column will be lost.
  - Added the required column `email` to the `userworkspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `userworkspace_userId_fkey`;

-- AlterTable
ALTER TABLE `userworkspace` DROP PRIMARY KEY,
    DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`email`, `taskId`);

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `userworkspace_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
