import { get } from "svelte/store";
import type { Provider } from "../types";
import { del, post, put } from "./api";
import { AddToastPromise } from "./toast";

export const DeleteProvider = async (provider: provider) => {
  if (!confirm(`Are you sure you want to delete provider ${provider.name}?`)) {
    return { ok: false, error: "Provider deletion cancelled" };
  }

  const toastUpdate = AddToastPromise("Deleting provider " + provider.name + "...");

  const response = await del(
    `${import.meta.env.VITE_PROVIDER_API_URL}providers/${provider.id}`
  );

  if (response.ok) {
    toastUpdate("Provider " + user.name + " deleted successfully.", "success");
  } else {
    toastUpdate("Failed to delete user " + user.name + ".", "error");
  }

  return response;
};

export const UpdateProvider = async (provider: Provider) => {
  provider.role = GetProviderRoleName(provider);

  const toastUpdate = AddToastPromise(`Updating provider ${provider.name}...`);

  const response = await put(
    `${import.meta.env.VITE_PROVIDER_API_URL}providers/${provider.id}`,
    provider
  );

  if (response.ok) {
    toastUpdate(`Provider ${provider.name} updated successfully.`, "success");
  } else {
    toastUpdate(`Failed to update provider ${provider.name}.`, "error");
  }
  return response;
};

export const CreateProvider = async (provider: Provider) => {
  provider.role = GetProviderRoleName(provider);

  const toastUpdate = AddToastPromise(`Creating provider ${provider.name}...`);

  const response = await post(
    `${import.meta.env.VITE_PROVIDER_API_URL}providers`,
    provider
  );

  if (response.ok) {
    toastUpdate(`Provider ${provider.name} created successfully.`, "success");
  } else {
    toastUpdate(`Failed to create provider ${provider.name}.`, "error");
  }

  return response;
};
