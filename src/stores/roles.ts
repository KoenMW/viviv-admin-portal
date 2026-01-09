import { writable } from "svelte/store";
import type { Role } from "../types";

export const rolesStore = writable<Role[] | null>(null);

export const fetchRoles = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_USER_API_URL}/users/roles`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch roles");
    }

    const data: { roles: Role[] } = await response.json();
    rolesStore.set(data.roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    rolesStore.set([]);
  }
};

rolesStore.subscribe(async (roles) => {
  if (roles === null) {
    await fetchRoles();
  }
});
