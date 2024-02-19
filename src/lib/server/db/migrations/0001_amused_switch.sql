DROP INDEX IF EXISTS `promo_code_use_idx`;--> statement-breakpoint
CREATE INDEX `promo_code_uses_idx` ON `promo_code_uses` (`promocode_used_id`);