<script lang="ts">
	import type { Gradient } from '$lib/app/types';
	import ColorInput from '$lib/input/ColorInput.svelte';
	import StopInput from '$lib/input/StopInput.svelte';
	import { produce } from 'immer';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		change: Gradient;
	}>();

	export let gradient: Gradient;
	let current = 0;
</script>

<div>
	<ul>
		{#each gradient.colors as color, i}
			<ColorInput
				{color}
				on:focus={() => (current = i)}
				on:submit={(e) => {
					dispatch(
						'change',
						produce(gradient, (draft) => {
							draft.colors[i].value = e.detail;
						})
					);
				}}
			/>
			<StopInput
				{color}
				on:focus={() => (current = i)}
				on:submit={(e) => {
					dispatch(
						'change',
						produce(gradient, (draft) => {
							draft.colors[i].stop = e.detail;
						})
					);
				}}
			/>
		{/each}
	</ul>
</div>
