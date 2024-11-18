/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - The required column `username` was added to the `users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_userId_fkey`;

-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `UserWorkspace_username_fkey`;

-- DropForeignKey
ALTER TABLE `workspaces` DROP FOREIGN KEY `workspaces_userId_fkey`;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`username`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workspaces` ADD CONSTRAINT `workspaces_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserWorkspace` ADD CONSTRAINT `UserWorkspace_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
