ALTER TABLE `carts` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `images` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `promo_code_uses` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `promo_codes` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `verification_tokens` MODIFY COLUMN `created_at` timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `products` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `promo_code_uses` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `promo_codes` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `subscriptions` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `updated_at`;--> statement-breakpoint
ALTER TABLE `verification_tokens` DROP COLUMN `updated_at`;