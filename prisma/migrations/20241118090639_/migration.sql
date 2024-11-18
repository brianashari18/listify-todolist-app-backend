/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `workspaces` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `workspaces_userId_key` ON `workspaces`(`userId`);
