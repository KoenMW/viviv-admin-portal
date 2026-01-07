<script lang="ts">
  import type { User } from "../../types";

  type props = {
    user: User;
  };

  let { user }: props = $props();

  let originalUser: User = { ...user };
  let isDirty: boolean = $state(false);
</script>

<tr>
  <td>{user.id}</td>
  <td>{user.name}</td>
  <td>{user.email}</td>
  <!-- <td>{user.role.name}</td> -->
  <td><button class="save" disabled={!isDirty}>Save</button></td>
  <td><button class="delete">Delete</button></td>
</tr>

<style>
  td {
    border: 1px solid #ddd;
    padding: 0.5rem;
    text-align: left;
  }

  .save {
    --color: var(--c-green);
  }

  .delete {
    --color: var(--c-red);
  }
</style>
