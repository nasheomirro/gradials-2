<script lang="ts">
	import type { Color } from '$lib/app/types';
	import ControlledInput from '$lib/input/ControlledInput.svelte';
	import { createEventDispatcher, type ComponentEvents } from 'svelte';
	import { colord } from 'colord';

	const dispatch = createEventDispatcher<{
		change: string;
	}>();

	export let color: Color;
	$: rgbColor = colord(color.value).toRgb();

	const handleRGB =
		(type: 'r' | 'g' | 'b' | 'a') => (e: ComponentEvents<ControlledInput>['input']) => {
			let newColor = colord(color.value);
			if (type === 'a') {
				newColor.rgba[type] = e.detail * 0.01;
			} else {
				newColor.rgba[type] = e.detail;
			}
			dispatch('change', newColor.toHex());
		};
</script>

<div>
	<ControlledInput max={255} value={rgbColor.r} on:input={handleRGB('r')}>R</ControlledInput>
	<ControlledInput max={255} value={rgbColor.g} on:input={handleRGB('g')}>G</ControlledInput>
	<ControlledInput max={255} value={rgbColor.b} on:input={handleRGB('b')}>B</ControlledInput>
	<ControlledInput max={100} value={rgbColor.a * 100} on:input={handleRGB('a')}>A</ControlledInput>
</div>
