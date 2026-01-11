import { get, writable } from "svelte/store";
import type { Topic } from "../types";

export const topicStore = writable<Topic[] | null>(null);

export const fetchTopics = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_QUESTIONNAIRE_API_URL}topics`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch topics");
    }
    const data = await response.json();

    console.log("Fetched topics:", data);

    topicStore.set(data);
  } catch (error) {
    console.error("Error fetching topics:", error);
    topicStore.set(null);
  }
};

topicStore.subscribe(async (topics) => {
  console.log("Topics store subscription triggered:", topics);
  if (topics === null) {
    await fetchTopics();
  }
});

export const getTopicColor = (topicId: string): string => {
  let color = "red";

  const topics = get(topicStore);
  if (topics) {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      color = topic.color;
    }
  }

  return color;
};
