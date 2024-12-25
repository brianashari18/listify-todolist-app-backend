-- CreateTable
CREATE TABLE `trash` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `subTaskId` INTEGER NOT NULL,
    `taskData` VARCHAR(255) NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `status` VARCHAR(50) NOT NULL,
    `deletedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trash` ADD CONSTRAINT `trash_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `tasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trash` ADD CONSTRAINT `trash_subTaskId_fkey` FOREIGN KEY (`subTaskId`) REFERENCES `subtasks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
