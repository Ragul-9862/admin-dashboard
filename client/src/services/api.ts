import axios from "axios";

// Correct uploads folder URL
export const storage =
  (import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "https://admindashboardmongodb.netlify.app/") + "/uploads";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://admindashboardmongodb.netlify.app/api",
  withCredentials: true,
  
});


// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("Unauthorized — redirecting to login...");
    }
    return Promise.reject(err);
  }
);

export default api;
