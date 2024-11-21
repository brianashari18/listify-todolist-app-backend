/*
  Warnings:

  - You are about to alter the column `createdBy` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - The primary key for the `userworkspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `username` on the `userworkspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `UserWorkspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_createdBy_fkey`;

-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `UserWorkspace_username_fkey`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `color` VARCHAR(50) NULL,
    MODIFY `createdBy` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `username` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `userworkspace` DROP PRIMARY KEY,
    DROP COLUMN `username`,
    ADD COLUMN `id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`, `workspaceId`);

-- CreateIndex
CREATE UNIQUE INDEX `users_username_key` ON `users`(`username`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserWorkspace` ADD CONSTRAINT `UserWorkspace_id_fkey` FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
