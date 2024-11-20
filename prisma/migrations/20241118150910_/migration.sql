/*
  Warnings:

  - You are about to alter the column `otp` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(4)` to `Int`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `otp` INTEGER NULL;
