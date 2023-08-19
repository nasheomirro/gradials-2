<script lang="ts">
	import type { Color } from '$lib/app/types';
	import HuePicker from '$lib/picker/HuePicker.svelte';
	import { colord, type AnyColor } from 'colord';
	import { createEventDispatcher, type ComponentEvents } from 'svelte';

	const dispatch = createEventDispatcher<{
		change: AnyColor;
	}>();

	export let color: Color;
	$: HSVColor = colord(color.value).toHsv();

	const handleHue = (e: ComponentEvents<HuePicker>['pick']) => {
		dispatch('change', colord(color.value).hue(e.detail * 100).toHsv());
	};
</script>

<HuePicker value={HSVColor.h} max={100} on:pick={handleHue} />
