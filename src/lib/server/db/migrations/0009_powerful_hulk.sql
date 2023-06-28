CREATE TABLE `order_products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`quantity` smallint NOT NULL,
	`product_id` int NOT NULL,
	`order_id` int NOT NULL);

ALTER TABLE `orders` ADD `ordered_product_ids` int;
CREATE INDEX `order_idx` ON `order_products` (`order_id`);
ALTER TABLE `orders` DROP COLUMN `products_quantity`;