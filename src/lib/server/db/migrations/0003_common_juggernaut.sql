ALTER TABLE `orders_to_products` DROP FOREIGN KEY `orders_to_products_order_id_orders_id_fk`;

ALTER TABLE `orders_to_products` DROP FOREIGN KEY `orders_to_products_group_id_products_id_fk`;

ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `products` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `promo_codes` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `subscriptions` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `verification_tokens` MODIFY COLUMN `created_at` timestamp DEFAULT (now());