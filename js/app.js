import { start } from './router.js';

// Single shared state object; holds the refill in progress (see plan.md, Screens).
export const state = { refill: null };

start();
