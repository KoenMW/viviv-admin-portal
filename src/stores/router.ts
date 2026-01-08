import type { Component } from "svelte";
import Home from "../views/Home.svelte";
import { writable } from "svelte/store";
import { routeParam } from "../consts";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import UserManagement from "../views/UserManagement.svelte";

export type Routes = Record<Paths, Component>;

export type Paths =
  | ""
  | "questionnaireManagement"
  | "questionnaireDetails"
  | "login"
  | "register"
  | "usersManagement"
  | "userDetails";

export const routes: Routes = {
  "": Home,
  login: Login,
  register: Register,
  usersManagement: UserManagement,
  userDetails: Home,
  questionnaireManagement: Home,
  questionnaireDetails: Home,
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
