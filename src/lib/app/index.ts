import type { Background, BackgroundHistory, Color, Gradient } from './types';
import { get, writable } from 'svelte/store';
import { nanoid } from 'nanoid';

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

const createStores = () => {
	// TODO: get backgrounds from local storage
	// pick the most recent one initially
	// subscribe to store changes to write to local storage
	const backgrounds = writable<Background[]>([createDefaultBackground()]);
	const background = writable<Background>(get(backgrounds)[0]);

	const history = writable<{ [id: string]: BackgroundHistory }>({});

	// every time background changes, update backgrounds too.
	// this should make things be in sync as long as we have the background in both stores
	background.subscribe((new_bg) => {
		history.update((store) => {
			const bgHistory: BackgroundHistory = store[new_bg.id]
				? { ...store[new_bg.id] }
				: { depth: 0, states: [] };

			// if we are currently looking through the history and then we
			// introduce a change, we "rebase" the depth down and then place our new state
			if (
				bgHistory.depth > 0 &&
				bgHistory.states[bgHistory.states.length - bgHistory.depth] !== new_bg
			) {
				return {
					...store,
					[new_bg.id]: {
						depth: 0,
						states: [...bgHistory.states.slice(0, bgHistory.depth * -1), { ...new_bg }]
					}
				};
			} else {
				return {
					...store,
					[new_bg.id]: {
						...bgHistory,
						states: [...bgHistory.states, { ...new_bg }]
					}
				};
			}
		});

		backgrounds.update((store) => store.map((bg) => (bg.id === new_bg.id ? new_bg : bg)));
	});

	const createGradient = () => {
		background.update((store) => ({
			...store,
			gradients: [...store.gradients, createDefaultGradient()]
		}));
	};

	const deleteGradient = (id: string) => {
		background.update((store) => ({
			...store,
			gradients: store.gradients.filter((gradient) => gradient.id !== id)
		}));
	};

	const createBackground = () => {
		const bg = createDefaultBackground();
		backgrounds.update((store) => {
			return [bg, ...store];
		});

		background.set(bg);
	};

	const deleteBackground = (id: string) => {
		// switch current background before deleting
		if (get(background).id === id) {
			const available = get(backgrounds);
			const i = available.findIndex((bg) => bg.id === id);
			if (i !== -1) {
				let bg: Background = i === available.length - 1 ? available[i - 1] : available[i + 1];
				background.set(bg);
			}
		}

		backgrounds.update((store) => {
			return store.filter((bg) => bg.id !== id);
		});
	};

	const undoCurrentBackground = () => {
		const id = get(background).id;
		const bgHistory = get(history)[id];
		if (bgHistory && bgHistory.depth + 1 < bgHistory.states.length) {
			let newBgHistory: BackgroundHistory = { ...bgHistory, depth: bgHistory.depth + 1 };

			console.log(newBgHistory);

			history.update((store) => ({
				...store,
				[id]: { ...newBgHistory }
			}));
			background.set(bgHistory.states[bgHistory.states.length - (bgHistory.depth + 1)]);
		}
	};

	return {
		background: { ...background, createGradient, deleteGradient },
		backgrounds: { ...backgrounds, createBackground, deleteBackground },
		history: { ...history, undoCurrentBackground }
	};
};

export const { background, backgrounds, history } = createStores();
