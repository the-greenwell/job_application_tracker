import axios from 'axios';

let accessToken = null;

const setAccessToken = (token) => {
    accessToken = token;
}

const clearAccessToken = () => {
    accessToken = null;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
})