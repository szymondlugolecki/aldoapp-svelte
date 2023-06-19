DROP INDEX `adviser_id` ON `users`;
ALTER TABLE `users` ADD `address` json NOT NULL;
CREATE INDEX `adviser_idx` ON `users` (`adviser_id`);

