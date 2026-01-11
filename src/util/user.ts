import { get } from "svelte/store";
import type { User } from "../types";
import { rolesStore } from "../stores/roles";
import { del, post, put } from "./api";
import { AddToastPromise } from "./toast";

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
  const promise = del(`${import.meta.env.VITE_USER_API_URL}users/${user.id}`);
  AddToastPromise(promise, {
    loading: `Deleting user ${user.name}...`,
    success: `User ${user.name} deleted successfully.`,
    error: `Failed to delete user ${user.name}.`,
  });
  return await promise;
};

export const UpdateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  const promise = put(
    `${import.meta.env.VITE_USER_API_URL}users/${user.id}`,
    user
  );
  AddToastPromise(promise, {
    loading: `Updating user ${user.name}...`,
    success: `User ${user.name} updated successfully.`,
    error: `Failed to update user ${user.name}.`,
  });
  return await promise;
};

export const CreateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  const promise = post(`${import.meta.env.VITE_USER_API_URL}users`, user);
  AddToastPromise(promise, {
    loading: `Creating user ${user.name}...`,
    success: `User ${user.name} created successfully.`,
    error: `Failed to create user ${user.name}.`,
  });
  return await promise;
};
