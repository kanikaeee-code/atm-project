import axios from "axios";

// Base API URL (CHANGE THIS after deployment)
const API = axios.create({
  baseURL: "https://your-backend.onrender.com/api",
});

// 🔐 Attach token automatically (IMPORTANT)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = token;
  }

  return req;
});

export default API;