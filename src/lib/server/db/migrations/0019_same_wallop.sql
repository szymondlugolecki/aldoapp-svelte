ALTER TABLE `orders` MODIFY COLUMN `address` json NOT NULL;--> statement-breakpoint
ALTER TABLE `order_products` ADD `price` decimal(8,2) NOT NULL;