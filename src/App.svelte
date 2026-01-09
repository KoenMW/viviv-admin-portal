<script lang="ts">
  import { goTo, route, routes, type Paths } from "./stores/router";
  import notFound from "./views/404.svelte";
  import DarkMode from "./lib/common/DarkMode.svelte";
  import { jwtStore } from "./stores/jwt";
  import Link from "./lib/common/Link.svelte";
  import { type Component } from "svelte";
  import { logout, refreshToken } from "./util/api";

  type pageType = {
    component: Component;
  };

  let page: pageType | null = $state(null);

  const getPage = async (route: Paths): Promise<pageType> => {
    if (!$jwtStore) {
      await refreshToken();
    }
    if (!$jwtStore && route !== "login" && route !== "register") {
      goTo("login");
    }
    return {
      component: routes[route] ?? notFound,
    };
  };

  const updatePage = async (route: Paths) => {
    page = await getPage(route);
  };

  $effect(() => {
    updatePage($route);
  });
</script>

<main>
  <div id="toaster"></div>
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
        onclick={async () => {
          await logout();
          goTo("");
        }}>Logout</button
      >
    {/if}
    <DarkMode />
  </header>
  {#if page}
    <page.component />
  {/if}
</main>

<style>
  main {
    --margin: 2rem;
    display: flex;
    flex-direction: column;
    width: calc(100% - var(--margin) * 2);
    height: calc(100dvh - var(--margin) * 2);
    align-items: center;
    justify-content: flex-start;
    margin: var(--margin);
  }

  header {
    width: 100%;
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

  #toaster {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
  }
</style>
