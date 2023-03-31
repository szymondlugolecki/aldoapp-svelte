ALTER TABLE users ADD `cuid` varchar(128) NOT NULL;
CREATE UNIQUE INDEX unique_uidx ON users (`cuid`);