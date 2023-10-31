CREATE TABLE `favorite_products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`product_id` int NOT NULL,
	`author_id` varchar(36) NOT NULL);
