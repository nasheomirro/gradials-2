<script lang="ts">
	import type { Gradient } from '$lib/app/types';
	import ColorInput from '$lib/input/ColorInput.svelte';

	/** a Gradient object that must be bound */
	export let gradient: Gradient;
	let current = 0;
</script>

<div>
	<ul>
		{#each gradient.colors as color, i}
			<ColorInput bind:color on:focus={() => (current = i)} />
		{/each}
	</ul>
</div>
