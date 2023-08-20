<script lang="ts">
	import type { Color } from '$lib/app/types';
	import Picker from '$lib/picker/Picker.svelte';
	import { colord, type HsvaColor } from 'colord';
	import { createEventDispatcher, type ComponentEvents } from 'svelte';

	const dispatch = createEventDispatcher<{
		change: HsvaColor;
	}>();

	export let color: Color;
	$: HSVColor = color.hsv;

	const handleHue = (e: ComponentEvents<Picker>['pick']) => {
		dispatch('change', { ...HSVColor, h: Math.round(e.detail * 360) });
	};
	const handleAlpha = (e: ComponentEvents<Picker>['pick']) => {
		dispatch('change', { ...HSVColor, a: parseFloat(e.detail.toFixed(2)) });
	};

	const huePickerStyle = `
  background: linear-gradient(
			to right,
			hsl(0deg 100% 50%),
			hsl(30deg 100% 50%),
			hsl(60deg 100% 50%),
			hsl(90deg 100% 50%),
			hsl(120deg 100% 50%),
			hsl(150deg 100% 50%),
			hsl(180deg 100% 50%),
			hsl(210deg 100% 50%),
			hsl(240deg 100% 50%),
			hsl(270deg 100% 50%),
			hsl(300deg 100% 50%),
			hsl(330deg 100% 50%),
			hsl(360deg 100% 50%)
		);`;

	$: alphaPickerStyle = `background: linear-gradient(
      to right,
      ${colord({ ...HSVColor, a: 0 }).toHslString()},
      ${colord({ ...HSVColor, a: 100 }).toHslString()}
    );`;
</script>

<Picker style={huePickerStyle} value={HSVColor.h} max={360} on:pick={handleHue} />
<Picker style={alphaPickerStyle} value={HSVColor.a} max={1} on:pick={handleAlpha} />
