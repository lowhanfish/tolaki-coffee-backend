/*
  Warnings:

  - You are about to drop the column `productId` on the `files` table. All the data in the column will be lost.
  - Added the required column `table_id` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `table_name` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_productId_fkey`;

-- DropIndex
DROP INDEX `files_productId_fkey` ON `files`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `productId`,
    ADD COLUMN `table_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `table_name` VARCHAR(191) NOT NULL;
