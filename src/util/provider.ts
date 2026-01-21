import { get } from "svelte/store";
import type { Provider, FormProvider } from "../types";
import { del, post, put } from "./api";
import { AddToastPromise } from "./toast";
import { jwtStore } from "../stores/jwt";

export const DeleteProvider = async (
  provider: FormProvider,
): Promise<boolean> => {
  const toastUpdater = AddToastPromise(`Deleting provider ${provider.name}...`);
  try {
    if (
      !confirm(`Are you sure you want to delete provider ${provider.name}?`)
    ) {
      return false;
    }

    const response = await del(
      `${import.meta.env.VITE_PROVIDER_API_URL}providers/${provider.id}`,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      },
    );
    if (response.ok) {
      toastUpdater(
        `Provider ${provider.name} deleted successfully.`,
        "success",
      );
      return true;
    } else {
      toastUpdater(`Failed to delete provider ${provider.name}.`, "error");
      return false;
    }
  } catch (error) {
    console.error("Error deleting provider:", error);
    toastUpdater(`Failed to delete provider ${provider.name}.`, "error");
    return false;
  }
};

export const UpdateProvider = async (
  provider: FormProvider,
): Promise<boolean> => {
  console.log("Updating provider:", provider);

  const toastUpdater = AddToastPromise(`Updating provider ${provider.name}...`);
  try {
    const coordsProvider = {
      id: provider.id,
      name: provider.name,
      city: provider.city,
      postcode: provider.postcode,
      street: provider.street,
      houseNumber: provider.houseNumber,
      category: provider.category,
      coords: {
        X: Number(provider.latitude),
        Y: Number(provider.longitude),
      },
    };
    const response = await put(
      `${import.meta.env.VITE_PROVIDER_API_URL}providers/${provider.id}`,
      coordsProvider,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      },
    );
    if (response.ok) {
      toastUpdater(
        `Provider ${provider.name} updated successfully.`,
        "success",
      );
      return true;
    } else {
      toastUpdater(`Failed to update provider ${provider.name}.`, "error");
      return false;
    }
  } catch (error) {
    console.error("Error updating provider:", error);
    toastUpdater(`Failed to update provider ${provider.name}.`, "error");
    return false;
  }
};

export const CreateProvider = async (
  provider: FormProvider,
): Promise<boolean> => {
  const toastUpdater = AddToastPromise(`Creating provider ${provider.name}...`);

  try {
    const coordsProvider = {
      name: provider.name,
      city: provider.city,
      postcode: provider.postcode,
      street: provider.street,
      houseNumber: provider.houseNumber,
      category: provider.category,
      coords: {
        X: Number(provider.latitude),
        Y: Number(provider.longitude),
      },
    };
    const response = await post(
      `${import.meta.env.VITE_PROVIDER_API_URL}providers`,
      coordsProvider,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      },
    );
    if (response.ok) {
      toastUpdater(
        `Provider ${provider.name} created successfully.`,
        "success",
      );
      return true;
    } else {
      toastUpdater(`Failed to create provider ${provider.name}.`, "error");
      return false;
    }
  } catch (error) {
    console.error("Error creating provider:", error);
    toastUpdater(`Failed to create provider ${provider.name}.`, "error");
    return false;
  }
};

export const toFormProvider = (p: Provider): FormProvider => {
  return {
    id: p.id,
    name: p.name,
    city: p.city,
    postcode: p.postcode,
    street: p.street,
    houseNumber: p.houseNumber,
    category: p.category,
    latitude: p.coords.X,
    longitude: p.coords.Y,
  };
};
