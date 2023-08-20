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

<div>
	<ControlledInput max={255} value={rgbColor.r} on:input={handleRGB('r')}>R</ControlledInput>
	<ControlledInput max={255} value={rgbColor.g} on:input={handleRGB('g')}>G</ControlledInput>
	<ControlledInput max={255} value={rgbColor.b} on:input={handleRGB('b')}>B</ControlledInput>
	<ControlledInput max={100} value={Math.round(rgbColor.a * 100)} on:input={handleRGB('a')}>A</ControlledInput>
</div>
