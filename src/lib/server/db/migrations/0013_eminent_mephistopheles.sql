ALTER TABLE promo_code_usages MODIFY COLUMN `user_id` char(255) NOT NULL;
ALTER TABLE subscriptions MODIFY COLUMN `user_id` char(255) NOT NULL;
ALTER TABLE verification_tokens MODIFY COLUMN `user_id` char(255) NOT NULL;