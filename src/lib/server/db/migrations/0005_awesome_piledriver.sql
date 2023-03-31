ALTER TABLE users MODIFY COLUMN `id` char NOT NULL;
ALTER TABLE users DROP COLUMN `cuid`;
DROP INDEX unique_uidx ON `users`;