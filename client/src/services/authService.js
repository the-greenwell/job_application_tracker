import axios from "axios";
import api from "./api";
import { BASEURL, ENDPOINTS } from "../constants/api";

const AUTH = ENDPOINTS.AUTH;

const register = async (payload) => {
    const { first_name, last_name, email, password } = payload;
    const response = await api.post(`${AUTH}/register`, { first_name, last_name, email, password });
    return response.data;
};

const login = async (payload) => {
    const { email, password } = payload;
    const response = await api.post(`${AUTH}/login`, { email, password });
    return response.data;
};

const logout = async () => {
    const response = await api.post(`${AUTH}/logout`);
    return response.data;
};

const refreshAccessToken = async () => {
    const response = await axios.post(
        `${BASEURL + AUTH}/refresh`,
        {},
        { withCredentials: true }
    );
    return response.data;
};

export {
    register,
    login,
    logout,
    refreshAccessToken
};