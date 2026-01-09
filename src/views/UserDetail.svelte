<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { get } from "../util/api";
  import { goTo } from "../stores/router";
  import { rolesStore } from "../stores/roles";
  import { CreateUser, DeleteUser, UpdateUser } from "../util/user";

  let userId: string = $state("");
  let originalUser: User | null = $state(null);
  let editedUser: User = $state({
    id: "",
    name: "",
    email: "",
    role: "",
    role_id: "",
    password: "",
  });
  let loading = $state(true);

  const dirtyCheck = (original: User | null, edited: User | null) => {
    if (!original || !edited) return false;
    return (
      original.name !== edited.name ||
      original.email !== edited.email ||
      original.role !== edited.role
    );
  };

  const checkUserValidity = (user: User | null) => {
    if (!user) return false;
    return (
      user.name.trim() !== "" &&
      user.email.trim() !== "" &&
      user.role.trim() !== ""
    );
  };

  let isDirty = $derived(dirtyCheck(originalUser, editedUser));
  let validUser = $derived(checkUserValidity(editedUser));

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
        editedUser = { ...originalUser };
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      loading = false;
    }
  });

  const discardChanges = () => {
    if (originalUser) {
      editedUser = { ...originalUser };
    }
  };
</script>

<h2>User Details</h2>
<form>
  <label for="name"> Name: </label>
  <input
    type="text"
    id="name"
    disabled={loading}
    bind:value={editedUser.name}
  />
  <label for="email"> Email: </label>
  <input
    type="email"
    id="email"
    disabled={loading}
    bind:value={editedUser.email}
  />
  {#if !userId}
    <label for="password"> Password: </label>
    <input
      type="password"
      id="password"
      disabled={loading}
      bind:value={editedUser.password}
    />
  {/if}
  <label for="role"> Role: </label>
  {#if $rolesStore && $rolesStore.length > 0}
    <select id="role" disabled={loading} bind:value={editedUser.role}>
      {#each $rolesStore as role}
        <option value={role.name}>{role.name}</option>
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
