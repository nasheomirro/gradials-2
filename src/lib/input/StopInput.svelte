<script lang="ts">
	import type { Color } from '$lib/app/types';
	import { bound } from '$lib/utils';
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
	$: update(color.stop);

	const finalizeEdit = () => {
		if (state === color.stop) return;
		state = bound(0, state, 100);
		dispatch('submit', state);
	};
</script>

<label>
	<span>stop</span>
	<input bind:value={state} type="number" on:focus on:change={finalizeEdit} />
</label>
