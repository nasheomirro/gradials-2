<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	const dispatch = createEventDispatcher<{
		pick: number;
	}>();

	export let value: number;
	export let max: number;

	let state = spring(0, { stiffness: 0.3, damping: 0.8 });

	const update = (newState: number) => {
		state.update(() => Math.max(0, Math.min(max, (newState / max) * 100)));
	}; 
	$: update(value);

	let container: HTMLDivElement;
	let isDragging = false;

	const pick = (percentage: number) => {
		let width = container.offsetWidth;
		const relativeX = percentage - container.getBoundingClientRect().left;
		const rawPercentage = relativeX / width;
		const fixedPercentage = Math.max(0, Math.min(1, rawPercentage));
		dispatch('pick', fixedPercentage);
	};

	const handleMouseup = () => (isDragging = false);
	const handleMousedown = (e: MouseEvent) => {
		isDragging = true;
		pick(e.clientX);
	};
	const handleMousemove = (e: MouseEvent) => {
		if (!isDragging) return;
		pick(e.clientX);
	};

	onMount(() => {
		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
		};
	});
</script>

<!-- TODO: look up accessibility for sliders -->
<div bind:this={container} class="picker" role="none" on:mousedown={handleMousedown}>
	<div class="picker-thumb" style={`left: ${$state}%;`} />
</div>

<style>
	.picker-thumb {
		left: 0;
		width: 1rem;
		height: 100%;
		position: absolute;
		background: white;
		border: 2px solid black;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.picker {
		position: relative;
		width: 16rem;
		height: 1.2rem;
		background: linear-gradient(
			to right,
			hsl(0deg 100% 50%),
			hsl(30deg 100% 50%),
			hsl(60deg 100% 50%),
			hsl(90deg 100% 50%),
			hsl(120deg 100% 50%),
			hsl(150deg 100% 50%),
			hsl(180deg 100% 50%),
			hsl(210deg 100% 50%),
			hsl(240deg 100% 50%),
			hsl(270deg 100% 50%),
			hsl(300deg 100% 50%),
			hsl(330deg 100% 50%),
			hsl(360deg 100% 50%)
		);
	}
</style>
