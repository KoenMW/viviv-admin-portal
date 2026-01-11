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

  const editedUser: User = $derived({
    id: userId,
    name,
    email,
    role_id,
    role: "",
    password,
  });

  // $inspect(editedUser, "editedUser");

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
      role_id !== -1 &&
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
</script>

<h2>User Details</h2>
<form>
  <label for="name"> Name: </label>
  <input type="text" id="name" disabled={loading} bind:value={name} />
  <label for="email"> Email: </label>
  <input type="email" id="email" disabled={loading} bind:value={email} />
  {#if !userId}
    <label for="password"> Password: </label>
    <input
      type="password"
      id="password"
      disabled={loading}
      bind:value={password}
    />
  {/if}
  <label for="role"> Role: </label>
  {#if $rolesStore && $rolesStore.length > 0}
    <select id="role" disabled={loading} bind:value={role_id}>
      {#each $rolesStore as role}
        <option value={role.id}>{role.name}</option>
      {/each}
    </select>
  {:else}
    <p>Loading roles...</p>
  {/if}

  <button
    type="button"
    class="danger"
    disabled={!isDirty}
    onclick={discardChanges}
  >
    Discard Changes
  </button>
  {#if userId}
    <button
      type="button"
      class="save"
      disabled={!isDirty || !validUser || loading}
      onclick={async () => {
        loading = true;
        const response = await UpdateUser(editedUser);
        loading = false;
        if (response.ok) {
          originalUser = { ...editedUser };
        }
      }}
    >
      Save Changes
    </button>
  {:else}
    <button
      type="button"
      class="save"
      disabled={!validUser || loading}
      onclick={async () => {
        loading = true;
        const response = await CreateUser(editedUser);
        loading = false;
      }}
    >
      Create User
    </button>
  {/if}
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

<style>
  .danger {
    --color: var(--c-red);
  }

  .danger:disabled {
    --color: var(--c-foreground);
  }

  .save {
    --color: var(--c-green);
  }

  .save:disabled {
    --color: var(--c-foreground);
  }
</style>
