-- DropForeignKey
ALTER TABLE `subtasks` DROP FOREIGN KEY `subtasks_taskId_fkey`;

-- DropForeignKey
ALTER TABLE `userworkspace` DROP FOREIGN KEY `userworkspace_taskId_fkey`;

-- AddForeignKey
ALTER TABLE `subtasks` ADD CONSTRAINT `subtasks_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `userworkspace` ADD CONSTRAINT `userworkspace_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
