import { writable } from "svelte/store";

export const jwtStore = writable<string | null>(localStorage.getItem("jwt"));

jwtStore.subscribe((value) => {
  localStorage.setItem("jwt", value ?? "");
});
