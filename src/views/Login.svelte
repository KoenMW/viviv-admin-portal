<script lang="ts">
  import Link from "../lib/common/Link.svelte";
  import { jwtStore } from "../stores/jwt";
  import { goTo } from "../stores/router";
  import { get, post } from "../util/api";
  import { AddToast, AddToastPromise } from "../util/toast";

  let email: string = $state("");
  let password: string = $state("");
  let loading: boolean = $state(false);

  let form: HTMLFormElement | null = $state(null);

  const validateAdminToken = async (): Promise<boolean> => {
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

      const promise = new Promise<void>(async (resolve, reject) => {
        try {
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
              AddToast("Invalid response from server.", "error");
              reject("Invalid response from server.");
              return;
            }
            const isAdmin = await validateAdminToken();
            if (!isAdmin) {
              AddToast("You do not have admin privileges.", "error");
              reject("You do not have admin privileges.");
              return;
            }

            jwtStore.set(data.token);
            goTo("");
          } else if (response.status === 401) {
            AddToast("Invalid email or password.", "error");
            reject("Invalid email or password.");
            return;
          } else {
            AddToast("An error occurred. Please try again later.", "error");
            reject("An error occurred. Please try again later.");
            return;
          }
          resolve();
        } catch (error) {
          console.error("Login error:", error);
          AddToast("An error occurred. Please try again later.", "error");
          reject(error);
          return;
        } finally {
          loading = false;
        }
      });

      AddToastPromise(promise, {
        loading: "Logging in...",
        success: "Logged in successfully!",
        error: "Login failed.",
      });

      await promise;
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      loading = false;
    }
  };
</script>

<form bind:this={form}>
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
    Login
  </button>
  <Link path="register" color="blue">Register</Link>
</form>
