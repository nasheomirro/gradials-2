import type { Background, Gradient } from './types';
import { writable } from 'svelte/store';
import { nanoid } from 'nanoid';
import { produce, type Draft } from 'immer';

const createDefaultGradient = (): Gradient => {
	return {
		colors: [
			{
				value: '#aaffaa',
				stop: 0
			},
			{
				value: '#00000000',
				stop: 50
			}
		],
		id: nanoid(6),
		shape: 'ellipse',
		x: 0,
		y: 0
	};
};

const createDefaultBackground = (): Background => {
	return {
		name: 'New Background',
		gradients: [createDefaultGradient()],
		openedAt: new Date(),
		id: nanoid(6)
	};
};

const createStore = () => {
	const backgrounds = writable<{
		current: number;
		backgrounds: Background[];
	}>({
		current: 0,
		backgrounds: [createDefaultBackground()]
	});

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
					draft.current = i === draft.backgrounds.length - 1 ? i - 1 : i + 1;
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

	const updateGradient = (
		backgroundId: string,
		gradientId: string,
		updater: (draft: Draft<Gradient>) => void
	) => {
		updateBackground(backgroundId, (draft) => {
			let i = draft.gradients.findIndex((gradient) => gradient.id === gradientId);
			if (i !== -1) {
				draft.gradients[i] = produce(draft.gradients[i], updater);
			}
		});
	};

	return {
		subscribe: backgrounds.subscribe,
		createBackground,
		deleteBackground,
		updateBackground,
		updateGradient
	};
};

export const backgrounds = createStore();
