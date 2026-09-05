/*
  Warnings:

  - Added the required column `companyProfileId` to the `partners` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `partners` ADD COLUMN `companyProfileId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `partners` ADD CONSTRAINT `partners_companyProfileId_fkey` FOREIGN KEY (`companyProfileId`) REFERENCES `companyprofile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
