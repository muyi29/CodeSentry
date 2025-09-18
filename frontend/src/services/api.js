import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8000/api/v1" });

export const fetchPRReview = (owner, repo, prNumber) =>
  API.get(`/review/${owner}/${repo}/${prNumber}`);
