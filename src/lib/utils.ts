import type { HsvaColor, RgbaColor } from 'colord';
import type { Color } from './app/types';

export const bound = (min: number, n: number, max: number) => {
	return n > max ? max : n < min ? min : n;
};

export const isRgb = (color: any): color is RgbaColor => typeof color.r !== 'undefined';

export const toFixed = (n: number, p: number = 2) => {
	return parseFloat(n.toFixed(p));
};

/**
 * @param stop the color's stopping value
 * @param colors an array of Color objects,must be sorted by their stopping value.
 */
export const getColorBetween = (stop: number, colors: Color[]): RgbaColor | undefined => {
	if (!colors.length) return;
	let between: [Color, Color] | undefined = undefined;

	// get the two closest values, colors are sorted by stop value
	for (let i = 0; i < colors.length; i++) {
		if (colors[i].stop > stop) {
			if (colors[i - 1]) {
				between = [colors[i - 1], colors[i]];
				break;
			} else {
				// stop value is in between an edge and the first color
				return colors[i].rgb;
			}
		}
	}
	// stop value is in between an edge and the last color
	if (!between) return colors[colors.length - 1].rgb;
	// if between two values, calculate the rgb color that is supposed to be in the current stop value
	else {
		let [first, second] = between;
		let fixedPercentage = (stop - first.stop) / (second.stop - first.stop);
		let r = Math.round(first.rgb.r + (second.rgb.r - first.rgb.r) * fixedPercentage);
		let g = Math.round(first.rgb.g + (second.rgb.g - first.rgb.g) * fixedPercentage);
		let b = Math.round(first.rgb.b + (second.rgb.b - first.rgb.b) * fixedPercentage);
		return { r, g, b, a: 1 };
	}
};
