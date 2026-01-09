import { get } from "svelte/store";
import type { User } from "../types";
import { rolesStore } from "../stores/roles";
import { del, post, put } from "./api";

export const GetUserRoleName = (user: User) => {
  const store = get(rolesStore);
  if (store) {
    return store.find((role) => role.id === user.role_id)?.name || "";
  }
  return "unknown";
};

export const DeleteUser = async (user: User) => {
  if (!confirm(`Are you sure you want to delete user ${user.name}?`)) {
    return { ok: false, error: "User deletion cancelled" };
  }
  return await del(`${import.meta.env.VITE_USER_API_URL}/users/${user.id}`);
};

export const UpdateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  return await put(
    `${import.meta.env.VITE_USER_API_URL}/users/${user.id}`,
    user
  );
};

export const CreateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  console.log("Creating user:", user);

  const response = await post(
    `${import.meta.env.VITE_USER_API_URL}/users`,
    user
  );
  console.log("Create user response:", response);
  return response;
};
