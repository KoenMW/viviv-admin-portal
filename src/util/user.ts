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

  const toastUpdate = AddToastPromise("Deleting user " + user.name + "...");

  const response = await del(
    `${import.meta.env.VITE_USER_API_URL}users/${user.id}`
  );

  if (response.ok) {
    toastUpdate("User " + user.name + " deleted successfully.", "success");
  } else {
    toastUpdate("Failed to delete user " + user.name + ".", "error");
  }

  return response;
};

export const UpdateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  const toastUpdate = AddToastPromise(`Updating user ${user.name}...`);

  const response = await put(
    `${import.meta.env.VITE_USER_API_URL}users/${user.id}`,
    user
  );

  if (response.ok) {
    toastUpdate(`User ${user.name} updated successfully.`, "success");
  } else {
    toastUpdate(`Failed to update user ${user.name}.`, "error");
  }
  return response;
};

export const CreateUser = async (user: User) => {
  user.role = GetUserRoleName(user);

  const toastUpdate = AddToastPromise(`Creating user ${user.name}...`);

  const response = await post(
    `${import.meta.env.VITE_USER_API_URL}users`,
    user
  );

  if (response.ok) {
    toastUpdate(`User ${user.name} created successfully.`, "success");
  } else {
    toastUpdate(`Failed to create user ${user.name}.`, "error");
  }

  return response;
};
