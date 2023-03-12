export const createPromise = (): [
	Promise<unknown>,
	(value: null) => void,
	(reason?: string) => void
] => {
	let resolver = (value: null) => {
		value;
		return;
	};
	let rejector = (reason?: string) => {
		reason;
		return;
	};
	return [
		new Promise((resolve, reject) => {
			resolver = resolve;
			rejector = reject;
		}),
		resolver,
		rejector
	];
};
