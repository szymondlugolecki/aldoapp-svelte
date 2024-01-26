ALTER TABLE `order_status_logs` ADD `event` enum('DELIVERED','SHIPPED','CANCEL','IS_UNAVAILABLE','READY_FOR_PICKUP','PICKED_UP','IS_AVAILABLE_FOR_SHIPMENT','IS_AVAILABLE_FOR_PICKUP') NOT NULL;--> statement-breakpoint
ALTER TABLE `order_status_logs` DROP COLUMN `zip_code`;--> statement-breakpoint
ALTER TABLE `order_status_logs` DROP COLUMN `street`;--> statement-breakpoint
ALTER TABLE `order_status_logs` DROP COLUMN `city`;