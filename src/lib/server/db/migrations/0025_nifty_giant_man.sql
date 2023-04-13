ALTER TABLE orders ADD `driver_id` varchar(36);
ALTER TABLE users ADD `assigned_adviser` char(255);
CREATE INDEX driver_idx ON orders (`driver_id`);