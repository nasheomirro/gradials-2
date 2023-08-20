<script lang="ts">
	import { bound } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	const dispatch = createEventDispatcher<{
		/** returns a number from 0 - 1, the percentage of the point of contact relative to the width of the picker */
		pick: number;
	}>();

	export let value: number;
	export let max: number;
	export let style: string;

	let state = spring(0, { stiffness: 0.3, damping: 0.7 });
	let container: HTMLDivElement;
	let isDragging = false;

	$: fixedValue = bound(0, (value / max) * 100, 100);
	$: state.set(fixedValue);

	const pick = (percentage: number) => {
		let width = container.offsetWidth;
		const relativeX = percentage - container.getBoundingClientRect().left;
		const rawPercentage = relativeX / width;
		const fixedPercentage = bound(0, rawPercentage, 1);
		dispatch('pick', fixedPercentage);
	};

	const handleMouseup = () => {
		isDragging = false;
	};
	const handleMousedown = (e: MouseEvent) => {
		isDragging = true;
		// prevent selecting text
		e.preventDefault();
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
<div class="picker-container">
	<div bind:this={container} class="picker" {style} role="none" on:mousedown={handleMousedown}>
		<div class="picker-thumb" style={`left: ${$state}%;`} />
	</div>
</div>

<style>
	.picker-thumb {
		left: 0;
		width: 5px;
		height: 100%;
		position: absolute;
		border: 2px solid black;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.picker {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.picker-container {
		background-image: linear-gradient(45deg, #ccca 25%, transparent 25%),
			linear-gradient(-45deg, #ccca 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #ccca 75%),
			linear-gradient(-45deg, transparent 75%, #ccca 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
		width: 16rem;
		height: 1.2rem;
	}
</style>
