<script lang="ts">
	import { bound } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import PickerThumb from './PickerThumb.svelte';

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

	$: fixedValue = {
		x: bound(0, (xValue / xMax) * 100, 100),
		y: bound(0, (yValue / yMax) * 100, 100)
	};

	let state = spring<{ x: number; y: number }>(fixedValue, { stiffness: 0.3, damping: 0.7 });
	let container: HTMLDivElement;
	let isDragging = false;
	let touchId: number | null = null;

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
		if (isDragging) {
			pick(e.clientX, e.clientY);
		}
	};

	const handleTouchend = (e: TouchEvent) => {
		if (isDragging) {
			const touches = Array.from(e.changedTouches);
			touches.forEach((touch) => {
				if (touch.identifier === touchId) {
					touchId = null;
					isDragging = false;
				}
			});
		}
	};

	const handleTouchstart = (e: TouchEvent) => {
		const touches = Array.from(e.targetTouches);
		// touch must start on element, uses one finger, and cancelable
		if (touches.length === 0 || touches.length >= 2 || !e.cancelable) return;

		e.preventDefault();
		isDragging = true;
		const touch = touches[0];
		touchId = touch.identifier;
		pick(touch.clientX, touch.clientY);
	};

	const handleTouchmove = (e: TouchEvent) => {
		if (isDragging) {
			const touches = Array.from(e.changedTouches);
			touches.forEach((touch) => {
				if (touch.identifier === touchId) {
					pick(touch.clientX, touch.clientY);
				}
			});
		}
	};

	onMount(() => {
		window.addEventListener('mousemove', handleMousemove);
		window.addEventListener('mouseup', handleMouseup);
		window.addEventListener('touchmove', handleTouchmove);
		window.addEventListener('touchend', handleTouchend);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup);
			window.removeEventListener('touchmove', handleTouchmove);
			window.removeEventListener('touchend', handleTouchend);
		};
	});
</script>

<div
	{style}
	role="none"
	on:mousedown={handleMousedown}
	class="relative w-full h-28 border border-surface-600-300-token"
	bind:this={container}
>
	<PickerThumb
		on:touchstart={handleTouchstart}
		type="square"
		style={`left: ${$state.x}%; top: ${$state.y}%;`}
	/>
	<slot />
</div>
