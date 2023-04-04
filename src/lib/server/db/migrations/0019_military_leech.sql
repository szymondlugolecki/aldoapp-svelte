ALTER TABLE promo_codes MODIFY COLUMN `disabled` boolean NOT NULL DEFAULT true;
ALTER TABLE promo_codes ADD `per_user_use_limit` int NOT NULL;
ALTER TABLE promo_codes DROP COLUMN `one_per_user`;