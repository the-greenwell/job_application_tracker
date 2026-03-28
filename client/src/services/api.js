import axios from 'axios';
import { ENDPOINTS, BASEURL } from '../constants/api';

let accessToken = null;

const setAccessToken = (token) => {
    accessToken = token;
}

const clearAccessToken = () => {
    accessToken = null;
}

let onSessionExpired = null;

const registerExpiredSessionHandler = (callback) => {
    onSessionExpired = callback;
}

const api = axios.create({
    baseURL: BASEURL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${BASEURL + ENDPOINTS.AUTH}/refresh`,
                    {},
                    { withCredentials: true }
                );
                
                setAccessToken(data.accessToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                clearAccessToken();
                if (onSessionExpired) onSessionExpired();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export {
    setAccessToken,
    clearAccessToken,
    registerExpiredSessionHandler,
};

export default api;