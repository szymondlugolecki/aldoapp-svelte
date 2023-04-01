import type { ErrorLocation } from '$types';

export const areObjectsEqual = <T>(obj1: T, obj2: T) => {
	return JSON.stringify(obj1) === JSON.stringify(obj2);
};

export const customErrorURL = (location: ErrorLocation) => {
	return location;
};

export const sleep = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));
