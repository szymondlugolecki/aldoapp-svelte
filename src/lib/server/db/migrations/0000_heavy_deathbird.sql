CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`price` decimal(8,2) NOT NULL,
	`discount` decimal(8,2) NOT NULL,
	`payment_status` text NOT NULL,
	`status` text NOT NULL,
	`delivery_status` text NOT NULL,
	`address` json,
	`estimated_delivery_date` timestamp,
	`delivery_method` text NOT NULL,
	`payment_method` text NOT NULL,
	`products_quantity` json NOT NULL,
	`ordered_products_ids` int,
	`customer_id` varchar(36) NOT NULL,
	`promo_code_id` int,
	`driver_id` varchar(36));

CREATE TABLE `orders_to_products` (
	`order_id` int NOT NULL,
	`group_id` int NOT NULL,
	PRIMARY KEY(`group_id`,`order_id`)
);

CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(255) NOT NULL,
	`description` varchar(2048),
	`symbol` varchar(255) NOT NULL,
	`subcategory` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`price` decimal(8,2) NOT NULL,
	`weight` decimal(8,2) NOT NULL,
	`amount_left` int NOT NULL,
	`producent` varchar(255) NOT NULL,
	`encoded_url` varchar(512) NOT NULL,
	`images` json NOT NULL DEFAULT ('[]'),
	`author_id` varchar(36) NOT NULL);

CREATE TABLE `promo_code_uses` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`promocode_id` varchar(36) NOT NULL,
	`user_id` char(255) NOT NULL);

CREATE TABLE `promo_codes` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`code` varchar(32) NOT NULL,
	`discount` decimal(8,2) NOT NULL,
	`valid_since` timestamp NOT NULL,
	`valid_until` timestamp NOT NULL,
	`use_limit` int NOT NULL,
	`per_user_use_limit` int NOT NULL,
	`disabled` boolean NOT NULL DEFAULT true,
	`discount_type` text NOT NULL,
	`min_cart_value` decimal(8,2) NOT NULL,
	`applicable_products` json NOT NULL,
	`author_id` varchar(36) NOT NULL);

CREATE TABLE `subscriptions` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`subscription` json NOT NULL,
	`endpoint` varchar(767) NOT NULL,
	`user_id` char(255) NOT NULL);

CREATE TABLE `users` (
	`id` char(255) PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`email` varchar(320) NOT NULL,
	`name` varchar(256) NOT NULL,
	`role` text NOT NULL,
	`access` boolean NOT NULL DEFAULT true,
	`phone` char(15) NOT NULL,
	`assigned_adviser` char(255));

CREATE TABLE `verification_tokens` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	`token` varchar(72) NOT NULL,
	`code` char(4) NOT NULL,
	`user_agent` varchar(400) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`user_id` char(255) NOT NULL);

CREATE INDEX `customer_idx` ON `orders` (`customer_id`);
CREATE INDEX `promo_code_idx` ON `orders` (`promo_code_id`);
CREATE INDEX `driver_idx` ON `orders` (`driver_id`);
CREATE INDEX `author_idx` ON `products` (`author_id`);
CREATE INDEX `promo_code_id_idx` ON `promo_code_uses` (`promocode_id`);
CREATE INDEX `user_id_idx` ON `promo_code_uses` (`user_id`);
CREATE INDEX `author_idx` ON `promo_codes` (`author_id`);
CREATE UNIQUE INDEX `subscription_endpointx` ON `subscriptions` (`endpoint`);
CREATE UNIQUE INDEX `unique_emailx` ON `users` (`email`);
CREATE INDEX `assigned_adviserx` ON `users` (`assigned_adviser`);
CREATE UNIQUE INDEX `unique_tokenx` ON `verification_tokens` (`token`);
CREATE INDEX `codex` ON `verification_tokens` (`code`);
CREATE INDEX `user_agentx` ON `verification_tokens` (`user_agent`);
ALTER TABLE `orders_to_products` ADD CONSTRAINT `orders_to_products_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;
ALTER TABLE `orders_to_products` ADD CONSTRAINT `orders_to_products_group_id_products_id_fk` FOREIGN KEY (`group_id`) REFERENCES `products`(`id`) ON DELETE no action ON UPDATE no action;