/*
  Warnings:

  - You are about to drop the column `hashedRT` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `users_username_key` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `hashedRT`,
    DROP COLUMN `username`,
    ADD COLUMN `hashedRt` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `profiles` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `phone` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_provider_providerId_key` ON `users`(`provider`, `providerId`);

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
