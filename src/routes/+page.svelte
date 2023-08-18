<script lang="ts">
	import { background, history } from '$lib/app';
	import BackgroundEditor from '$lib/editor/BackgroundEditor.svelte';
	import '$lib/scss/app.scss';

  $: console.log($background);
</script>

<button on:click={() => history.undoCurrentBackground}>undo</button>
<BackgroundEditor bind:background={$background} />

<pre>
  {JSON.stringify($background, null, 2)}
</pre>
