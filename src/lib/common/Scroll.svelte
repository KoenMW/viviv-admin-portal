<script lang="ts">
  import { onMount } from "svelte";

  let visible: boolean = $state(false);
  let up: boolean = $state(false);

  const toggleScroll = () => {
    const main = document.querySelector("main");
    if (!main) return;
    visible = main.scrollHeight > window.innerHeight;
  };

  onMount(() => {
    const main = document.querySelector("main");
    if (!main) return;

    visible = main.scrollHeight > window.innerHeight;
    const observer = new ResizeObserver(() => {
      toggleScroll();
    });
    observer.observe(main);

    return () => observer.disconnect();
  });

  const handleClick = () => {
    const main = document.querySelector("main");
    if (!main) return;

    if (main.scrollTop + main.clientHeight + 10 >= main.scrollHeight) {
      main.scrollTo({ top: 0, behavior: "smooth" });
      up = false;
    } else {
      main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
      up = true;
    }
  };
</script>

<button
  id="scrollToggle"
  class:visible
  class:up
  aria-label="Scroll"
  onclick={handleClick}>↓</button
>

<style>
  button {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    border: none;
    background-color: var(--c-foreground);
    color: var(--c-background);
    cursor: pointer;
    cursor: pointer;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  #scrollToggle.visible {
    opacity: 1;
    pointer-events: auto;
  }

  #scrollToggle.up {
    transform: rotate(180deg);
  }
</style>
