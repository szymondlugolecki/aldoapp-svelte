CREATE TABLE `order_status_logs` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`street` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`order_id` int NOT NULL,
	`user_id` varchar(36) NOT NULL);
