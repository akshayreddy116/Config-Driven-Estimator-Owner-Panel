const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body (e.g. 204) — leave data null
  }

  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.details = data?.details;
    throw error;
  }

  return data;
}

// --- Public estimator ---
export const fetchPublicConfig = () => request("/config");

export const submitEstimate = (payload) =>
  request("/estimate", { method: "POST", body: payload });

// --- Owner auth ---
export const ownerLogin = (username, password) =>
  request("/auth/login", { method: "POST", body: { username, password } });

// --- Owner panel (protected) ---
export const fetchAdminConfig = (token) => request("/admin/config", { token });

export const saveAdminConfig = (token, config) =>
  request("/admin/config", { method: "PUT", body: config, token });

export const fetchAdminLeads = (token) => request("/admin/leads", { token });
