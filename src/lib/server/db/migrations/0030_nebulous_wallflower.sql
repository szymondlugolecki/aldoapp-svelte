ALTER TABLE `subscriptions` MODIFY COLUMN `endpoint` varchar(1024) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `expiration_time` mediumint;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `keys` json NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` ADD `user_agent` varchar(512) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `subscription`;