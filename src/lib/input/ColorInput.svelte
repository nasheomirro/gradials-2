<script lang="ts">
	import { colord } from 'colord';
	import type { Color } from '$lib/app/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: string;
	}>();

	export let color: Color;
	let state = color.value;

	// this is needed, it hides the dependency for color value.
	const update = (newState: string) => {
		state = newState;
	};
	$: update(color.value);

	const finalizeEdit = () => {
		if (state === color.value) return;

		// prepend a '#' if the value looks like a '#-less' value
		if (
			/^[\da-fA-F]/.test(state) &&
			(state.length === 3 || state.length === 4 || state.length === 6 || state.length === 8)
		) {
			state = '#' + state;
		}

		const final = colord(state).toHex();

		dispatch('submit', final);
	};
</script>

<label>
	<span>value</span>
	<input bind:value={state} on:focus on:change={finalizeEdit} />
</label>
