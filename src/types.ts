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

export type Topic = {
  id: string;
  name: string;
  color: MPHColors;
};

export type Question = {
  id: string;
  topic_id: string;
  questionnaire_id: string;
  content: string;
};

export type Questionnaire = {
  id: string;
  title: string;
  questions: Question[];
  color: MPHColors;
};

export type MPHTopic = {
  id: string;
  name: string;
  color: MPHColors;
};

export type Role = {
  id: number;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role_id: number;
  role: string;
};

export type FormProvider = {
    id: string;
    name: string;
    city: string;
    postcode: string;
    street: string;
    houseNumber: string;
    category: string;
    latitude: number;
    longitude: number;
}

export type Provider = {
    id: string;
    name: string;
    city: string;
    postcode: string;
    street: string;
    houseNumber: string;
    category: string;
    coords: {
        X: number;
        Y: number;
    };
}
