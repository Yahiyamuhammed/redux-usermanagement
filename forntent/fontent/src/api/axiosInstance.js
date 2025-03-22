import axios from "axios";
const API = axios.create({
    baseURL: "http://localhost:3000/api",
    
})
// Add interceptor to automatically set Authorization header
API.interceptors.request.use(
    (config) => {

        console.log('entered the api sending');
        
        const token = sessionStorage.getItem("token"); // or sessionStorage.getItem("token")
        if (token) {
            console.log('token found on api',token);
            
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default API