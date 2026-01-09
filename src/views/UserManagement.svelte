<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "../types";
  import { get } from "../util/api";
  import UserRow from "../lib/users/UserRow.svelte";
  import Link from "../lib/common/Link.svelte";
  import { GetUserRoleName } from "../util/user";
  import { fetchRoles, rolesStore } from "../stores/roles";

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
      if (!$rolesStore || $rolesStore.length === 0) {
        await fetchRoles();
      }
      loading = true;
      const response = await get<User[]>(
        `${import.meta.env.VITE_USER_API_URL}users?page=${page}&per_page=${perPage}`
      );
      users = response.map((user) => ({
        ...user,
        role: GetUserRoleName(user),
      }));
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
  <Link path="userDetails" color="green">Add New User</Link>
</section>

{#if loading}
  <p>Loading users...</p>
{:else}
  <table>
    <thead>
      <tr>
        <th class="hidden-small">ID</th>
        <th>Username</th>
        <th class="hidden-small">Email</th>
        <th class="hidden-small">Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each users as user}
        <UserRow {user} refresh={fetchUsers} />
      {/each}
    </tbody>
  </table>

  <p>Total Users: {totalUsers}</p>
{/if}
