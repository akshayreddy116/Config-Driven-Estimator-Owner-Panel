import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Public estimator ---

export const fetchPublicConfig = async () => {
  const response = await api.get("/config");
  return response.data;
};

export const submitEstimate = async (payload) => {
  const response = await api.post("/estimate", payload);
  return response.data;
};

// --- Owner auth ---

export const ownerLogin = async (username, password) => {
  const response = await api.post("/auth/login", {
    username,
    password,
  });

  return response.data;
};

// --- Owner panel ---

export const fetchAdminConfig = async (token) => {
  const response = await api.get("/admin/config", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const saveAdminConfig = async (token, config) => {
  const response = await api.put("/admin/config", config, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchAdminLeads = async (token) => {
  const response = await api.get("/admin/leads", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};