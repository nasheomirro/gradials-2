export type Color = {
	value: string;
	stop: number;
};

export type Gradient = {
	id: string;
	x: number;
	y: number;
	shape: 'circle' | 'ellipse';
	colors: Color[];
};
