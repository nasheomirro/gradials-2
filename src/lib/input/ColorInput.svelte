<script lang="ts">
	import {  colord, type AnyColor } from 'colord';
	import type { Color } from '$lib/app/types';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		submit: string;
	}>();

	export let color: Color;
	let state: string;

	// this is needed, it hides the connection betwen state and color value.
	const update = (newState: AnyColor) => {
		state = colord(newState).toHex();
	};
	$: update(color.value);

	const finalizeEdit = () => {
		// prepend a '#' if the value looks like a '#-less' value
		if (
			/^[\da-fA-F]/.test(state) &&
			(state.length === 3 || state.length === 4 || state.length === 6 || state.length === 8)
		) {
			state = '#' + state;
		}
		dispatch('submit', colord(state).toHex());
	};
</script>

<label>
	<span>value</span>
	<input bind:value={state} on:focus on:change={finalizeEdit} />
</label>
