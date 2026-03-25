import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends refresh token cookie automatically
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("apex-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expired, try to refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        localStorage.setItem("apex-token", data.accessToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem("apex-token");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
