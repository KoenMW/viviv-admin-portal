<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { get } from "../util/api";
  import { goTo } from "../stores/router";
  import { rolesStore } from "../stores/roles";
  import { CreateUser, DeleteUser, UpdateUser } from "../util/user";

  let userId: string = $state("");
  let originalUser: User | null = $state(null);

  let name = $state("");
  let email = $state("");
  let role_id = $state(-1);
  let password = $state("");

  let loading = $state(true);

  let form: HTMLFormElement | null = $state(null);

  const editedUser: User = $derived({
    id: userId,
    name,
    email,
    role_id,
    role: "",
    password,
  });

  let isDirty: boolean = $derived.by(() => {
    if (!originalUser) return false;
    return (
      originalUser.name !== name ||
      originalUser.email !== email ||
      originalUser.role_id !== role_id
    );
  });

  let validUser: boolean = $derived.by(() => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      (userId ? role_id !== -1 : true) &&
      (userId ? true : password.trim() !== "")
    );
  });

  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      userId = urlParams.get("id") || "";

      if (!userId) {
        console.error("User ID is missing in URL parameters.");
        return;
      }

      if (userId) {
        const response = await get<User>(
          `${import.meta.env.VITE_USER_API_URL}/users/${userId}`
        );
        originalUser = response;
        name = response.name;
        email = response.email;
        role_id = response.role_id;
        password = "";
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      loading = false;
    }
  });

  const discardChanges = () => {
    if (originalUser) {
      name = originalUser.name;
      email = originalUser.email;
      role_id = originalUser.role_id;
      password = "";
    }
  };

  const submitForm = async (event: Event) => {
    if (!form) {
      throw new Error("Form element not found");
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    event.preventDefault();

    loading = true;
    const response = userId
      ? await UpdateUser(editedUser)
      : await CreateUser(editedUser);
    loading = false;
    if (response.ok) {
      userId && (originalUser = { ...editedUser });
      goTo("usersManagement");
    }
  };
</script>

<h2>User Details</h2>
<form bind:this={form}>
  <label for="name"> Name: </label>
  <input type="text" id="name" disabled={loading} bind:value={name} required />
  <label for="email"> Email: </label>
  <input
    type="email"
    id="email"
    disabled={loading}
    bind:value={email}
    required
  />
  {#if !userId}
    <label for="password"> Password: </label>
    <input
      type="password"
      id="password"
      disabled={loading}
      bind:value={password}
      required
      minlength="8"
    />
  {/if}
  {#if userId}
    {#if $rolesStore && $rolesStore.length > 0}
      <label for="role"> Role: </label>
      <select id="role" disabled={loading} bind:value={role_id} required>
        {#each $rolesStore as role}
          <option value={role.id}>{role.name}</option>
        {/each}
      </select>
    {:else}
      <p>Loading roles...</p>
    {/if}
  {/if}

  <button
    type="button"
    class="danger"
    disabled={!isDirty}
    onclick={discardChanges}
  >
    Discard Changes
  </button>
  <button
    type="submit"
    class="save"
    disabled={!validUser || loading}
    onclick={submitForm}
  >
    {#if userId}Save Changes
    {:else}Create User
    {/if}
  </button>
  <button
    type="button"
    class="danger"
    disabled={loading || !userId}
    onclick={async () => {
      loading = true;
      const response = await DeleteUser(editedUser);
      loading = false;
      if (response.ok) {
        goTo("usersManagement");
      }
    }}
  >
    Delete User
  </button>
</form>
