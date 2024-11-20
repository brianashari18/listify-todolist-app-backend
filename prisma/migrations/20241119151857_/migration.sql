/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_otp_key` ON `users`(`otp`);
