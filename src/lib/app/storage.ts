import { createDefaultBackground } from '$lib/utils';
import type { Background, BackgroundStore } from './types';

const storageKey = 'local-storage-backgrounds';

export const getBackgrounds = (): BackgroundStore => {
	const item = localStorage.getItem(storageKey);
	if (item) {
		return JSON.parse(item) as BackgroundStore;
	}
	return { current: 0, backgrounds: [createDefaultBackground()] };
};

const BOUNCE_TIME_MS = 1000;
let timeoutId: number;

export const saveBackgrounds = (backgrounds: BackgroundStore) => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		const item = JSON.stringify(backgrounds);
		localStorage.setItem(storageKey, item);
	}, BOUNCE_TIME_MS);
};
