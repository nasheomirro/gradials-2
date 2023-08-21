<script lang="ts">
	import { backgrounds } from '$lib/app/store';
	import BackgroundEditor from '$lib/editor/BackgroundEditor.svelte';
	import '$lib/scss/app.scss';

	$: background = $backgrounds.backgrounds[$backgrounds.current];
</script>

<div>
  <button on:click={() => backgrounds.createBackground()}>new background</button>
	{#each $backgrounds.backgrounds as background, i (background.id)}
		<button on:click={() => backgrounds.updateCurrent(i)}>
			change current to {background.name}
		</button>
	{/each}
</div>

{#if background}
	<BackgroundEditor {background} />
{/if}

<pre>
  {JSON.stringify(background, null, 2)}
</pre>
