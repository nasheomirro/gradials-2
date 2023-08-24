<script lang="ts">
	import type { Color } from '$lib/app/types';
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

	const handleStopDrag = (e: MouseEvent) => {
		if (isDragging) {
			// prevent triggering createColor
			e.stopPropagation();
			isDragging = false;
		}
	};

	const handleStartDrag = (id: string) => (e: MouseEvent) => {
		// prevent selecting text
		e.preventDefault();
		isDragging = true;
		dispatch('focus', id);
	};

	const handleDragging = (e: MouseEvent) => {
		if (!isDragging) return;
		pick(e.clientX);
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

	onMount(() => {
		window.addEventListener('mousemove', handleDragging);
		window.addEventListener('mouseup', handleStopDrag, { capture: true });
		return () => {
			window.removeEventListener('mousemove', handleDragging);
			window.removeEventListener('mouseup', handleStopDrag, { capture: true });
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
	class="picker mb-4"
>
	{#each colors as color (color.id)}
		<div
			style={`left: ${color.id === currentColor.id ? $state : color.stop}%;`}
			class="picker-thumb"
			role="none"
			on:mousedown={handleStartDrag(color.id)}
		/>
	{/each}
</div>

<style lang="postcss">
	.picker {
		@apply relative w-full h-8 border border-surface-600-300-token rounded;
	}

	.picker-thumb {
		left: 0;
		width: 6px;
		height: 110%;
    background-color: white;
		position: absolute;
		border: 2px solid black;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>
