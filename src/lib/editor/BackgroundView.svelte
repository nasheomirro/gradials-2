<script lang="ts">
	import type { Gradient } from '$lib/app/types';
	import PickerThumb from '$lib/picker/PickerThumb.svelte';
	import { bound, toFixed } from '$lib/utils';
	import { createEventDispatcher, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	const dispatch = createEventDispatcher<{
		pick: { x: number; y: number; id: string };
	}>();
	export let gradients: Gradient[];
	export let style: string;

	const state = spring({ x: 0, y: 0 }, { damping: 0.7, stiffness: 0.3 });
	let container: HTMLDivElement;
	let currentId = '';
	let isDragging = false;

	const getPositionValue = (xPosition: number, yPosition: number) => {
		const width = container.offsetWidth;
		const height = container.offsetHeight;
		const relativeX = xPosition - container.getBoundingClientRect().left;
		const relativeY = yPosition - container.getBoundingClientRect().top;

		const x = toFixed(bound(0, relativeX / width, 1) * 100);
		const y = toFixed(bound(0, relativeY / height, 1) * 100);

		return { x, y };
	};

	const pick = (xPosition: number, yPosition: number) => {
		const { x, y } = getPositionValue(xPosition, yPosition);
		state.set({ x, y });
		dispatch('pick', { x, y, id: currentId });
	};

	const handleMouseup = (e: MouseEvent) => {
		if (isDragging) {
			pick(e.clientX, e.clientY);
			isDragging = false;
			currentId = '';
		}
	};

	const handleMousedown = (id: string) => (e: MouseEvent) => {
		// prevent selecting text
		e.preventDefault();
		currentId = id;
		isDragging = true;
		state.set(getPositionValue(e.clientX, e.clientY), { hard: true });
	};

	const handleMousemove = (e: MouseEvent) => {
		if (isDragging) {
			pick(e.clientX, e.clientY);
		}
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

<div class="p-2 h-full">
	<div
		bind:this={container}
		class="grow h-full z-0 relative border border-surface-400-500-token rounded"
		{style}
	>
		{#each gradients as gradient (gradient.id)}
			<PickerThumb
        type="square"
				style={`left: ${gradient.id === currentId ? $state.x : gradient.x}%; top: ${
					gradient.id === currentId ? $state.y : gradient.y
				}%;`}
				on:mousedown={handleMousedown(gradient.id)}
			/>
		{/each}
	</div>
</div>
