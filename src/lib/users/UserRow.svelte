<script lang="ts">
  import type { User } from "../../types";
  import { DeleteUser } from "../../util/user";
  import Link from "../common/Link.svelte";

  type props = {
    user: User;
    refresh: () => void;
  };

  let { user, refresh }: props = $props();
</script>

<tr>
  <td class="hidden-small">{user.id}</td>
  <td>{user.name}</td>
  <td class="hidden-small">{user.email}</td>
  <td class="hidden-small">{user.role}</td>
  <td>
    <div class="actions">
      <Link path="userDetails" params={{ id: user.id }} color="blue">Edit</Link
      ><button
        class="delete"
        onclick={async () => {
          await DeleteUser(user);
          refresh();
        }}>Delete</button
      >
    </div>
  </td>
</tr>
