import axios from "axios";

const adminAPI = axios.create({
    baseURL: "http://localhost:3000/api",
});

adminAPI.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default adminAPI;
