ALTER TABLE `promo_code_uses` RENAME COLUMN `promocode_id` TO `promocode_used_id`;
DROP INDEX `promo_code_id_idx` ON `promo_code_uses`;
CREATE INDEX `promo_code_use_idx` ON `promo_code_uses` (`promocode_used_id`);