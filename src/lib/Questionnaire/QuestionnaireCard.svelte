<script lang="ts">
  import type { MPHColors } from "../../types";
  import Link from "../common/Link.svelte";

  type Props = {
    title: string;
    id: string;
    color: MPHColors;
  };
  let { title, id, color }: Props = $props();
</script>

<div class="container" style="--color: var(--c-{color})">
  <h3>{title}</h3>
  <Link
    path="questionnaire"
    params={{
      questionnaire: id,
    }}
    {color}
    width="100%">Kies</Link
  >
</div>

<style>
  .container {
    width: 12em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 0 0.5rem var(--color);
    padding: 1rem;
    border-radius: 1rem;
    justify-content: space-between;
  }

  :global(html.light) .container {
    box-shadow: none;
    border: 0.1rem solid var(--color);
  }

  h3 {
    background-color: var(--color);
    text-align: center;
    border-radius: 0.5rem;
    width: 90%;
    margin: 0;
    padding: 0.5rem;
    text-transform: uppercase;
    color: var(--c-white);
  }
</style>
