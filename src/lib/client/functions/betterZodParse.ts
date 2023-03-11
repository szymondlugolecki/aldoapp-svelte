import { ZodError } from 'zod';

export const betterZodParse = <T>(fakePromise: T): [T, null] | [null, string[]] => {
	try {
		const data = fakePromise;
		return [data, null];
	} catch (throwable) {
		console.log('Parsing Error', throwable);
		if (throwable instanceof ZodError) {
			const { fieldErrors: errors } = throwable.flatten();
			const errorList = Object.values(errors)
				.flatMap((x) => x)
				.filter(Boolean) as string[];
			return [null, errorList];
		}

		throw throwable;
	}
};
