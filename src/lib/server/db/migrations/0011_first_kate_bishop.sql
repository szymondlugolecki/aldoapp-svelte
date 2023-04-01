DROP INDEX subscription_idx ON `subscriptions`;
CREATE UNIQUE INDEX subscription_endpointx ON subscriptions (`endpoint`);