CREATE TABLE `order_address` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`order_id` int NOT NULL);
--> statement-breakpoint
CREATE TABLE `user_address` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`user_id` char(255) NOT NULL);
--> statement-breakpoint
DROP TABLE `address`;--> statement-breakpoint
DROP INDEX `promo_code_idx` ON `orders`;--> statement-breakpoint
DROP INDEX `cart_idx` ON `users`;--> statement-breakpoint
ALTER TABLE `verification_tokens` MODIFY COLUMN `user_agent` varchar(512) NOT NULL;--> statement-breakpoint
ALTER TABLE `carts` DROP COLUMN `cart_products_ids`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `address`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `address_id`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `ordered_products_ids`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `promo_code_id`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `images_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `access`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `address_id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `cart_id`;