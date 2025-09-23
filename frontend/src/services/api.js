import axios from "axios";

const API = axios.create({ baseURL: "/api/v1" }); // proxy handles the rest

export const fetchPRReview = (owner, repo, prNumber) =>
  API.get(`/review/${owner}/${repo}/${prNumber}`);
