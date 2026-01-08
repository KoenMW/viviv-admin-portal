<script lang="ts">
  import type { User } from "../../types";
  import Link from "../common/Link.svelte";

  type props = {
    user: User;
  };

  let { user }: props = $props();

  const DeleteUser = async (id: string) => {
    console.log("Delete user with id:", id);
  };
</script>

<tr>
  <td>{user.id}</td>
  <td>{user.name}</td>
  <td>{user.email}</td>
  <!-- <td>{user.role.name}</td> -->
  <td
    ><Link path="userDetails" params={{ id: user.id }} color="blue">Edit</Link
    ></td
  >
  <td
    ><button class="delete" onclick={() => DeleteUser(user.id)}>Delete</button
    ></td
  >
</tr>

<style>
  td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }

  .delete {
    --color: var(--c-red);
  }
</style>
