<script lang="ts">
	import type { Background } from '$lib/app/types';
	import GradientEditor from './GradientEditor.svelte';

  /** a Background object that must be bound */
	export let background: Background;

</script>

<div>
	<label>
		<span>name</span>
		<input bind:value={background.name} max="10" />
	</label>
  <ul>
    {#each background.gradients as gradient (gradient.id)}
      <GradientEditor  bind:gradient />
    {/each}
  </ul>
</div>
