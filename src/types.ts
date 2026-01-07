export type MPHColors =
  | "red"
  | "blue"
  | "yellow"
  | "orange"
  | "green"
  | "purple";

export type InputEventType = Event & {
  currentTarget: EventTarget & HTMLInputElement;
};

export type Question = {
  id: string;
  topic_id: string;
  questionnaire_id: string;
  content: string;
};

export type MPHTopic = {
  id: string;
  name: string;
  color: MPHColors;
};

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};
