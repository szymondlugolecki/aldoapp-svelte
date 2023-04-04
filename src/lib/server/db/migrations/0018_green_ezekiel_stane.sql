ALTER TABLE promo_codes RENAME COLUMN `user_id` TO `author_id`;
ALTER TABLE orders MODIFY COLUMN `price` decimal(8,2) NOT NULL;
ALTER TABLE orders MODIFY COLUMN `discount` decimal(8,2) NOT NULL;
ALTER TABLE products MODIFY COLUMN `price` decimal(8,2) NOT NULL;
ALTER TABLE products MODIFY COLUMN `weight` decimal(8,2) NOT NULL;
ALTER TABLE promo_codes MODIFY COLUMN `discount` decimal(8,2) NOT NULL;
DROP INDEX user_idx ON `promo_codes`;
CREATE INDEX author_idx ON promo_codes (`author_id`);