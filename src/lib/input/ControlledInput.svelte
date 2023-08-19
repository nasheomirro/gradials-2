<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { FormEventHandler } from 'svelte/elements';

	const dispatch = createEventDispatcher<{
		input: number;
	}>();

  export let numType: 'int' | 'float' = 'int';
	export let value: number;
	export let max: number;
	let state: number = value;

	// this is needed, it hides the dependency for value.
	const update = (newState: number) => {
		state = newState;
	};
	$: update(value);

	const handleInput: FormEventHandler<HTMLInputElement> = (e) => {
		const value = (e.target as HTMLInputElement).value;
		if (value.length === 0) return;

		state = Math.max(0, Math.min(max, numType === 'float' ? Number(value) : parseInt(value)));
		dispatch('input', state);
	};
</script>

<label>
	<span><slot /></span>
	<input type="number" bind:value={state} on:input={handleInput} on:blur={() => (state = value)} />
</label>
