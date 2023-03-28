import { z, ZodError } from 'zod';

export const betterZodParse = <T extends z.ZodTypeAny>(
	schema: T,
	data: unknown
): [z.output<T>, null] | [null, string[]] => {
	try {
		schema.parse(data);
		return [data, null];
	} catch (throwable) {
		if (throwable instanceof ZodError) {
			console.log(throwable.formErrors);
			const { fieldErrors: errors, formErrors } = throwable.flatten();
			const errorList = Object.values(errors)
				.flatMap((x) => x)
				.filter(Boolean) as string[];
			const allErrors = [...errorList, ...formErrors];
			console.log('allErrors', allErrors);
			return [null, allErrors];
		}

		throw throwable;
	}
};
