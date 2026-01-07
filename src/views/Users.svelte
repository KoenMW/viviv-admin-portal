<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { get } from "../util/api";
  import UserRow from "../lib/users/UserRow.svelte";

  let page: number = $state(1);
  let perPage: number = $state(10);
  let totalUsers: number = $state(0);

  let users: User[] = $state([]);
  let loading: boolean = $state(false);

  const getUserCount = async (): Promise<number> => {
    try {
      const response = await get<{ count: number }>(
        `${import.meta.env.VITE_USER_API_URL}users/count`
      );
      return response.count;
    } catch (error) {
      console.error("Error fetching user count:", error);
      return 0;
    }
  };

  const fetchUsers = async () => {
    try {
      loading = true;
      const response = await get<User[]>(
        `${import.meta.env.VITE_USER_API_URL}users?page=${page}&per_page=${perPage}`
      );
      users = response;
      totalUsers = await getUserCount();
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchUsers();
  });
</script>

<svelte:head>
  <title>Users - Admin Portal</title>
</svelte:head>

<h1>Users</h1>

<section>
  <button
    onclick={() => {
      page = Math.max(1, page - 1);
      fetchUsers();
    }}
    disabled={page === 1 || loading}
  >
    Previous
  </button>
  <span> Page {page} </span>
  <button
    onclick={() => {
      page += 1;
      fetchUsers();
    }}
    disabled={loading || users.length < perPage}
  >
    Next
  </button>

  <button onclick={fetchUsers} disabled={loading}> Refresh </button>
</section>

{#if loading}
  <p>Loading users...</p>
{:else}
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Email</th>
        <!-- <th>Role</th> -->
        <th>Actions</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <UserRow {user} />
      {/each}
    </tbody>
  </table>

  <p>Total Users: {totalUsers}</p>
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }

  th {
    background-color: var(--c-offwhite);
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }

  button:disabled {
    background-color: var(--c-foreground);
    cursor: not-allowed;
  }
</style>
