<script lang="ts">
  import Link from "../lib/common/Link.svelte";
  import { jwtStore } from "../stores/jwt";
  import { goTo } from "../stores/router";
  import { get, post } from "../util/api";

  let email: string = $state("");
  let password: string = $state("");
  let errorMessage: string = $state("");
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

  const validateAdminToken = async (token: string): Promise<boolean> => {
    try {
      const auth = await get<{
        ID: string;
        role: string;
      }>(`${import.meta.env.VITE_USER_API_URL}auth/authorize`);

      if (!auth || !auth.role) {
        return false;
      }

      return auth.role === "admin";
    } catch (error) {
      console.error("Error validating admin token:", error);
      return false;
    }
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

      const response = await post(
        `${import.meta.env.VITE_USER_API_URL}auth/login`,
        {
          email,
          password,
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (!data.token || typeof data.token !== "string") {
          errorMessage = "Invalid response from server.";
          return;
        }
        const isAdmin = await validateAdminToken(data.token);
        if (!isAdmin) {
          errorMessage = "You do not have admin privileges.";
          return;
        }

        jwtStore.set(data.token);
        errorMessage = "";
        goTo("");
      } else if (response.status === 401) {
        errorMessage = "Invalid email or password.";
      } else {
        errorMessage = "An error occurred. Please try again later.";
      }
    } catch (error) {
      console.error("Login error:", error);
      errorMessage = "An error occurred. Please try again later.";
    } finally {
      loading = false;
    }
  };
</script>

<form bind:this={form}>
  {#if errorMessage}
    <p class="error">{errorMessage}</p>
  {/if}
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

  <button type="submit" onclick={handleSubmit} disabled={loading}>
    {#if loading}
      <div class="spinner"></div>
    {:else}
      Login
    {/if}
  </button>
  <Link path="register" color="blue">Register</Link>
</form>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: min(30rem, 80%);
    padding: 2rem;
    box-shadow: 0 0 1rem var(--c-foreground);
    border-radius: 1rem;
  }

  label {
    font-weight: bold;
  }

  input {
    padding: 0.5rem;
    border: 0.1rem solid var(--c-foreground);
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .error {
    font-weight: bold;

    padding: 0.5rem;
    border: 0.1rem solid var(--c-red);
    border-radius: 0.5rem;
    background-color: rgb(from var(--c-red) r g b / 0.5);
  }
</style>
