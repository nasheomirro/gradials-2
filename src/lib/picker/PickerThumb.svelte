<script lang="ts">
	import { twJoin } from 'tailwind-merge';

	export let style: string;
	export let type: 'long' | 'square';
</script>

<div
	class={twJoin(
		'z-10 absolute left-0 bg-white border-2 border-surface-900 top-1/2 -translate-x-1/2 -translate-y-1/2',
		type === 'long' && 'h-[110%] w-2',
		type === 'square' && 'w-3 h-3'
	)}
	{style}
	role="none"
	on:mousedown
  on:touchstart
/>
