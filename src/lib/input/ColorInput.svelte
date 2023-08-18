<script lang="ts">
	import { colord } from 'colord';
	import type { Color } from '$lib/app/types';

	/** a Color object that must be bound */
	export let color: Color;

	let isFocused = false;
	let state = color.value;

	const update = (newState: string) => {
		state = newState;
	};

	// on edit stop listening to color value changes,
	// this might not be necessary but it makes me sleep at night
	$: isFocused || update(color.value);

	const handleFocus = () => {
		isFocused = true;
	};

	const handleBlur = () => {
		isFocused = false;
		finalizeEdit();
	};

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			finalizeEdit();
		}
	};

	const finalizeEdit = () => {
		if (state === color.value) return;

		// prepend a '#' if the value looks like a '#-less' value
		if (
			/^[\da-fA-F]/.test(state) &&
			(state.length === 3 || state.length === 6 || state.length === 8)
		) {
			state = '#' + state;
		}

		const final = colord(state).toHex();
		color.value = final;
		state = final;
	};
</script>

<label>
	<span>value</span>
	<input
		on:focus
		bind:value={state}
		on:focus={handleFocus}
		on:blur={handleBlur}
		on:keydown={handleKeydown}
	/>
</label>
