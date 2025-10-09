import axios from "axios";

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 60000, // 60 seconds for AI processing
});

// Request interceptor for logging
API.interceptors.request.use(
  (config) => {
    console.log(`Making request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.message);
    } else {
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const fetchPRReview = (owner, repo, prNumber) =>
  API.get(`/review/${owner}/${repo}/${prNumber}`);

export const healthCheck = () => API.get("/health");