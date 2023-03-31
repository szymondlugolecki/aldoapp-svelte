CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`email` varchar(320) NOT NULL,
	`name` varchar(256),
	`role` text NOT NULL,
	`banned` boolean NOT NULL DEFAULT false
);

CREATE TABLE `verification_tokens` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`token` varchar(72) NOT NULL,
	`code` char(4) NOT NULL,
	`user_agent` varchar(400) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`user_id` int NOT NULL
);

CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`status` text NOT NULL,
	`address` json,
	`name` varchar(256) NOT NULL,
	`products` json NOT NULL,
	`customer_id` int NOT NULL,
	`promo_code_id` int
);

CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`symbol` varchar(255) NOT NULL,
	`category` varchar(255) NOT NULL,
	`subcategory` varchar(255) NOT NULL,
	`price` float NOT NULL,
	`weight` float NOT NULL,
	`amount_left` int NOT NULL,
	`producent` varchar(255) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`encoded_url` varchar(255) NOT NULL
);

CREATE TABLE `promo_code_usages` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`promocode_id` varchar(36) NOT NULL,
	`user_id` int NOT NULL
);

CREATE TABLE `promo_codes` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`code` varchar(32) NOT NULL,
	`discount` double NOT NULL,
	`valid_since` timestamp NOT NULL,
	`valid_until` timestamp NOT NULL,
	`use_limit` int NOT NULL,
	`one_per_user` boolean NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`discount_type` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`encoded_url` varchar(255) NOT NULL
);

CREATE TABLE `Subscription` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`subscription` json NOT NULL,
	`endpoint` varchar(2000) NOT NULL,
	`user_id` int NOT NULL
);

ALTER TABLE verification_tokens ADD CONSTRAINT verification_tokens_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
ALTER TABLE orders ADD CONSTRAINT orders_customer_id_users_id_fk FOREIGN KEY (`customer_id`) REFERENCES users(`id`) ;
ALTER TABLE orders ADD CONSTRAINT orders_promo_code_id_promo_codes_id_fk FOREIGN KEY (`promo_code_id`) REFERENCES promo_codes(`id`) ;
ALTER TABLE products ADD CONSTRAINT products_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
ALTER TABLE promo_code_usages ADD CONSTRAINT promo_code_usages_promocode_id_promo_codes_id_fk FOREIGN KEY (`promocode_id`) REFERENCES promo_codes(`id`) ;
ALTER TABLE promo_code_usages ADD CONSTRAINT promo_code_usages_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
ALTER TABLE promo_codes ADD CONSTRAINT promo_codes_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
ALTER TABLE Subscription ADD CONSTRAINT Subscription_user_id_users_id_fk FOREIGN KEY (`user_id`) REFERENCES users(`id`) ;
CREATE UNIQUE INDEX unique_emailx ON users (`email`);
CREATE UNIQUE INDEX unique_tokenx ON verification_tokens (`token`);
CREATE INDEX unique_codex ON verification_tokens (`code`);
CREATE INDEX unique_user_agentx ON verification_tokens (`user_agent`);
CREATE UNIQUE INDEX unique_customer_idx ON orders (`customer_id`);
CREATE UNIQUE INDEX unique_promo_code_idx ON orders (`promo_code_id`);
CREATE UNIQUE INDEX user_id ON products (`user_id`);
CREATE UNIQUE INDEX promo_code_id_idx ON promo_code_usages (`promocode_id`);
CREATE UNIQUE INDEX user_id_idx ON promo_code_usages (`user_id`);
CREATE UNIQUE INDEX user_idx ON promo_codes (`user_id`);
CREATE UNIQUE INDEX subscription_idx ON Subscription (`id`);
CREATE UNIQUE INDEX subscription_endpointx ON Subscription (`endpoint`);