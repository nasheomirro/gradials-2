<script lang="ts">
	import { produce } from 'immer';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { Color, Gradient } from '$lib/app/types';
	import ColorInput from '$lib/input/ColorInput.svelte';
	import StopInput from '$lib/input/StopInput.svelte';
	import RgbaEditor from './RGBAEditor.svelte';
	import ControlledInput from '$lib/input/ControlledInput.svelte';
	import HsvEditor from './HSVEditor.svelte';
	import { colord, type HsvaColor, type RgbaColor } from 'colord';
	import ColorStopEditor from './ColorStopEditor.svelte';
	import { isRgb } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		change: Gradient;
		deleteself: string;
	}>();

	export let gradient: Gradient;
	let currentId: string = gradient.colors[0]?.id;
	$: currentColor = gradient.colors.find((color) => color.id === currentId);

	const handleUpdateColorValue = (id: string) => (e: CustomEvent<RgbaColor | HsvaColor>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				let i = draft.colors.findIndex((color) => color.id === id);
				if (i !== -1) {
					const color = e.detail;
					if (isRgb(color)) {
						draft.colors[i].rgb = color;
						draft.colors[i].hsv = colord(color).toHsv();
					} else {
						draft.colors[i].hsv = color;
						draft.colors[i].rgb = colord(color).toRgb();
					}
				}
			})
		);
	};

	const handleUpdateColorStop = (id: string) => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				let i = draft.colors.findIndex((color) => color.id === id);
				if (i !== -1) {
					draft.colors[i].stop = e.detail;
					draft.colors = [...draft.colors].sort((a, b) => a.stop - b.stop);
				}
			})
		);
	};

	const handleUpdateColor = (e: CustomEvent<Color>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				const i = draft.colors.findIndex((color) => color.id === e.detail.id);
				if (i !== -1) {
					draft.colors[i] = e.detail;
					draft.colors = [...draft.colors].sort((a, b) => a.stop - b.stop);
				}
			})
		);
	};

	const handleUpdatePosition = (direction: 'x' | 'y') => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft[direction] = e.detail;
			})
		);
	};

	const handleCreateColor = (e: CustomEvent<Color>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft.colors = [...draft.colors, e.detail].sort((a, b) => a.stop - b.stop);
			})
		);
	};

	const deleteColor = (id: string) => {
		if (gradient.colors.length > 2) {
			if (currentId === id) {
				let i = gradient.colors.findIndex((color) => color.id === currentId);
				if (i !== -1) {
					i = i >= gradient.colors.length - 1 ? i - 1 : i + 1;
					currentId = gradient.colors[i].id;
				}
			}
			dispatch(
				'change',
				produce(gradient, (draft) => {
					draft.colors = draft.colors.filter((color) => color.id !== id);
				})
			);
		}
	};

	onMount(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === 'Backspace' || e.key === 'Delete') {
				deleteColor(currentId);
			}
		};
		window.addEventListener('keydown', listener);
		return () => window.removeEventListener('keydown', listener);
	});
</script>

<div>
	<div><button on:click={() => dispatch('deleteself', gradient.id)}>delete</button></div>
	{#if currentColor}
		<ColorStopEditor
			{currentColor}
			colors={gradient.colors}
			on:change={handleUpdateColor}
			on:create={handleCreateColor}
			on:focus={(e) => (currentId = e.detail)}
		/>
		<!-- shape and position -->
		<div>
			<button
				on:click={() =>
					dispatch(
						'change',
						produce(gradient, (draft) => {
							draft.shape = draft.shape === 'circle' ? 'ellipse' : 'circle';
						})
					)}>change shape</button
			>
			<ControlledInput
				numType="float"
				on:input={handleUpdatePosition('x')}
				value={gradient.x}
				max={100}>X</ControlledInput
			>
			<ControlledInput
				numType="float"
				on:input={handleUpdatePosition('y')}
				value={gradient.y}
				max={100}>Y</ControlledInput
			>
		</div>

		<!-- colors -->
		<div>
			{#each gradient.colors as color (color.id)}
				<ColorInput
					{color}
					on:focus={() => (currentId = color.id)}
					on:submit={handleUpdateColorValue(color.id)}
				/>
				<StopInput
					{color}
					on:focus={() => (currentId = color.id)}
					on:submit={handleUpdateColorStop(color.id)}
				/>
				<button on:click={() => deleteColor(color.id)}>delete</button>
			{/each}
		</div>

		<!-- current color -->
		<div>
			<RgbaEditor color={currentColor} on:change={handleUpdateColorValue(currentId)} />
			<HsvEditor color={currentColor} on:change={handleUpdateColorValue(currentId)} />
		</div>
	{/if}
</div>
