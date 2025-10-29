import axios from "axios";

const API = axios.create({
  baseURL: "https://15-207-111-236.nip.io/api", // change if deployed
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
