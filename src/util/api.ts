import { jwtStore } from "../stores/jwt";

export const get = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return get<T>(url, options);
    }
  }

  return response.json() as Promise<T>;
};

export const post = async (
  url: string,
  body: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });

  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return post(url, body, options);
    }
  }

  return response;
};

export const put = async (
  url: string,
  body: unknown,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: JSON.stringify(body),
  });
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return put(url, body, options);
    }
  }
  return response;
};

export const del = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const response = await fetch(url, {
    ...options,
    method: "DELETE",
    credentials: "include",
  });
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return del(url, options);
    }
  }
  return response;
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_USER_API_URL}auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const body = await response.json();
    if (body.token) {
      console.log("Refreshed token");
      jwtStore.set(body.token);
    } else {
      console.error("Failed to refresh token");
      jwtStore.set(null);
    }

    return response.ok;
  } catch (error) {
    console.error("Error refreshing token:", error);
    jwtStore.set(null);
    return false;
  }
};

export const logout = async (): Promise<void> => {
  await fetch(`${import.meta.env.VITE_USER_API_URL}auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  jwtStore.set(null);
};
