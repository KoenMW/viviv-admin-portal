<script lang="ts">
  import { onMount } from "svelte";
  import type { Provider } from "../types";
  import { get } from "../util/api";
  import { goTo } from "../stores/router";
  import { rolesStore } from "../stores/roles";
  import { CreateProvider, DeleteProvider, UpdateProvider } from "../util/provider";

  let providerId: string = $state("");
  let originalProvider: Provider | null = $state(null);

  let name = $state("");
  let city = $state("");
  let postcode = $state("");
  let street = $state("");
  let houseNumber = $state("");
  let category = $state("");
  let coords = $state({X: 0.0, Y: 0.0});

  let loading = $state(true);

  let form: HTMLFormElement | null = $state(null);

  const editedProvider: Provider = $derived({
    id: providerId,
    name,
    city,
    postcode,
    street,
    houseNumber,
    category,
    coords,
  });

  let isDirty: boolean = $derived.by(() => {
    if (!originalProvider) return false;
    return (
      originalProvider.name !== name ||
      originalProvider.city !== city ||
      originalProvider.postcode !== postcode ||
      originalProvider.street !== street ||
      originalProvider.houseNumber !== houseNumber ||
      originalProvider.category !== category ||
      originalProvider.coords.X !== coords.X ||
      originalProvider.coords.Y !== coords.Y
    );
  });

  let validProvider: boolean = $derived.by(() => {
    return (
    name.trim() !== "" &&
    city.trim() !== "" &&
    postcode.trim() !== "" &&
    street.trim() !== "" &&
    houseNumber.trim() !== "" &&
    category.trim() !== "" &&
    coords.X !== 0.0 &&
    coords.Y !== 0.0
    );
  });

  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      providerId = urlParams.get("id") || "";

      if (!providerId) {
        console.error("Provider ID is missing in URL parameters.");
        return;
      }

      if (providerId) {
        const response = await get<Provider>(
          `${import.meta.env.VITE_PROVIDER_API_URL}/providers/${providerId}`
        );
        originalProvider = response;
        name = response.name
        city = response.city
        postcode = response.postcode
        street = response.street
        houseNumber = response.houseNumber
        category = response.category
        coords.X = response.coords.X
        coords.Y = response.coords.Y
      }
    } catch (error) {
      console.error("Error fetching provider details:", error);
    } finally {
      loading = false;
    }
  });

  const discardChanges = () => {
    if (originalProvider) {
      name = originalProvider.name
      city = originalProvider.city
      postcode = originalProvider.postcode
      street = originalProvider.street
      houseNumber = originalProvider.houseNumber
      category = originalProvider.category
      coords = originalProvider.coords
    }
  };

  const submitForm = async (event: Event) => {
    if (!form) {
      throw new Error("Form element not found");
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    loading = true;
    const response = providerId
      ? await UpdateProvider(editedProvider)
      : await CreateProvider(editedProvider);
    loading = false;
    if (response.ok) {
      providerId && (originalProvider = { ...editedProvider });
      goTo("providerManagement");
    }
  };
</script>

<h2>Provider Details</h2>
<form bind:this={form}>
  <label for="name"> Name: </label>
  <input type="text" id="name" disabled={loading} bind:value={name} required />

  <label for="city"> City: </label>
  <input type="text" id="city" disabled={loading} bind:value={city} required />

  <label for="postcode"> Postcode: </label>
  <input type="text" id="postcode" disabled={loading} bind:value={postcode} required />

  <label for="street"> Street: </label>
  <input type="text" id="street" disabled={loading} bind:value={street} required />

  <label for="houseNumber"> House Number: </label>
  <input type="text" id="houseNumber" disabled={loading} bind:value={houseNumber} required />
    
  <label for="category"> Category: </label>
  <input type="text" id="category" disabled={loading} bind:value={category} required />

  <label for="coords"> Latitude: </label>
  <input type="text" id="latitude" disabled={loading} bind:value={coords.X} required />

  <label for="name"> Longitude: </label>
  <input type="text" id="longitude" disabled={loading} bind:value={coords.Y} required />


  <button
    type="button"
    class="danger"
    disabled={!isDirty}
    onclick={discardChanges}
  >
    Discard Changes
  </button>
  <button
    type="submit"
    class="save"
    disabled={!validProvider || loading}
    onclick={submitForm}
  >
    {#if providerId}Save Changes
    {:else}Create Provider
    {/if}
  </button>
  <button
    type="button"
    class="danger"
    disabled={loading || !providerId}
    onclick={async () => {
      loading = true;
      const response = await DeleteProvider(editedProvider);
      loading = false;
      if (response.ok) {
        goTo("providerManagement");
      }
    }}
  >
    Delete Provider
  </button>
</form>
