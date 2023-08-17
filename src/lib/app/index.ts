import type { Gradient } from './types';
import { writable } from 'svelte/store';

export const gradients = writable<Gradient[]>([]);