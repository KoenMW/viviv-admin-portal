<script lang="ts">
  import Link from "../lib/common/Link.svelte";
  import { jwtStore } from "../stores/jwt";
  import { goTo } from "../stores/router";
  import { post } from "../util/api";

  let email: string = $state("");
  let password: string = $state("");
  let username: string = $state("");
  let errorMessage: string = $state("");

  $effect(() => {
    if (email || password) {
      clearError();
    }
  });

  const clearError = () => {
    errorMessage = "";
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();

    const response = await post(`${import.meta.env.VITE_USER_API_URL}users`, {
      email,
      password,
      name: username,
    });

    if (response.ok) {
      const loginResponse = await post(
        `${import.meta.env.VITE_USER_API_URL}auth/login`,
        {
          email,
          password,
        }
      );
      const data = await loginResponse.json();
      jwtStore.set(data.token);
      goTo("");
    } else if (response.status === 400) {
      errorMessage = "Invalid email or password.";
    } else {
      errorMessage = "An error occurred. Please try again later.";
    }
  };
</script>

<form>
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

  <button type="submit" onclick={handleSubmit}>Register</button>
  <p
    >Already have an account? <Link path="login" color="blue">Login here</Link
    >.</p
  >
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
    background-color: var(--c-background-secondary);
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
