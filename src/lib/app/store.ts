import type { Background, BackgroundStore } from './types';
import { writable } from 'svelte/store';
import { produce, type Draft } from 'immer';
import { createDefaultBackground } from '$lib/utils';
import { getBackgrounds, saveBackgrounds } from './storage';

const createStore = () => {
	const backgrounds = writable<BackgroundStore>(getBackgrounds());

	backgrounds.subscribe((bgs) => saveBackgrounds(bgs));

	const createBackground = () => {
		const bg = createDefaultBackground();
		backgrounds.update((store) =>
			produce(store, (draft) => {
				draft.backgrounds.push(bg);
				draft.current = draft.backgrounds.length - 1;
			})
		);
	};

	const deleteBackground = (id: string) => {
		backgrounds.update((store) =>
			produce(store, (draft) => {
				// switch current background if about to be deleted
				const i = draft.backgrounds.findIndex((bg) => bg.id === id);
				if (i !== -1 && i === draft.current) {
					draft.current = i === draft.backgrounds.length - 1 ? i - 1 : i;
				}
				draft.backgrounds = draft.backgrounds.filter((bg) => bg.id !== id);
			})
		);
	};

	const updateBackground = (backgroundId: string, updater: (draft: Draft<Background>) => void) => {
		backgrounds.update((store) =>
			produce(store, (draft) => {
				let i = draft.backgrounds.findIndex((background) => background.id === backgroundId);
				if (i !== -1) {
					draft.backgrounds[i] = produce(draft.backgrounds[i], updater);
				}
			})
		);
	};

	const updateCurrent = (i: number) => {
		backgrounds.update((store) => ({
			...store,
			current: i
		}));
	};

	return {
		subscribe: backgrounds.subscribe,
		createBackground,
		deleteBackground,
		updateBackground,
		updateCurrent
	};
};

export const backgrounds = createStore();
export const showPanel = writable(true);
