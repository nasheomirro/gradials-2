import type { HsvaColor, RgbaColor } from 'colord';

export type Color = {
	rgb: RgbaColor;
	hsv: HsvaColor;
	stop: number;
	id: string;
};

export type Gradient = {
	id: string;
	x: number;
	y: number;
	shape: 'circle' | 'ellipse';
	size: 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner';
	colors: Color[];
};

export type Background = {
	name: string;
  bgColor: string;
	id: string;
	gradients: Gradient[];
};

export type BackgroundStore = {
	current: number;
	backgrounds: Background[];
};
