ALTER TABLE `users` RENAME COLUMN `assigned_adviser` TO `adviser_id`;
DROP INDEX `assigned_adviserx` ON `users`;
CREATE INDEX `adviser_id` ON `users` (`adviser_id`);
