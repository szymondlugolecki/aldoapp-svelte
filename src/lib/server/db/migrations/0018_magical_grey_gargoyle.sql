DROP INDEX `cart_owner_idx` ON `orders`;--> statement-breakpoint
ALTER TABLE `orders` ADD `cart_owner_id` varchar(36) NOT NULL;--> statement-breakpoint
CREATE INDEX `cart_owner_idx` ON `orders` (`cart_owner_id`);