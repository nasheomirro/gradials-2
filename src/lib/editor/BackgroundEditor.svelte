<script lang="ts">
	import { twJoin } from 'tailwind-merge';
	import { backgrounds, showPanel } from '$lib/app/store';
	import type { Background } from '$lib/app/types';
	import { createDefaultGradient, getBackgroundViewString } from '$lib/utils';
	import BackgroundView from './BackgroundView.svelte';
	import GradientEditor from './GradientEditor.svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { quintInOut } from 'svelte/easing';
	import ColorInput from '$lib/input/ColorInput.svelte';
	import { colord } from 'colord';

	export let background: Background;
	$: backgroundString = getBackgroundViewString(background);
</script>

<div class="relative overflow-hidden grow lg:flex">
	<div
		class={twJoin(
			'p-4 blg:absolute z-10 bg-surface-100-800-token  w-full h-full border-r border-surface-400-500-token overflow-y-auto top-0 left-0 sm:max-w-md transition-transform',
			$showPanel ? 'blg:translate-x-0' : 'blg:-translate-x-full'
		)}
	>
		<div class="mb-6 gap-4 flex flex-col items-start">
			<input
				class="bg-transparent border-t-0 border-l-0 border-r-0 p-0 pb-1 text-xl focus:shadow-none focus:outline-none focus:ring-0 border-b"
				value={background.name}
				on:input={(e) => {
					backgrounds.updateBackground(background.id, (draft) => {
						draft.name = e.currentTarget.value;
					});
				}}
			/>
			<div class="flex flex-wrap gap-2">
				<button
					class="btn btn-sm variant-ghost-error"
					on:click={() => backgrounds.deleteBackground(background.id)}>delete background</button
				>
				<button
					class="btn variant-ghost-primary btn-sm"
					on:click={() => {
						backgrounds.updateBackground(background.id, (draft) => {
							draft.gradients.unshift(createDefaultGradient());
						});
					}}>create new gradient</button
				>
			</div>
			<div class="max-w-sm">
				<label for="bg-color" class="label mb-1">background-color:</label>
				<ColorInput
					id="bg-color"
					color={{ rgb: colord(background.bgColor).toRgb() }}
					on:submit={(e) => {
						backgrounds.updateBackground(background.id, (draft) => {
							draft.bgColor = colord(e.detail).toHex();
						});
					}}
				/>
			</div>
		</div>

		<ul class="space-y-6 mb-4">
			{#each background.gradients as gradient (gradient.id)}
				<div transition:fly={{ x: -100 }} animate:flip={{ duration: 300, easing: quintInOut }}>
					<GradientEditor
						{gradient}
						on:move={(e) => {
							backgrounds.updateBackground(background.id, (draft) => {
								let i = draft.gradients.findIndex((_gradient) => _gradient.id === gradient.id);
								if (i !== -1) {
									if (e.detail === 'up' && i < draft.gradients.length - 1) {
										let temp = draft.gradients[i + 1];
										draft.gradients[i + 1] = draft.gradients[i];
										draft.gradients[i] = temp;
									} else if (e.detail === 'down' && i > 0) {
										let temp = draft.gradients[i - 1];
										draft.gradients[i - 1] = draft.gradients[i];
										draft.gradients[i] = temp;
									}
								}
							});
						}}
						on:deleteself={(e) => {
							backgrounds.updateBackground(background.id, (draft) => {
								draft.gradients = draft.gradients.filter(
									(_gradient) => _gradient.id !== gradient.id
								);
							});
						}}
						on:change={(e) => {
							backgrounds.updateBackground(background.id, (draft) => {
								let i = draft.gradients.findIndex((_gradient) => _gradient.id === gradient.id);
								if (i !== -1) {
									draft.gradients[i] = e.detail;
								}
							});
						}}
					/>
				</div>
			{/each}
		</ul>
	</div>

	<div class="flex flex-col grow w-full h-full bg-surface-200-700-token">
		<BackgroundView
			style={backgroundString}
			gradients={background.gradients}
			on:pick={(e) => {
				backgrounds.updateBackground(background.id, (draft) => {
					let i = draft.gradients.findIndex((gradient) => gradient.id === e.detail.id);
					if (i !== -1) {
						draft.gradients[i].x = e.detail.x;
						draft.gradients[i].y = e.detail.y;
					}
				});
			}}
		/>
		<div class="relative max-w-full">
			<div class="p-4 h-24 font-mono text-sm overflow-y-auto bg-surface-800 text-white">
				{backgroundString}
			</div>
			<div class="absolute bottom-4 right-4">
				<button
					on:click={() => navigator.clipboard.writeText(backgroundString)}
					class="btn btn-sm variant-filled-primary">copy</button
				>
			</div>
		</div>
	</div>
</div>
