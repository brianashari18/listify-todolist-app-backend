/*
  Warnings:

  - You are about to drop the column `workSpaceID` on the `tasks` table. All the data in the column will be lost.
  - The primary key for the `userworkspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `userworkspace` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `userworkspace` table. All the data in the column will be lost.
  - Added the required column `taskId` to the `userworkspace` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `userworkspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_workSpaceID_fkey`;

-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `UserWorkspace_id_fkey`;

-- DropIndex
DROP INDEX `UserWorkspace_workspaceId_key` ON `userworkspace`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `workSpaceID`;

-- AlterTable
ALTER TABLE `userworkspace` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `workspaceId`,
    ADD COLUMN `taskId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`userId`, `taskId`);

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `userworkspace_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `userworkspace_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
