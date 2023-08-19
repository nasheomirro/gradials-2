import type { AnyColor } from "colord";

export type Color = {
  value: AnyColor,
	stop: number;
};

export type Gradient = {
	id: string;
	x: number;
	y: number;
	shape: 'circle' | 'ellipse';
	colors: Color[];
};

export type Background = {
  name: string;
  id: string;
  openedAt: Date;
  gradients: Gradient[];
}

export type BackgroundHistory = {
  depth: number;
  states: Background[];
}