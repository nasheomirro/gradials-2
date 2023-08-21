<script lang="ts">
	import { backgrounds } from '$lib/app/store';
	import type { Background } from '$lib/app/types';
	import { createDefaultGradient } from '$lib/utils';
	import GradientEditor from './GradientEditor.svelte';

	export let background: Background;
</script>

<div>
	<label>
		<span>name</span>
		<input
			value={background.name}
			on:input={(e) => {
				backgrounds.updateBackground(background.id, (draft) => {
					draft.name = e.currentTarget.value;
				});
			}}
		/>
    <button on:click={() => backgrounds.deleteBackground(background.id)}>delete self</button>
	</label>
	<ul>
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
	<button
		on:click={() => {
			backgrounds.updateBackground(background.id, (draft) => {
				draft.gradients.push(createDefaultGradient());
			});
		}}>create new gradient</button
	>
</div>
