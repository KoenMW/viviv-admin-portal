<script lang="ts">
  import { onMount } from "svelte";
  import type { Question, MPHColors, Questionnaire } from "../types";
  import { get } from "../util/api";
  import {
    CreateQuestionnaire,
    DeleteQuestionnaire,
    UpdateQuestionnaire,
  } from "../util/questionnaire";
  import { goTo } from "../stores/router";
  import { getTopicColor, topicStore } from "../stores/topics";

  let questionnaireId: string = $state("");
  let originalQuestionnaire: Questionnaire | null = $state(null);

  let title = $state("");
  let color = $state<MPHColors>("blue");
  let questions = $state<Question[]>([]);

  let loading = $state(true);
  let questionsHidden = $state(false);

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
      questions = [];
      for (const q of originalQuestionnaire.questions) {
        questions.push({ ...q });
      }
    }
  };
</script>

<h2>Questionnaire Details</h2>

<section class="controls">
  <button
    type="button"
    style="--color: var(--c-blue)"
    disabled={loading}
    onclick={() => {
      questions = [
        ...questions,
        {
          id: "",
          content: "",
          topic_id: "",
          questionnaire_id: questionnaireId,
        },
      ];
    }}
  >
    Add Question
  </button>

  <button
    type="button"
    style="--color: var(--c-{questionsHidden ? 'green' : 'red'})"
    disabled={loading}
    onclick={() => {
      questionsHidden = !questionsHidden;
    }}
  >
    {questionsHidden ? "Show Questions" : "Hide Questions"}
  </button>
</section>

<form>
  <label for="title">Title:</label>
  <input type="text" id="title" bind:value={title} disabled={loading} />
  <label for="color">Color:</label>
  <select
    id="color"
    style="--background: var(--c-{color})"
    bind:value={color}
    disabled={loading}
  >
    <option value="blue" style="--color: var(--c-blue)">Blue</option>
    <option value="red" style="--color: var(--c-red)">Red</option>
    <option value="green" style="--color: var(--c-green)">Green</option>
    <option value="yellow" style="--color: var(--c-yellow)">Yellow</option>
    <option value="orange" style="--color: var(--c-orange)">Orange</option>
    <option value="purple" style="--color: var(--c-purple)">Purple</option>
  </select>

  <span class="question-count">Total Questions: {questions.length}</span>
  {#if !questionsHidden}
    {#each questions as question, index}
      <div class="question-block">
        <span>Question {index + 1} Text:</span>
        <input type="text" bind:value={question.content} disabled={loading} />
        <span>Question {index + 1} Topic:</span>
        <select
          bind:value={question.topic_id}
          disabled={loading}
          style="--background: var(--c-{getTopicColor(question.topic_id)})"
        >
          {#each $topicStore as topic}
            <option style="--color: var(--c-{topic.color})" value={topic.id}
              >{topic.name}</option
            >
          {/each}
        </select>
        <button
          type="button"
          class="danger"
          disabled={loading}
          onclick={() => {
            questions = questions.filter((q) => q !== question);
          }}
        >
          Delete Question
        </button>
      </div>
    {/each}
  {/if}

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
        const success = await UpdateQuestionnaire(editedQuestionnaire);
        loading = false;
        if (success) {
          goTo("questionnaireManagement");
        }
      }}
    >
      Save Changes
    </button>
  {:else}
    <button
      type="button"
      class="save"
      disabled={loading}
      onclick={async () => {
        loading = true;
        const success = await CreateQuestionnaire(editedQuestionnaire);
        loading = false;
        if (success) {
          goTo("questionnaireManagement");
        }
      }}
    >
      Create Questionnaire
    </button>
  {/if}
  <button
    type="button"
    onclick={async () => {
      loading = true;
      const success = await DeleteQuestionnaire(editedQuestionnaire);
      loading = false;
      if (success) {
        goTo("questionnaireManagement");
      }
    }}
  >
    Delete Questionnaire
  </button>
</form>

<style>
  .controls {
    margin: 1rem;
    padding: 2.5rem;
    position: sticky;
    top: 0;
    width: 120%;
    display: flex;
    gap: 1rem;
    justify-content: center;
    background: var(--c-background);
    z-index: 10;
  }

  .question-block {
    border: 1px solid var(--c-foreground);
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    background-color: var(--c-background);

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .question-count {
    font-weight: bold;
  }

  form {
    width: min(60rem, 90%);
  }
</style>
