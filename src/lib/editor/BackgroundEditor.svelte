<script lang="ts">
	import { backgrounds } from '$lib/app/store';
	import type { Background } from '$lib/app/types';
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
	</label>
	<ul>
		{#each background.gradients as gradient (gradient.id)}
			<GradientEditor
				{gradient}
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
