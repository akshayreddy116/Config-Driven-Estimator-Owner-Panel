import axios from "axios";

const api = axios.create({
  baseURL:
    "http://localhost:4000/api" || 
    import.meta.env.VITE_API_URL ,

  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("roof_estimator_owner_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Public
export const fetchPublicConfig = async () => {
  const { data } = await api.get("/config");
  return data;
};

export const submitEstimate = async (payload) => {
  const { data } = await api.post("/estimate", payload);
  return data;
};

// Auth
export const ownerLogin = async (username, password) => {
  const { data } = await api.post("/auth/login", {
    username,
    password,
  });

  return data;
};

// Admin
export const fetchAdminConfig = async () => {
  const { data } = await api.get("/admin/config");
  return data;
};

export const saveAdminConfig = async (config) => {
  const { data } = await api.put("/admin/config", config);
  return data;
};

export const fetchAdminLeads = async () => {
  const { data } = await api.get("/admin/leads");
  return data;
};

export default api;