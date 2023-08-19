<script lang="ts">
	import { backgrounds } from '$lib/app/store';
	import BackgroundEditor from '$lib/editor/BackgroundEditor.svelte';
	import '$lib/scss/app.scss';

	$: background = $backgrounds.backgrounds[$backgrounds.current];
</script>

<!-- <button on:click={() => history.undoCurrentBackground}>undo</button> -->

{#if background}
	<BackgroundEditor {background} />
{/if}

<pre>
  {JSON.stringify(background, null, 2)}
</pre>
