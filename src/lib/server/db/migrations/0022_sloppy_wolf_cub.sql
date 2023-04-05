ALTER TABLE products RENAME COLUMN `user_id` TO `author_id`;
DROP INDEX author_id ON `products`;
CREATE INDEX author_idx ON products (`author_id`);