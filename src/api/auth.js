// src/api/auth.js
import API from "./axios";

// Register
export const registerTeam = async ({ name, password }) => {
  const res = await API.post("/auth/register", { name, password });
  return res.data;
};

// Login
export const loginTeam = async ({ name, password }) => {
  const res = await API.post("/auth/login", { name, password });
  const { token } = res.data;
  if (token) localStorage.setItem("token", token);
  return res.data;
};
