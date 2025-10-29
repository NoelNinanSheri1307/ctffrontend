import axios from "axios";

const API = axios.create({
  baseURL: "http://13.235.68.65/api", // change if deployed
});

// Add JWT automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
