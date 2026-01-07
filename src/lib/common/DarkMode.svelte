<script>
  import { darkMode } from "../../stores/darkMode";
</script>

<button
  onclick={() => {
    darkMode.update((m) => !m);
  }}
  aria-label="Toggle dark mode"
>
</button>

<style>
  button {
    width: 2rem;
    height: 2rem;
    border: none;
    background-image: url("/dark_mode.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
  }

  :global(.light) button {
    background-image: url("/light_mode.svg");
  }

  button:focus {
    outline: none;
  }
</style>
