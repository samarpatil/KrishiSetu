import { request } from "./api";

export const login = async ({
  email,
  password,
}) => {
  return request("/auth/login", {
    method: "POST",
    body: {
      email,
      password,
    },
  });
};

export const register = async ({
  name,
  org,
  role,
  email,
  password,
}) => {
  return request("/auth/register", {
    method: "POST",
    body: {
      name,
      org,
      role,
      email,
      password,
    },
  });
};

export const getMe = async () => {
  return request("/auth/me");
};