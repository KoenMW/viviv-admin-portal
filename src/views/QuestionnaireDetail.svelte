<script lang="ts">
  import { onMount } from "svelte";
  import type { Question, MPHColors, Questionnaire } from "../types";
  import { get } from "../util/api";
  import {
    DeleteQuestionnaire,
    UpdateQuestionnaire,
    UpdateQuestionsInQuestionnaire,
  } from "../util/questionnaire";
  import { goTo } from "../stores/router";
  import { AddToast } from "../util/toast";

  let questionnaireId: string = $state("");
  let originalQuestionnaire: Questionnaire | null = $state(null);

  let title = $state("");
  let color = $state<MPHColors>("blue");
  let questions = $state<Question[]>([]);
  let deleteIds = $state<string[]>([]);

  let loading = $state(true);

  const editedQuestionnaire: Questionnaire = $derived({
    id: questionnaireId,
    title,
    questions,
    color,
  });

  let isDirty: boolean = $derived.by(() => {
    if (!originalQuestionnaire) return false;
    return (
      originalQuestionnaire.title !== title ||
      originalQuestionnaire.color !== color ||
      JSON.stringify(originalQuestionnaire.questions) !==
        JSON.stringify(questions)
    );
  });

  onMount(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      questionnaireId = urlParams.get("id") || "";

      if (!questionnaireId) {
        console.error("Questionnaire ID is missing in URL parameters.");
        return;
      }

      if (questionnaireId) {
        const response = await get<Questionnaire>(
          `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/${questionnaireId}`
        );
        originalQuestionnaire = response;
        title = response.title;
        color = response.color;
        questions = response.questions;
      }
    } catch (error) {
      console.error("Error fetching questionnaire details:", error);
    } finally {
      loading = false;
    }
  });

  const discardChanges = () => {
    if (originalQuestionnaire) {
      title = originalQuestionnaire.title;
      color = originalQuestionnaire.color;
      questions = originalQuestionnaire.questions;
    }
  };
</script>

<h2>Questionnaire Details</h2>
<form>
  <label for="title">Title:</label>
  <input type="text" id="title" bind:value={title} disabled={loading} />
  <label for="color">Color:</label>
  <select id="color" bind:value={color} disabled={loading}>
    <option value="blue">Blue</option>
    <option value="red">Red</option>
    <option value="green">Green</option>
    <option value="yellow">Yellow</option>
    <option value="purple">Purple</option>
    <option value="orange">Orange</option>
  </select>

  {#each questions as question}
    <label> Question: {question.content}</label>
    <div class="question-block"> not implemented yet </div>
  {/each}

  <button
    type="button"
    class="danger"
    disabled={!isDirty}
    onclick={discardChanges}
  >
    Discard Changes
  </button>

  {#if questionnaireId}
    <button
      type="submit"
      class="save"
      disabled={!isDirty || loading}
      onclick={async () => {
        loading = true;
        const response = await UpdateQuestionnaire(editedQuestionnaire);
        if (!response.ok) {
          AddToast(
            "Failed to update questionnaire aborting question update",
            "error"
          );
          loading = false;
          return;
        }
        const questionResponse = await UpdateQuestionsInQuestionnaire(
          editedQuestionnaire,
          deleteIds
        );
        loading = false;
        if (!questionResponse) {
          goTo("questionnaireManagement");
        } else {
          AddToast("Failed to update questions", "error");
        }
      }}
    >
      Save Changes
    </button>
  {:else}
    <button type="submit" disabled={loading}> Create Questionnaire </button>
  {/if}
  <button
    type="button"
    onclick={async () => {
      loading = true;
      const response = await DeleteQuestionnaire(editedQuestionnaire);
      loading = false;
      if (response.ok) {
        goTo("questionnaireManagement");
      }
    }}
  >
    Delete Questionnaire
  </button>
</form>
