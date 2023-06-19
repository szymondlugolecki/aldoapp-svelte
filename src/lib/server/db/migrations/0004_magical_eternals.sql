CREATE TABLE `images` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	`url` varchar(512) NOT NULL,
	`product_id` varchar(36) NOT NULL,
	`author_id` varchar(36) NOT NULL);

ALTER TABLE `orders` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `products` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `promo_codes` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `subscriptions` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `verification_tokens` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE `products` ADD `images_id` int;
CREATE INDEX `author_idx` ON `images` (`author_id`);
CREATE INDEX `name_idx` ON `products` (`name`);
CREATE INDEX `symbol_idx` ON `products` (`symbol`);
ALTER TABLE `products` DROP COLUMN `images`;