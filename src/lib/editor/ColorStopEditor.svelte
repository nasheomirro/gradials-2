<script lang="ts">
	import type { Color } from '$lib/app/types';
	import PickerThumb from '$lib/picker/PickerThumb.svelte';
	import { bound, getColorBetween } from '$lib/utils';
	import { colord } from 'colord';
	import { nanoid } from 'nanoid';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { spring } from 'svelte/motion';

	// though could be implemented as a picker, I think it's too unique to do so.
	// Hence why this is an editor.
	const dispatch = createEventDispatcher<{
		change: Color;
		create: Color;
		focus: string;
	}>();

	export let colors: Color[];
	export let currentColor: Color;

	const state = spring(currentColor.stop, { stiffness: 0.3, damping: 0.7 });
	let container: HTMLDivElement;
	let isDragging: boolean;
	let prevColorId = currentColor.id;
	let touchId: number | null = null;

	const update = (color: Color) => {
		state.set(color.stop, { hard: prevColorId !== color.id });
		prevColorId = color.id;
	};
	$: update(currentColor);

	const getStopValue = (position: number) => {
		const width = container.offsetWidth;
		const relativeX = position - container.getBoundingClientRect().left;
		const rawPercentage = relativeX / width;
		return Math.round(bound(0, rawPercentage, 1) * 100);
	};

	const pick = (position: number) => {
		dispatch('change', { ...currentColor, stop: getStopValue(position) });
	};

	const handleCreateColor = (e: MouseEvent) => {
		const stop = getStopValue(e.clientX);
		const rgb = getColorBetween(stop, colors);
		if (rgb) {
			let color: Color = {
				rgb,
				hsv: colord(rgb).toHsv(),
				id: nanoid(6),
				stop
			};
			dispatch('create', color);
			tick().then(() => dispatch('focus', color.id));
		}
	};

	const handleMouseup = (e: MouseEvent) => {
		if (isDragging) {
			// prevent triggering createColor
			e.stopPropagation();
			isDragging = false;
		}
	};

	const handleMousedown = (id: string) => (e: MouseEvent) => {
		// prevent selecting text
		e.preventDefault();
		isDragging = true;
		dispatch('focus', id);
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

	const handleTouchstart = (id: string) => (e: TouchEvent) => {
		const touches = Array.from(e.targetTouches);
		// touch must start on element, uses one finger, and cancelable
		if (touches.length === 0 || touches.length >= 2 || !e.cancelable) return;

		e.preventDefault();
		isDragging = true;
		const touch = touches[0];
		touchId = touch.identifier;
		dispatch('focus', id);
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
		window.addEventListener('mouseup', handleMouseup, { capture: true });
    window.addEventListener('touchmove', handleTouchmove);
		window.addEventListener('touchend', handleTouchend);
		return () => {
			window.removeEventListener('mousemove', handleMousemove);
			window.removeEventListener('mouseup', handleMouseup, { capture: true });
      window.removeEventListener('touchmove', handleTouchmove);
			window.removeEventListener('touchend', handleTouchend);
		};
	});

	$: style = `
    background: linear-gradient(90deg, ${colors
			.map((color) => colord({ ...color.hsv, a: 1 }).toRgbString() + ' ' + color.stop + '%')
			.join(', ')});
  `;
</script>

<div
	{style}
	bind:this={container}
	on:mouseup|capture={handleCreateColor}
	role="none"
	class="relative w-full h-8 border border-surface-600-300-token rounded mb-4"
>
	{#each colors as color (color.id)}
		<PickerThumb
			type="long"
			style={`left: ${color.id === currentColor.id ? $state : color.stop}%;`}
			on:mousedown={handleMousedown(color.id)}
      on:touchstart={handleTouchstart(color.id)}
		/>
	{/each}
</div>
