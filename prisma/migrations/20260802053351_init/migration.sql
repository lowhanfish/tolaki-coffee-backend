/*
  Warnings:

  - You are about to drop the column `address` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `address`,
    DROP COLUMN `phone`,
    DROP COLUMN `updateAt`,
    ADD COLUMN `provider` ENUM('LOCAL', 'GOOGLE', 'GITHUB', 'FACEBOOK') NOT NULL DEFAULT 'LOCAL',
    ADD COLUMN `providerId` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `password` VARCHAR(191) NULL;
