ALTER TABLE products MODIFY COLUMN `encoded_url` varchar(512) NOT NULL;
ALTER TABLE orders ADD `estimated_delivery_date` timestamp;