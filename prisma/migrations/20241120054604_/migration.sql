/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `workspaces` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspaceId]` on the table `UserWorkspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workSpaceID` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `UserWorkspace_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `workspaces` DROP FOREIGN KEY `workspaces_userId_fkey`;

-- AlterTable
ALTER TABLE `tasks` DROP COLUMN `workspaceId`,
    ADD COLUMN `workSpaceID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `userworkspace` MODIFY `accessRights` INTEGER NOT NULL DEFAULT 1;

-- DropTable
DROP TABLE `workspaces`;

-- CreateIndex
CREATE UNIQUE INDEX `UserWorkspace_workspaceId_key` ON `UserWorkspace`(`workspaceId`);

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_workSpaceID_fkey` FOREIGN KEY (`workSpaceID`) REFERENCES `UserWorkspace`(`workspaceId`) ON DELETE RESTRICT ON UPDATE CASCADE;
