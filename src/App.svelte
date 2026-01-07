<script lang="ts">
  import { goTo, route, routes } from "./stores/router";
  import notFound from "./views/404.svelte";
  import DarkMode from "./lib/common/DarkMode.svelte";
  import { jwtStore } from "./stores/jwt";
  import Link from "./lib/common/Link.svelte";

  const getPage = (route: string) => {
    if (!$jwtStore && route !== "login" && route !== "register") {
      goTo("login");
    }
    return {
      component: routes[route] ?? notFound,
    };
  };

  const page = $derived(getPage($route));
</script>

<main>
  <header>
    <span class="banner"></span>
    <div class="origin">ADMIN PORTAL</div>
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
    height: calc(100dvh - var(--margin) * 2);
    align-items: center;
    justify-content: flex-start;
    margin: var(--margin);
  }

  header {
    width: 100dvw;
    position: sticky;

    top: 0;

    padding: 1rem var(--margin);

    margin-bottom: var(--margin);

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;

    background-color: var(--c-background);
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

  .origin {
    margin-right: auto;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--c-accent);
  }
</style>
