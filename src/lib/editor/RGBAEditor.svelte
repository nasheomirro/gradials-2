<script lang="ts">
	import type { Color } from '$lib/app/types';
	import ControlledInput from '$lib/input/ControlledInput.svelte';
	import { createEventDispatcher, type ComponentEvents } from 'svelte';
	import type { RgbaColor } from 'colord';

	const dispatch = createEventDispatcher<{
		change: RgbaColor;
	}>();

	export let color: Color;
	$: rgbColor = color.rgb;

	const handleRGB =
		(type: 'r' | 'g' | 'b' | 'a') => (e: ComponentEvents<ControlledInput>['input']) => {
			let newColor = { ...rgbColor };
			if (type === 'a') {
				newColor[type] = e.detail * 0.01;
			} else {
				newColor[type] = e.detail;
			}
			dispatch('change', newColor);
		};
</script>

<div class="max-w-xs grid grid-cols-4 text-center gap-x-3 gap-y-2 mb-4">
  <div class="font-bold text-surface-400-500-token">R</div>
  <div class="font-bold text-surface-400-500-token">G</div>
  <div class="font-bold text-surface-400-500-token">B</div>
  <div class="font-bold text-surface-400-500-token">A</div>
	<ControlledInput max={255} value={rgbColor.r} on:input={handleRGB('r')} />
	<ControlledInput max={255} value={rgbColor.g} on:input={handleRGB('g')} />
	<ControlledInput max={255} value={rgbColor.b} on:input={handleRGB('b')} />
	<ControlledInput max={100} value={Math.round(rgbColor.a * 100)} on:input={handleRGB('a')} />
</div>
