ALTER TABLE orders RENAME COLUMN `products` TO `products_quantity`;
ALTER TABLE orders ADD `product_ids` json NOT NULL;
ALTER TABLE orders DROP COLUMN `customer`;