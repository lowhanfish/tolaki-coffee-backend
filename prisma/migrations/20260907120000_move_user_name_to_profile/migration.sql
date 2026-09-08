-- Add the profile-owned name column first so existing data can be preserved.
ALTER TABLE `profiles` ADD COLUMN `name` VARCHAR(191) NULL;

-- Move names into profiles that already exist.
UPDATE `profiles` AS `p`
INNER JOIN `users` AS `u` ON `u`.`id` = `p`.`userId`
SET `p`.`name` = `u`.`name`
WHERE `p`.`name` IS NULL AND `u`.`name` IS NOT NULL;

-- Some older accounts may not have a profile yet. Create one before dropping users.name.
INSERT INTO `profiles` (`id`, `userId`, `name`, `createdAt`, `updatedAt`)
SELECT UUID(), `u`.`id`, `u`.`name`, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM `users` AS `u`
LEFT JOIN `profiles` AS `p` ON `p`.`userId` = `u`.`id`
WHERE `p`.`id` IS NULL;

ALTER TABLE `users` DROP COLUMN `name`;
