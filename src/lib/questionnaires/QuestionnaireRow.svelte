<script lang="ts">
  import type { Questionnaire } from "../../types";
  import { DeleteQuestionnaire } from "../../util/questionnaire";
  import Link from "../common/Link.svelte";

  type props = {
    questionnaire: Questionnaire;
    refresh: () => void;
  };

  let { questionnaire, refresh }: props = $props();
</script>

<tr>
  <td class="hidden-small">{questionnaire.id}</td>
  <td>{questionnaire.title}</td>
  <td class="hidden-small">{questionnaire.color}</td>
  <td>
    <div class="actions">
      <Link
        path="questionnaireDetails"
        params={{ id: questionnaire.id }}
        color="blue">Edit</Link
      ><button
        class="delete"
        onclick={async () => {
          await DeleteQuestionnaire(questionnaire);
          refresh();
        }}>Delete</button
      >
    </div></td
  >
</tr>
