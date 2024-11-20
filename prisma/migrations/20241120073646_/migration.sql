-- DropForeignKey
ALTER TABLE `tasks` DROP FOREIGN KEY `tasks_workSpaceID_fkey`;

-- AlterTable
ALTER TABLE `tasks` MODIFY `workSpaceID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_workSpaceID_fkey` FOREIGN KEY (`workSpaceID`) REFERENCES `UserWorkspace`(`workspaceId`) ON DELETE SET NULL ON UPDATE CASCADE;
