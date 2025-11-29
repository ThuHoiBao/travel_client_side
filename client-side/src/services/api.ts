//service/api.ts
import axios from "axios";

// Your Axios instance
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
});