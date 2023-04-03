ALTER TABLE orders ADD `price` float NOT NULL;
ALTER TABLE orders ADD `discount` float NOT NULL;
ALTER TABLE orders ADD `order_history` json NOT NULL;