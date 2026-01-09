<script lang="ts">
  import Link from "../lib/common/Link.svelte";
  import { post } from "../util/api";
  import { AddToast, AddToastPromise } from "../util/toast";

  let email: string = $state("");
  let password: string = $state("");
  let username: string = $state("");
  let registered: boolean = $state(false);
  let loading: boolean = $state(false);

  let form: HTMLFormElement | null = $state(null);

  const handleSubmit = async (event: Event) => {
    if (!form) {
      throw new Error("Form element not found");
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    loading = true;

    const promise = new Promise<void>(async (resolve, reject) => {
      try {
        const response = await post(
          `${import.meta.env.VITE_USER_API_URL}users`,
          {
            email,
            password,
            name: username,
          }
        );

        if (response.ok) {
          registered = true;
        } else if (response.status === 400) {
          AddToast("Invalid email or password.", "error");
          reject("Invalid email or password.");
        } else {
          AddToast("An error occurred. Please try again later.", "error");
          reject("An error occurred. Please try again later.");
        }
        resolve();
      } catch (error) {
        console.error("Registration error:", error);
        AddToast("An error occurred. Please try again later.", "error");
        reject(error);
      } finally {
        loading = false;
      }
    });

    AddToastPromise(promise, {
      loading: "Registering...",
      success: "Registration successful!",
      error: "Registration failed.",
    });
    await promise;
  };
</script>

{#if !registered}
  <form bind:this={form}>
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
