<script lang="ts">
  import { on } from "svelte/events";
  import type { Questionnaire } from "../types";
  import { get } from "../util/api";
  import { onMount } from "svelte";
  import QuestionnaireRow from "../lib/questionnaires/QuestionnaireRow.svelte";
  import Link from "../lib/common/Link.svelte";

  let page: number = $state(1);
  let perPage: number = $state(10);
  let totalQuestionnaires: number = $state(0);

  let questionnaires: Questionnaire[] = $state([]);
  let loading: boolean = $state(false);

  const getQuestionnaireCount = async (): Promise<number> => {
    try {
      const response = await get<{ count: number }>(
        `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/count`
      );
      return response.count;
    } catch (error) {
      console.error("Error fetching questionnaire count:", error);
      return 0;
    }
  };

  const fetchQuestionnaires = async () => {
    try {
      loading = true;
      const response = await get<Questionnaire[]>(
        `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires?page=${page}&per_page=${perPage}`
      );
      questionnaires = response;
      totalQuestionnaires = await getQuestionnaireCount();
    } catch (error) {
      console.error("Error fetching questionnaires:", error);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchQuestionnaires();
  });
</script>

<h1>Questionnaires</h1>

<section>
  <button
    onclick={() => {
      page = Math.max(1, page - 1);
      fetchQuestionnaires();
    }}
    disabled={page === 1 || loading}
  >
    Previous
  </button>
  <span>Page {page}</span>
  <button
    onclick={() => {
      if (page * perPage < totalQuestionnaires) {
        page += 1;
        fetchQuestionnaires();
      }
    }}
    disabled={page * perPage >= totalQuestionnaires || loading}
  >
    Next
  </button>

  <button onclick={fetchQuestionnaires} disabled={loading}> Refresh </button>
  <Link path="questionnaireDetails" color="green">Add New Questionnaire</Link>
</section>

<table>
  <thead>
    <tr>
      <th class="hidden-small">ID</th>
      <th>Title</th>
      <th class="hidden-small">Color</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each questionnaires as questionnaire}
      <QuestionnaireRow {questionnaire} refresh={fetchQuestionnaires} />
    {/each}
  </tbody>
</table>

<p>Total Questionnaires: {totalQuestionnaires}</p>
