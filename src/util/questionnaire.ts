import { get } from "svelte/store";
import type { Questionnaire } from "../types";
import { del, post, put } from "./api";
import { AddToastPromise } from "./toast";
import { jwtStore } from "../stores/jwt";

export const DeleteQuestionnaire = async (
  questionnaire: Questionnaire
): Promise<boolean> => {
  const toastUpdater = AddToastPromise(
    `Deleting questionnaire ${questionnaire.title}...`
  );
  try {
    if (
      !confirm(
        `Are you sure you want to delete questionnaire ${questionnaire.title}?`
      )
    ) {
      return false;
    }

    const response = await del(
      `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/${questionnaire.id}`,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      }
    );
    if (response.ok) {
      toastUpdater(
        `Questionnaire ${questionnaire.title} deleted successfully.`,
        "success"
      );
      return true;
    } else {
      toastUpdater(
        `Failed to delete questionnaire ${questionnaire.title}.`,
        "error"
      );
      return false;
    }
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    toastUpdater(
      `Failed to delete questionnaire ${questionnaire.title}.`,
      "error"
    );
    return false;
  }
};

export const UpdateQuestionnaire = async (
  questionnaire: Questionnaire
): Promise<boolean> => {
  const toastUpdater = AddToastPromise(
    `Updating questionnaire ${questionnaire.title}...`
  );
  try {
    const response = await put(
      `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires/${questionnaire.id}`,
      questionnaire,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      }
    );
    if (response.ok) {
      toastUpdater(
        `Questionnaire ${questionnaire.title} updated successfully.`,
        "success"
      );
      return true;
    } else {
      toastUpdater(
        `Failed to update questionnaire ${questionnaire.title}.`,
        "error"
      );
      return false;
    }
  } catch (error) {
    console.error("Error updating questionnaire:", error);
    toastUpdater(
      `Failed to update questionnaire ${questionnaire.title}.`,
      "error"
    );
    return false;
  }
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
): Promise<boolean> => {
  console.log(
    "to do: implement UpdateQuestionsInQuestionnaire",
    questionnaire,
    deleteIds
  );
  return false;
};

export const CreateQuestionnaire = async (
  questionnaire: Questionnaire
): Promise<boolean> => {
  const toastUpdater = AddToastPromise(
    `Creating questionnaire ${questionnaire.title}...`
  );

  try {
    const response = await post(
      `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}questionnaires`,
      questionnaire,
      {
        headers: {
          Authorization: `Bearer ${get(jwtStore)}`,
        },
      }
    );
    if (response.ok) {
      toastUpdater(
        `Questionnaire ${questionnaire.title} created successfully.`,
        "success"
      );
      return true;
    } else {
      toastUpdater(
        `Failed to create questionnaire ${questionnaire.title}.`,
        "error"
      );
      return false;
    }
  } catch (error) {
    console.error("Error creating questionnaire:", error);
    toastUpdater(
      `Failed to create questionnaire ${questionnaire.title}.`,
      "error"
    );
    return false;
  }
};
