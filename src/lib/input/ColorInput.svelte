<script lang="ts">
	import { colord, type AnyColor, type RgbaColor } from 'colord';
	import type { Color } from '$lib/app/types';
	import { createEventDispatcher } from 'svelte';
	import type { PartialExcept } from '$lib/utils';

	const dispatch = createEventDispatcher<{
		submit: RgbaColor;
	}>();

  export let id: string | undefined = undefined;
	export let color: PartialExcept<Color, 'rgb'>;
	let state: string;

	// this is needed, it hides the connection betwen state and color value.
	const update = (newState: AnyColor) => {
		state = colord(newState).toHex();
	};
	$: update(color.rgb);

	const finalizeEdit = () => {
		// prepend a '#' if the value looks like a '#-less' value
		if (
			/^[\da-fA-F]/.test(state) &&
			(state.length === 3 || state.length === 4 || state.length === 6 || state.length === 8)
		) {
			state = '#' + state;
		}
		dispatch('submit', colord(state).toRgb());
	};
</script>

<input {id} class="input rounded-lg" bind:value={state} on:focus on:change={finalizeEdit} />
