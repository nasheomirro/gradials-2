<script lang="ts">
	import { bound } from '$lib/utils';
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

		state = bound(0, numType === 'float' ? Number(value) : parseInt(value), max);
		dispatch('input', state);
	};
</script>

<label class="label flex items-center gap-2">
  {#if $$slots.default}
	<span class="font-bold text-surface-400-500-token"><slot /></span>
  {/if}
	<input class="input rounded-lg w-full text-center" type="number" bind:value={state} on:input={handleInput} on:blur={() => (state = value)} />
</label>
