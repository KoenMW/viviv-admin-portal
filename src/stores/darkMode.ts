import { writable } from "svelte/store";

const initialDarkMode = localStorage.getItem("darkMode") === "true";

export const darkMode = writable<boolean>(initialDarkMode);

darkMode.subscribe((value) => {
  document.documentElement.classList.toggle("light", value);
  localStorage.setItem("darkMode", value ? "true" : "false");
});
