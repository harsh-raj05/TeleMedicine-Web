import axios from "axios";

const api = axios.create({
  baseURL: "https://telemedicine-web.onrender.com/api",
});

// ADD TOKEN TO EVERY REQUEST AUTOMATICALLY
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
