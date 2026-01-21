<script lang="ts">
  import type { Provider, FormProvider } from "../../types";
  import { DeleteProvider } from "../../util/provider";
  import Link from "../common/Link.svelte";

  type props = {
    provider: FormProvider;
    refresh: () => void;
  };

  let { provider, refresh }: props = $props();
</script>

<tr>
  <td class="hidden-small">{provider.id}</td>
  <td>{provider.name}</td>
  <td class="hidden-small">{provider.city}</td>
  <td class="hidden-small">{provider.postcode}</td>
  <td class="hidden-small">{provider.street}</td>
  <td class="hidden-small">{provider.houseNumber}</td>
  <td class="hidden-small">{provider.category}</td>
  <td class="hidden-small">{provider.latitude}</td>
  <td class="hidden-small">{provider.longitude}</td>
  <td>
    <div class="actions">
      <Link path="providerDetails" params={{ id: provider.id }} color="blue">Edit</Link
      ><button
        class="delete"
        onclick={async () => {
          await DeleteProvider(provider);
          refresh();
        }}>Delete</button
      >
    </div>
  </td>
</tr>
