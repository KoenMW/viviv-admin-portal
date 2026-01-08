<script lang="ts">
  import Link from "../lib/common/Link.svelte";
  import { post } from "../util/api";

  let email: string = $state("");
  let password: string = $state("");
  let username: string = $state("");
  let errorMessage: string = $state("");
  let registered: boolean = $state(false);
  let loading: boolean = $state(false);

  let form: HTMLFormElement | null = $state(null);

  $effect(() => {
    if (email || password) {
      clearError();
    }
  });

  const clearError = () => {
    errorMessage = "";
  };

  const handleSubmit = async (event: Event) => {
    try {
      if (!form) {
        throw new Error("Form element not found");
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      event.preventDefault();

      loading = true;
      errorMessage = "";

      const response = await post(`${import.meta.env.VITE_USER_API_URL}users`, {
        email,
        password,
        name: username,
      });

      if (response.ok) {
      } else if (response.status === 400) {
        errorMessage = "Invalid email or password.";
      } else {
        errorMessage = "An error occurred. Please try again later.";
      }
    } catch (error) {
      console.error("Registration error:", error);
      errorMessage = "An error occurred. Please try again later.";
    } finally {
      loading = false;
    }
  };
</script>

{#if !registered}
  <form bind:this={form}>
    {#if errorMessage}
      <p class="error">{errorMessage}</p>
    {/if}
    <label for="username">Username:</label>
    <input
      type="text"
      id="username"
      name="username"
      required
      bind:value={username}
    />

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required bind:value={email} />

    <label for="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      required
      bind:value={password}
    />

    <button type="submit" onclick={handleSubmit}>
      {#if loading}
        <div class="spinner"></div>
      {:else}
        Register
      {/if}
    </button>
    <p>Already have an account? </p>
    <Link path="login" color="blue">Login</Link>
  </form>
{:else}
  <p
    >Registration successful! You can login once another admin upgrades your
    account
  </p>
  <Link path="login" color="blue">login</Link>
{/if}

<style>
  .error {
    font-weight: bold;

    padding: 0.5rem;
    border: 0.1rem solid var(--c-red);
    border-radius: 0.5rem;
    background-color: rgb(from var(--c-red) r g b / 0.5);
  }
</style>
