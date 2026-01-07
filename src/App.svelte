<script lang="ts">
  import { goTo, route, routes } from "./stores/router";
  import notFound from "./views/404.svelte";
  import DarkMode from "./lib/common/DarkMode.svelte";
  import { jwtStore } from "./stores/jwt";
  import Link from "./lib/common/Link.svelte";

  const page = $derived({
    component: routes[$route] ?? notFound,
  });
</script>

<main>
  <header>
    <span class="banner"></span>
    {#if $route !== ""}
      <Link path="" color="blue">Home</Link>
    {/if}
    {#if $route !== "login" && !$jwtStore}
      <Link path="login" color="green">Login</Link>
    {:else if !!$jwtStore}
      <button
        onclick={() => {
          jwtStore.set(null);
          goTo("");
        }}>Logout</button
      >
    {/if}
    <DarkMode />
  </header>
  <page.component />
</main>

<style>
  main {
    --margin: 2rem;
    display: flex;
    flex-direction: column;
    width: calc(100dvw - var(--margin) * 2);
    align-items: center;
    justify-content: center;
    margin: var(--margin);
  }

  header {
    width: 100dvw;
    position: fixed;

    top: 0;
    left: 0;
    padding: 1rem var(--margin);

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }

  .banner {
    height: 0.5rem;
    width: 100%;

    background: url("/banner_bg.svg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    box-shadow: 0 0 1rem var(--c-foreground);
  }
</style>
