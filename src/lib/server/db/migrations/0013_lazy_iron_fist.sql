CREATE TABLE `cart_products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`quantity` smallint NOT NULL,
	`product_id` int NOT NULL,
	`cart_id` int NOT NULL);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`cart_products_ids` int,
	`customer_id` varchar(36) NOT NULL,
	`owner_id` varchar(36) NOT NULL);
--> statement-breakpoint
ALTER TABLE `users` ADD `cart_id` char(255);--> statement-breakpoint
CREATE INDEX `customer_idx` ON `carts` (`customer_id`);--> statement-breakpoint
CREATE INDEX `cart_idx` ON `users` (`cart_id`);