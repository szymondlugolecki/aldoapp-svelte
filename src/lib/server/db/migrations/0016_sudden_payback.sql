DROP INDEX unique_customer_idx ON `orders`;
DROP INDEX unique_promo_code_idx ON `orders`;
DROP INDEX unique_codex ON `verification_tokens`;
DROP INDEX unique_user_agentx ON `verification_tokens`;
CREATE INDEX customer_idx ON orders (`customer_id`);
CREATE INDEX promo_code_idx ON orders (`promo_code_id`);
CREATE INDEX codex ON verification_tokens (`code`);
CREATE INDEX user_agentx ON verification_tokens (`user_agent`);