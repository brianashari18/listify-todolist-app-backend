/*
  Warnings:

  - You are about to drop the `feedbacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `feedbacks` DROP FOREIGN KEY `feedbacks_userId_fkey`;

-- DropTable
DROP TABLE `feedbacks`;
