<script lang="ts">
	import { produce } from 'immer';
	import { createEventDispatcher } from 'svelte';
	import type { Color, Gradient } from '$lib/app/types';
	import ColorInput from '$lib/input/ColorInput.svelte';
	import StopInput from '$lib/input/StopInput.svelte';
	import RgbaEditor from './RGBAEditor.svelte';
	import ControlledInput from '$lib/input/ControlledInput.svelte';
	import HsvEditor from './HSVEditor.svelte';
	import { colord, type HsvaColor, type RgbaColor } from 'colord';
	import ColorStopEditor from './ColorStopEditor.svelte';
	import { isRgb } from '$lib/utils';
	import CloseIcon from '$lib/icons/CloseIcon.svelte';
	import { twJoin } from 'tailwind-merge';
	import TrashIcon from '$lib/icons/TrashIcon.svelte';
	import CircleIcon from '$lib/icons/CircleIcon.svelte';
	import EllipseIcon from '$lib/icons/EllipseIcon.svelte';

	const dispatch = createEventDispatcher<{
		change: Gradient;
		deleteself: string;
	}>();

	export let gradient: Gradient;
	let currentId: string = gradient.colors[0]?.id;
	$: currentColor = gradient.colors.find((color) => color.id === currentId);

	const handleUpdateColorValue = (id: string) => (e: CustomEvent<RgbaColor | HsvaColor>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				let i = draft.colors.findIndex((color) => color.id === id);
				if (i !== -1) {
					const color = e.detail;
					if (isRgb(color)) {
						draft.colors[i].rgb = color;
						draft.colors[i].hsv = colord(color).toHsv();
					} else {
						draft.colors[i].hsv = color;
						draft.colors[i].rgb = colord(color).toRgb();
					}
				}
			})
		);
	};

	const handleUpdateColorStop = (id: string) => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				let i = draft.colors.findIndex((color) => color.id === id);
				if (i !== -1) {
					draft.colors[i].stop = e.detail;
					draft.colors = [...draft.colors].sort((a, b) => a.stop - b.stop);
				}
			})
		);
	};

	const handleUpdateColor = (e: CustomEvent<Color>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				const i = draft.colors.findIndex((color) => color.id === e.detail.id);
				if (i !== -1) {
					draft.colors[i] = e.detail;
					draft.colors = [...draft.colors].sort((a, b) => a.stop - b.stop);
				}
			})
		);
	};

	const handleUpdatePosition = (direction: 'x' | 'y') => (e: CustomEvent<number>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft[direction] = e.detail;
			})
		);
	};

	const handleCreateColor = (e: CustomEvent<Color>) => {
		dispatch(
			'change',
			produce(gradient, (draft) => {
				draft.colors = [...draft.colors, e.detail].sort((a, b) => a.stop - b.stop);
			})
		);
	};

	const deleteColor = (id: string) => {
		if (gradient.colors.length > 2) {
			if (currentId === id) {
				let i = gradient.colors.findIndex((color) => color.id === currentId);
				if (i !== -1) {
					i = i >= gradient.colors.length - 1 ? i - 1 : i + 1;
					currentId = gradient.colors[i].id;
				}
			}
			dispatch(
				'change',
				produce(gradient, (draft) => {
					draft.colors = draft.colors.filter((color) => color.id !== id);
				})
			);
		}
	};
</script>

<div class="p-4 bg-surface-200-700-token rounded border border-surface-400">
	<div class="pb-6 border-b border-b-surface-300 space-y-2 flex flex-col">
		<button
			class="ml-auto p-0.5 btn btn-icon btn-icon-sm text-surface-400-500-token"
			on:click={() => dispatch('deleteself', gradient.id)}
		>
			<TrashIcon />
		</button>

		<div class="flex gap-2 items-center">
			<select
				value={gradient.size}
				on:change={(e) =>
					dispatch(
						'change',
						produce(gradient, (draft) => {
							// @ts-expect-error
							draft.size = e.currentTarget.value;
						})
					)}
				class="select text-sm variant-soft-surface max-w-[12rem]"
			>
				<option value="closest-side">closest-side</option>
				<option value="farthest-side">farthest-side</option>
				<option value="closest-corner">closest-corner</option>
				<option value="farthest-corner">farthest-corner</option>
			</select>
			<button
				class="btn btn-sm variant-soft-surface"
				on:click={() =>
					dispatch(
						'change',
						produce(gradient, (draft) => {
							draft.shape = draft.shape === 'circle' ? 'ellipse' : 'circle';
						})
					)}>{gradient.shape}</button
			>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<ControlledInput
				numType="float"
				on:input={handleUpdatePosition('x')}
				value={gradient.x}
				max={100}>X</ControlledInput
			>
			<ControlledInput
				numType="float"
				on:input={handleUpdatePosition('y')}
				value={gradient.y}
				max={100}>Y</ControlledInput
			>
		</div>
	</div>
	<div class="py-6 border-b border-b-surface-300">
		{#if currentColor}
			<ColorStopEditor
				{currentColor}
				colors={gradient.colors}
				on:change={handleUpdateColor}
				on:create={handleCreateColor}
				on:focus={(e) => (currentId = e.detail)}
			/>
		{/if}

		<div class="flex flex-col gap-2">
			{#each gradient.colors as color (color.id)}
				<div class="flex gap-2 items-center">
					<button
						on:click={() => (currentId = color.id)}
						style={`background-color: ${colord(color.rgb).toRgbString()}`}
						class={twJoin(
							'w-14 border border-surface-400-500-token bg-surface-400-500-token aspect-square rounded-sm',
							currentId === color.id && 'border-2 border-surface-700-200-token'
						)}
					/>
					<ColorInput
						{color}
						on:focus={() => (currentId = color.id)}
						on:submit={handleUpdateColorValue(color.id)}
					/>
					<div class="w-32">
						<StopInput
							{color}
							on:focus={() => (currentId = color.id)}
							on:submit={handleUpdateColorStop(color.id)}
						/>
					</div>
					<div>
						<button
							class="btn btn-icon text-surface-400-500-token btn-icon-sm p-1.5"
							on:click={() => deleteColor(color.id)}
						>
							<CloseIcon />
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>

	{#if currentColor}
		<!-- current color -->
		<div class="pt-6">
			<RgbaEditor color={currentColor} on:change={handleUpdateColorValue(currentId)} />
			<HsvEditor color={currentColor} on:change={handleUpdateColorValue(currentId)} />
		</div>
	{/if}
</div>
