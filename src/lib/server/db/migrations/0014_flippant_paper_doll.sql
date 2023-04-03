ALTER TABLE orders ADD `customer` json;
ALTER TABLE users ADD `phone` char(15) NOT NULL;
ALTER TABLE orders DROP COLUMN `name`;