import { writable } from "svelte/store";

export const jwtStore = writable<string | null>(null);
