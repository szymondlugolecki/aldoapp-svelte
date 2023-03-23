export const imagesSorting = (prevUrl: string, currUrl: string) => {
	const prevUrlArr = prevUrl.split('/');
	const currUrlArr = currUrl.split('/');
	const prevIndex = Number(prevUrlArr[prevUrlArr.length - 1].split('.')[0]);
	const currIndex = Number(currUrlArr[currUrlArr.length - 1].split('.')[0]);
	return prevIndex - currIndex;
};
