ALTER TABLE `promo_code_uses` MODIFY COLUMN `created_at` timestamp DEFAULT (now());
ALTER TABLE `promo_code_uses` MODIFY COLUMN `updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP;