// constants/api.ts
import axios from "axios";

const API_BASE = __DEV__
  ? "http://localhost:8081" // or whatever you use for local dev
  : "https://yoga-and-you-4e1482948cb3.herokuapp.com/"; // your Spring Boot backend

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
export { API_BASE };
