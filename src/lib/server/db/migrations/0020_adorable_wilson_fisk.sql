ALTER TABLE promo_codes ADD `min_cart_value` decimal(8,2) NOT NULL;
ALTER TABLE promo_codes ADD `applicable_products` json NOT NULL;