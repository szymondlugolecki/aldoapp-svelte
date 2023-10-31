CREATE TABLE `address` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`user_id` char(255) NOT NULL,
	`order_id` char(255) NOT NULL);
--> statement-breakpoint
ALTER TABLE `favorite_products` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `address`;