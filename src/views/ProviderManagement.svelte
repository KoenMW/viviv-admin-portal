<script lang="ts">
  import { onMount } from "svelte";
  import type { FormProvider, Provider } from "../types";
  import { get } from "../util/api";
  import ProviderRow from "../lib/providers/ProviderRow.svelte";
  import Link from "../lib/common/Link.svelte";
  import { toFormProvider } from "../util/provider";

  let page: number = $state(1);
  let perPage: number = $state(10);
  let totalProviders: number = $state(0);

  let providers: FormProvider[] = $state([]);
  let loading: boolean = $state(false);

  const getProviderCount = async (): Promise<number> => {
    try {
      const response = await get<{ count: number }>(
        `${import.meta.env.VITE_PROVIDER_API_URL}providers/count`,
      );
      return response.count;
    } catch (error) {
      console.error("Error fetching provider count:", error);
      return 0;
    }
  };

  const fetchProviders = async () => {
    try {
      loading = true;
      const response = await get<Provider[]>(
        `${import.meta.env.VITE_PROVIDER_API_URL}providers?page=${page}&per_page=${perPage}`,
      );
      providers = response.map((p) => toFormProvider(p));
      totalProviders = await getProviderCount();
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchProviders();
  });
</script>

<h1>Providers</h1>

<section>
  <button
    onclick={() => {
      page = Math.max(1, page - 1);
      fetchProviders();
    }}
    disabled={page === 1 || loading}
  >
    Previous
  </button>
  <span> Page {page} </span>
  <button
    onclick={() => {
      if (page * perPage < totalProviders) {
        page += 1;
        fetchProviders();
      }
    }}
    disabled={page * perPage >= totalProviders || loading}
  >
    Next
  </button>

  <button onclick={fetchProviders} disabled={loading}> Refresh </button>
  <Link path="providerDetails" color="green">Add New Provider</Link>
</section>

<table>
  <thead>
    <tr>
      <th class="hidden-small">ID</th>
      <th>Name</th>
      <th class="hidden-small">City</th>
      <th class="hidden-small">Postcode</th>
      <th class="hidden-small">Street</th>
      <th class="hidden-small">House Number</th>
      <th class="hidden-small">Category</th>
      <th class="hidden-small">Latitude</th>
      <th class="hidden-small">Longitude</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each providers as provider}
      <ProviderRow {provider} refresh={fetchProviders} />
    {/each}
  </tbody>
</table>

<p>Total Providers: {totalProviders}</p>
