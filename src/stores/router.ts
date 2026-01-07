import type { Component } from "svelte";
import Home from "../views/Home.svelte";
import { writable } from "svelte/store";
import { routeParam } from "../consts";
import Login from "../views/Login.svelte";
import Register from "../views/Register.svelte";
import Users from "../views/Users.svelte";

export type Routes = Record<string, Component>;

export type Paths =
  | ""
  | "questionnaires"
  | "results"
  | "login"
  | "register"
  | "users";

export const routes: Routes = {
  "": Home,
  login: Login,
  register: Register,
  users: Users,
};

export const route = writable<string>("");

const setRouteAndParams = () => {
  const searchParams = new URLSearchParams(location.search);
  route.set(searchParams.get(routeParam) ?? "");
};

export const goTo = (route: Paths) => {
  const url = new URL(globalThis.location.href);
  url.searchParams.set(routeParam, route);

  history.pushState({}, "", url);
  window.location.reload();
};

setRouteAndParams();
