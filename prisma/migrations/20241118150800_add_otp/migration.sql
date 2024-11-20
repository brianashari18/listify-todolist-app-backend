-- AlterTable
ALTER TABLE `users` ADD COLUMN `otp` VARCHAR(4) NULL,
    ADD COLUMN `otpExpire` DATETIME(3) NULL;
