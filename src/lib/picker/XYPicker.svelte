<script lang="ts">
	import { bound } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	const dispatch = createEventDispatcher<{
		/**
		 * returns an object with an x and y property that range from 0 - 1, the percentage
		 * of the point of contact relative to the area of the picker
		 */
		pick: { x: number; y: number };
	}>();

	export let xValue: number;
	export let xMax: number;
	export let yValue: number;
	export let yMax: number;
	export let invertY: boolean = true;
	export let style: string;

	let state = spring({ x: 0, y: 0 }, { stiffness: 0.3, damping: 0.7 });
	let container: HTMLDivElement;
	let isDragging = false;

	$: fixedValue = {
		x: bound(0, (xValue / xMax) * 100, 100),
		y: bound(0, (yValue / yMax) * 100, 100)
	};
	$: state.set(fixedValue);

	const pick = (xPosition: number, yPosition: number) => {
		const width = container.offsetWidth;
		const height = container.offsetHeight;
		const relativeX = xPosition - container.getBoundingClientRect().left;
		const relativeY = yPosition - container.getBoundingClientRect().top;

		const x = bound(0, relativeX / width, 1);
		const y = invertY ? 1 - bound(0, relativeY / height, 1) : bound(0, relativeY / height, 1);
		dispatch('pick', { x, y });
	};

	const handleMouseup = () => {
    if (isDragging) {
      isDragging = false;
    }
	};

	const handleMousedown = (e: MouseEvent) => {
		isDragging = true;
		// prevent selecting text
		e.preventDefault();
		pick(e.clientX, e.clientY);
	};

	const handleMousemove = (e: MouseEvent) => {
		if (!isDragging) return;
		pick(e.clientX, e.clientY);
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

<div
	{style}
	role="none"
	on:mousedown={handleMousedown}
	class="picker-container"
	bind:this={container}
>
	<div class="picker-thumb" style={`left: ${$state.x}%; top: ${$state.y}%;`} />
	<slot />
</div>

<style>
	.picker-container {
		position: relative;
		width: 16rem;
		height: 6rem;
		z-index: 0;
	}

	.picker-thumb {
		z-index: 50;
		left: 0;
		top: 0;
		width: 6px;
		height: 6px;
		position: absolute;
		border: 2px solid black;
		transform: translate(-50%, -50%);
	}
</style>
