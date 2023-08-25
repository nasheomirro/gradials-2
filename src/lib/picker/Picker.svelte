<script lang="ts">
	import { bound } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import PickerThumb from './PickerThumb.svelte';

	const dispatch = createEventDispatcher<{
		/**
		 * returns a number from 0 - 1, the percentage of the
		 * point of contact relative to the width of the picker
		 */
		pick: number;
	}>();

	export let value: number;
	export let max: number;
	export let style: string;

	$: fixedValue = bound(0, (value / max) * 100, 100);

	let state = spring<number>(fixedValue, { stiffness: 0.3, damping: 0.7 });
	let container: HTMLDivElement;
	let isDragging = false;

	/** the ID for the touch if one was started */
	let touchId: number | null = null;

	$: state.set(fixedValue);

	const pick = (position: number) => {
		let width = container.offsetWidth;
		const relativeX = position - container.getBoundingClientRect().left;
		const rawPercentage = relativeX / width;
		const fixedPercentage = bound(0, rawPercentage, 1);
		dispatch('pick', fixedPercentage);
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
		pick(e.clientX);
	};

	const handleMousemove = (e: MouseEvent) => {
		if (isDragging) {
			pick(e.clientX);
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
		pick(touch.clientX);
	};

	const handleTouchmove = (e: TouchEvent) => {
		if (isDragging) {
			const touches = Array.from(e.changedTouches);
			touches.forEach((touch) => {
				if (touch.identifier === touchId) {
					pick(touch.clientX);
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

<!-- TODO: look up accessibility for sliders -->
<div class="alpha-bg relative w-full h-8 border border-surface-600-300-token rounded">
	<div
		bind:this={container}
		class="relative w-full h-full"
		{style}
		role="none"
		on:mousedown={handleMousedown}
	>
		<PickerThumb on:touchstart={handleTouchstart} type="long" style={`left: ${$state}%;`} />
	</div>
</div>

<style>
	.alpha-bg {
		background-image: linear-gradient(45deg, #ccca 25%, transparent 25%),
			linear-gradient(-45deg, #ccca 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #ccca 75%),
			linear-gradient(-45deg, transparent 75%, #ccca 75%);
		background-size: 20px 20px;
		background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
	}
</style>
