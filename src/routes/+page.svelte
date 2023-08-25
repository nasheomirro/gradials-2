<script lang="ts">
	import { backgrounds, showPanel } from '$lib/app/store';
	import BackgroundEditor from '$lib/editor/BackgroundEditor.svelte';

	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.css';
	import EyeIcon from '$lib/icons/EyeIcon.svelte';
	import PlusIcon from '$lib/icons/PlusIcon.svelte';
	import EyeClosedIcon from '$lib/icons/EyeClosedIcon.svelte';

	$: background = $backgrounds.backgrounds[$backgrounds.current];
</script>

<svelte:head>
  <title>Radial Background Generator</title>
</svelte:head>

<div class="flex flex-col h-full">
	<div
		class="z-50 items-center gap-4 md:p-4 flex sticky top-0 p-2 justify-between bg-surface-100-800-token shadow"
	>
		<select
			class="select w-full max-w-sm"
      value={$backgrounds.current}
			disabled={!$backgrounds.backgrounds.length}
			on:change={(e) => backgrounds.updateCurrent(Number(e.currentTarget.value))}
		>
			{#each $backgrounds.backgrounds as background, i (background.id)}
				<option value={i}>{background.name}</option>
			{/each}
		</select>
		<div class="flex md:gap-2">
			<button
				class="lg:hidden btn btn-icon btn-icon-sm text-surface-400-500-token p-1"
				on:click={() => ($showPanel = !$showPanel)}
			>
				{#if $showPanel}
					<EyeIcon />
				{:else}
					<EyeClosedIcon />
				{/if}
			</button>
			<button
				class="md:hidden btn btn-icon btn-icon-sm text-surface-400-500-token p-1"
				on:click={() => backgrounds.createBackground()}
			>
				<PlusIcon />
			</button>
			<button
				class="hidden md:block btn variant-ghost-primary"
				on:click={() => backgrounds.createBackground()}
			>
				create
			</button>
		</div>
	</div>

	{#if background}
		<BackgroundEditor {background} />
	{/if}
</div>

<!-- <pre>
  {JSON.stringify(background, null, 2)}
</pre> -->
