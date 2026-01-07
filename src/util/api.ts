import { get as getStore } from "svelte/store";
import { jwtStore } from "../stores/jwt";

const ensureAuthorizationHeader = (options: RequestInit): RequestInit => {
  const jwt = getStore(jwtStore);
  if (!jwt) return options;

  if (
    !options.headers ||
    !(
      options.headers instanceof Headers && options.headers.has("Authorization")
    )
  ) {
    return {
      ...options,
      headers: {
        ...(options.headers as Record<string, string>),
        Authorization: `Bearer ${jwt}`,
      },
    };
  }
  return options;
};

export const get = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  options = ensureAuthorizationHeader(options);

  const response = await fetch(url, {
    ...options,
    method: "GET",
  });
  return response.json() as Promise<T>;
};

export const post = async (
  url: string,
  body: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  options = ensureAuthorizationHeader(options);

  const response = await fetch(url, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
  return response;
};
