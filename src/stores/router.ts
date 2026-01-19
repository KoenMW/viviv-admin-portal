import type { Component } from "svelte";
import Home from "../views/Home.svelte";
import { writable } from "svelte/store";
import { routeParam } from "../consts";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import UserManagement from "../views/UserManagement.svelte";
import UserDetail from "../views/UserDetail.svelte";
import QuestionnaireManagement from "../views/QuestionnaireManagement.svelte";
import QuestionnaireDetail from "../views/QuestionnaireDetail.svelte";
import ProviderManagement from "../views/ProviderManagement.svelte";
import ProviderDetails from "../views/ProviderDetail.svelte"

export type Routes = Record<Paths, Component>;

export type Paths =
  | ""
  | "questionnaireManagement"
  | "questionnaireDetails"
  | "login"
  | "register"
  | "usersManagement"
  | "userDetails"
  | "providerManagement"
  | "providerDetails";

export const routes: Routes = {
  "": Home,
  login: Login,
  register: Register,
  usersManagement: UserManagement,
  userDetails: UserDetail,
  questionnaireManagement: QuestionnaireManagement,
  questionnaireDetails: QuestionnaireDetail,
  providerManagement: ProviderManagement,
  providerDetails: ProviderDetails,
};

export const route = writable<Paths>("");

const setRouteAndParams = () => {
  const searchParams = new URLSearchParams(location.search);
  route.set((searchParams.get(routeParam) as Paths) ?? "");
};

export const goTo = (destination: Paths) => {
  const url = new URL(globalThis.location.href);
  url.searchParams.set(routeParam, destination);

  history.pushState({}, "", url);
  setRouteAndParams();
};

setRouteAndParams();
