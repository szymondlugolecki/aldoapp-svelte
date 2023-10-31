export const imagesSorting = (prevUrl: string, currUrl: string) => {
	const prevUrlArr = prevUrl.split('/');
	const currUrlArr = currUrl.split('/');
	const prevIndex = Number(prevUrlArr[prevUrlArr.length - 1].split('.')[0]);
	const currIndex = Number(currUrlArr[currUrlArr.length - 1].split('.')[0]);
	return prevIndex - currIndex;
};

export const uniqueObjectById = <T extends Record<string, unknown>>(data: T[]) => {
	const seen = new Set();
	console.log('data', data)
	return data.filter((item) => {
		const duplicate = seen.has(item.id);
		seen.add(item.id);
		return !duplicate;
	}) as unknown as T[];
}