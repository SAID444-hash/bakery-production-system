import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // goes through Vite proxy to Laravel
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
