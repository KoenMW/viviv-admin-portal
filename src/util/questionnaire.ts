import type { Questionnaire } from "../types";
import { del, post, put } from "./api";
import { AddToastPromise } from "./toast";

export const DeleteQuestionnaire = async (questionnaire: Questionnaire) => {
  if (
    !confirm(
      `Are you sure you want to delete questionnaire ${questionnaire.title}?`
    )
  ) {
    return { ok: false, error: "Questionnaire deletion cancelled" };
  }

  const promise = del(
    `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/${questionnaire.id}`
  );
  AddToastPromise(promise, {
    loading: `Deleting questionnaire ${questionnaire.title}...`,
    success: `Questionnaire ${questionnaire.title} deleted successfully.`,
    error: `Failed to delete questionnaire ${questionnaire.title}.`,
  });
  return await promise;
};

export const UpdateQuestionnaire = async (questionnaire: Questionnaire) => {
  const promise = put(
    `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/${questionnaire.id}`,
    questionnaire
  );
  AddToastPromise(promise, {
    loading: `Updating questionnaire ${questionnaire.title}...`,
    success: `Questionnaire ${questionnaire.title} updated successfully.`,
    error: `Failed to update questionnaire ${questionnaire.title}.`,
  });
  return await promise;
};

/**
 * Updates questions in a questionnaire, including deleting specified questions.
 * only returns a response if an error occurs.
 * @param questionnaire
 * @param deleteIds
 * @returns
 */
export const UpdateQuestionsInQuestionnaire = async (
  questionnaire: Questionnaire,
  deleteIds: string[]
) => {
  for (const id of deleteIds) {
    const promise = del(
      `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questions/${id}`
    );
    AddToastPromise(promise, {
      loading: `Deleting question in questionnaire ${questionnaire.title}...`,
      success: `Question in questionnaire ${questionnaire.title} deleted successfully.`,
      error: `Failed to delete question in questionnaire ${questionnaire.title}.`,
    });
    const response = await promise;
    if (!response.ok) {
      return response;
    }
  }

  for (const [index, question] of questionnaire.questions.entries()) {
    question.questionnaire_id = questionnaire.id;

    if (question.id === "") {
      const promise = post(
        `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questions`,
        question
      );
      AddToastPromise(promise, {
        loading: `Adding question ${index + 1} to questionnaire ${questionnaire.title}...`,
        success: `Question ${index + 1} added to questionnaire ${questionnaire.title} successfully.`,
        error: `Failed to add question ${index + 1} to questionnaire ${questionnaire.title}.`,
      });
      const response = await promise;
      if (!response.ok) {
        return response;
      }
    } else {
      const promise = put(
        `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questions/${question.id}`,
        question
      );
      AddToastPromise(promise, {
        loading: `Updating question ${index + 1} in questionnaire ${questionnaire.title}...`,
        success: `Question ${index + 1} in questionnaire ${questionnaire.title} updated successfully.`,
        error: `Failed to update question ${index + 1} in questionnaire ${questionnaire.title}.`,
      });
      const response = await promise;
      if (!response.ok) {
        return response;
      }
    }
  }
};

export const CreateQuestionnaire = async (questionnaire: Questionnaire) => {
  const promise = post(
    `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires`,
    questionnaire
  );
  AddToastPromise(promise, {
    loading: `Creating questionnaire ${questionnaire.title}...`,
    success: `Questionnaire ${questionnaire.title} created successfully.`,
    error: `Failed to create questionnaire ${questionnaire.title}.`,
  });
  return await promise;
};
