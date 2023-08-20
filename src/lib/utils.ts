export const bound = (min: number, n: number, max: number) => {
	return n > max ? max : n < min ? min : n;
};

export const toFixed = (n: number, p: number = 2) => {
	return parseFloat(n.toFixed(p));
};
