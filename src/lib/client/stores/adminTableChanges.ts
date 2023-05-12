import type { CellTypes } from '$types';
import { writable, get } from 'svelte/store';

export const openedModal = writable<DefaultModal>({} as DefaultModal);

export type DefaultModal = {
	open: boolean;
	type: 'create' | 'edit' | 'delete';
	contentType: CellTypes;
	value: string | number | boolean | Date;
	name: string;
	key: string;
	id: string | number;
	elementIdentifier: string;
};

export const openEditModal = (editModalData: {
	contentType: DefaultModal['contentType'];
	defaultValue: DefaultModal['value'];
	name: string;
	key: DefaultModal['key'];
	id: DefaultModal['id'];
	elementIdentifier: string;
}) => {
	const { contentType, defaultValue, name, key, id, elementIdentifier } = editModalData;
	openedModal.set({
		open: true,
		type: 'edit',
		contentType,
		value: defaultValue,
		name,
		key,
		id,
		elementIdentifier
	});

	console.log(get(openedModal));
};
