ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `cart_id` int;--> statement-breakpoint
ALTER TABLE `cart_products` DROP COLUMN `quantity`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `orders` DROP COLUMN `no_discount_price`;