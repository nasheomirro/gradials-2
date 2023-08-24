<script lang="ts">
	import { twJoin } from 'tailwind-merge';
	import { backgrounds, showPanel } from '$lib/app/store';
	import type { Background } from '$lib/app/types';
	import { createDefaultGradient } from '$lib/utils';
	import BackgroundView from './BackgroundView.svelte';
	import GradientEditor from './GradientEditor.svelte';

	export let background: Background;
</script>

<div class="relative overflow-hidden grow lg:flex">
	<div
		class={twJoin(
			'p-4 blg:absolute z-10 bg-surface-100-800-token h-full border-r border-surface-400-500-token overflow-scroll top-0 left-0 w-full sm:max-w-md transition-transform',
			$showPanel ? 'blg:translate-x-0' : 'blg:-translate-x-full'
		)}
	>
		<div class="mb-6 flex flex-col items-start">
			<input
				class="input max-w-sm"
				value={background.name}
				on:input={(e) => {
					backgrounds.updateBackground(background.id, (draft) => {
						draft.name = e.currentTarget.value;
					});
				}}
			/>
			<div class="flex flex-wrap gap-2 my-2">
				<button
					class="btn btn-sm variant-ghost-error"
					on:click={() => backgrounds.deleteBackground(background.id)}>delete background</button
				>
				<button
					class="btn variant-ghost-primary btn-sm"
					on:click={() => {
						backgrounds.updateBackground(background.id, (draft) => {
							draft.gradients.push(createDefaultGradient());
						});
					}}>create new gradient</button
				>
			</div>
		</div>

		<ul class="space-y-6 mb-4">
			{#each background.gradients as gradient (gradient.id)}
				<GradientEditor
					{gradient}
					on:deleteself={(e) => {
						backgrounds.updateBackground(background.id, (draft) => {
							draft.gradients = draft.gradients.filter((gradient) => gradient.id !== e.detail);
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
			{/each}
		</ul>
	</div>

	<BackgroundView
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
</div>
