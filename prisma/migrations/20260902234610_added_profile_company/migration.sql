/*
  Warnings:

  - Added the required column `createdBy` to the `companyprofile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyProfileId` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `news` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyProfileId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `companyprofile` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `companyProfileId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `news` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `companyProfileId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `companyprofile` ADD CONSTRAINT `companyprofile_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `companyprofile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_createdBy_fkey` FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `companyprofile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
