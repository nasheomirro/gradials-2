<script lang="ts">
	import type { Color } from '$lib/app/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: number;
	}>();

	export let color: Color;
	let state = color.stop;

	// this is needed, it hides the dependency for color stop.
	const update = (newState: number) => {
		state = newState;
	};

	// on edit stop listening to color value changes
	$: update(color.stop);

	const finalizeEdit = () => {
		if (state === color.stop) return;
		state = Math.max(0, Math.min(100, state));
		dispatch('submit', state);
	};
</script>

<label>
	<span>value</span>
	<input bind:value={state} type="number" on:focus on:change={finalizeEdit} />
</label>
