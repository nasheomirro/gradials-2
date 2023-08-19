<script lang="ts">
	import { produce } from 'immer';
	import { createEventDispatcher } from 'svelte';
	import type { Gradient } from '$lib/app/types';
	import ColorInput from '$lib/input/ColorInput.svelte';
	import StopInput from '$lib/input/StopInput.svelte';
	import RgbaEditor from './RGBAEditor.svelte';
	import ControlledInput from '$lib/input/ControlledInput.svelte';
	import HsvEditor from './HSVEditor.svelte';
	import type { AnyColor } from 'colord';

	const dispatch = createEventDispatcher<{
		change: Gradient;
	}>();

	export let gradient: Gradient;
	let current = 0;

	const handleColorValue = (i: number) => (e: CustomEvent<AnyColor>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft.colors[i].value = e.detail;
			})
		);
	};

	const handleColorStop = (i: number) => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft.colors[i].stop = e.detail;
			})
		);
	};

	const handlePosition = (direction: 'x' | 'y') => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft[direction] = e.detail;
			})
		);
	};
</script>

<div>
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
		<ControlledInput numType="float" on:input={handlePosition('x')} value={gradient.x} max={100}
			>X</ControlledInput
		>
		<ControlledInput numType="float" on:input={handlePosition('y')} value={gradient.y} max={100}
			>Y</ControlledInput
		>
	</div>

	<!-- colors -->
	<div>
		{#each gradient.colors as color, i}
			<ColorInput {color} on:focus={() => (current = i)} on:submit={handleColorValue(i)} />
			<StopInput {color} on:focus={() => (current = i)} on:submit={handleColorStop(i)} />
		{/each}
	</div>

	<!-- current color -->
	<div>
		<RgbaEditor color={gradient.colors[current]} on:change={handleColorValue(current)} />
		<HsvEditor color={gradient.colors[current]} on:change={handleColorValue(current)} />
	</div>
</div>
