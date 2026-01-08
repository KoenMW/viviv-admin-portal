<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { get } from "../util/api";
  import Link from "../lib/common/Link.svelte";
  import { goTo } from "../stores/router";

  let userId: string = $state("");
  let originalUser: User | null = $state(null);
  let editedUser: User | null = $state(null);

  const dirtyCheck = (original: User | null, edited: User | null) => {
    if (!original || !edited) return false;
    return (
      original.name !== edited.name ||
      original.email !== edited.email ||
      original.role !== edited.role
    );
  };

  let isDirty = $derived(dirtyCheck(originalUser, editedUser));

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
    }
  });

  const discardChanges = () => {
    if (originalUser) {
      editedUser = { ...originalUser };
    }
  };

  const saveChanges = async () => {
    console.log("Save changes functionality to be implemented.");
  };

  const deleteUser = async () => {
    console.log("Delete user functionality to be implemented.");
    goTo("usersManagement");
  };
</script>

{#if !userId}
  <p
    >User ID is missing. Please provide a valid user ID. <Link
      path="usersManagement"
      color="blue">Go back</Link
    ></p
  >
{:else if editedUser}
  <h2>User Details</h2>
  <form>
    <label for="name"> Name: </label>
    <input type="text" id="name" bind:value={editedUser.name} />
    <label for="email"> Email: </label>
    <input type="email" id="email" bind:value={editedUser.email} />
    <label for="role"> Role: </label>
    <input type="text" id="role" bind:value={editedUser.role} />
    <button
      type="button"
      class="danger"
      disabled={!isDirty}
      onclick={discardChanges}
    >
      Discard Changes
    </button>
    <button type="button" class="save" disabled={!isDirty} onclick={() => {}}>
      Save Changes
    </button>
    <button type="button" class="danger" onclick={deleteUser}>
      Delete User
    </button>
  </form>
{:else}
  <p>Loading user details...</p>
{/if}

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
