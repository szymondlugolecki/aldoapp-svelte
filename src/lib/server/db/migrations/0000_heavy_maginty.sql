CREATE TABLE `cart_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quantity` integer NOT NULL,
	`product_id` integer NOT NULL,
	`cart_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cart_id`) REFERENCES `carts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `carts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`customer_id` integer NOT NULL,
	`owner_id` integer NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `favorite_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`url` text(512) NOT NULL,
	`product_id` integer NOT NULL,
	`author_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `order_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	`product_id` integer NOT NULL,
	`order_id` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`price` real NOT NULL,
	`discount` real NOT NULL,
	`status` text NOT NULL,
	`paid` integer DEFAULT false NOT NULL,
	`estimated_delivery_date` integer,
	`delivery_method` text NOT NULL,
	`payment_method` text NOT NULL,
	`customer_id` text(36) NOT NULL,
	`cart_owner_id` text(36) NOT NULL,
	`driver_id` text(36)
);
--> statement-breakpoint
CREATE TABLE `order_status_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event` text NOT NULL,
	`timestamp` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`order_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`name` text(255) NOT NULL,
	`description` text(2048),
	`symbol` text(255) NOT NULL,
	`subcategory` text(255),
	`category` text(255) NOT NULL,
	`price` real NOT NULL,
	`weight` real NOT NULL,
	`amount_left` integer NOT NULL,
	`producent` text(255) NOT NULL,
	`encoded_url` text(512) NOT NULL,
	`image` text(2048),
	`hidden` integer DEFAULT false NOT NULL,
	`author_id` text(36) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `promo_code_uses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`promocode_used_id` text(36) NOT NULL,
	`order_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `promo_codes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`code` text(32) NOT NULL,
	`discount` real NOT NULL,
	`valid_since` integer NOT NULL,
	`valid_until` integer NOT NULL,
	`use_limit` integer NOT NULL,
	`per_user_use_limit` integer NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`discount_type` text NOT NULL,
	`min_cart_value` real NOT NULL,
	`author_id` text(36) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expiration_time` integer,
	`keys` text NOT NULL,
	`endpoint` text(512) NOT NULL,
	`user_agent` text(512) NOT NULL,
	`user_id` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_address` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zip_code` text(10) NOT NULL,
	`street` text(255) NOT NULL,
	`city` text(255) NOT NULL,
	`user_id` text(255) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`email` text(320) NOT NULL,
	`name` text(256) NOT NULL,
	`role` text NOT NULL,
	`phone` text(15) NOT NULL,
	`adviser_id` text(255)
);
--> statement-breakpoint
CREATE TABLE `verification_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`code` text(4) NOT NULL,
	`user_agent` text(512) NOT NULL,
	`expires_at` integer NOT NULL,
	`user_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `cart_customer_idx` ON `carts` (`customer_id`);--> statement-breakpoint
CREATE INDEX `cart_owner_idx` ON `carts` (`owner_id`);--> statement-breakpoint
CREATE INDEX `images_author_idx` ON `images` (`author_id`);--> statement-breakpoint
CREATE INDEX `order_customer_idx` ON `orders` (`customer_id`);--> statement-breakpoint
CREATE INDEX `order_cart_owner_idx` ON `orders` (`cart_owner_id`);--> statement-breakpoint
CREATE INDEX `order_driver_idx` ON `orders` (`driver_id`);--> statement-breakpoint
CREATE INDEX `products_author_idx` ON `products` (`author_id`);--> statement-breakpoint
CREATE INDEX `products_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `products_symbol_idx` ON `products` (`symbol`);--> statement-breakpoint
CREATE INDEX `promo_code_use_idx` ON `promo_code_uses` (`promocode_used_id`);--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `promo_code_uses` (`user_id`);--> statement-breakpoint
CREATE INDEX `promo_codes_author_idx` ON `promo_codes` (`author_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_endpointx` ON `subscriptions` (`endpoint`);--> statement-breakpoint
CREATE UNIQUE INDEX `unique_emailx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `adviser_idx` ON `users` (`adviser_id`);--> statement-breakpoint
CREATE INDEX `codex` ON `verification_tokens` (`code`);--> statement-breakpoint
CREATE INDEX `user_agentx` ON `verification_tokens` (`user_agent`);